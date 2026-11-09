// Gera embeddings em lote para todos os registros que ainda não possuem embedding.
// Uso: node src/gerar-embeddings.js        (apenas registros sem embedding)
const { prisma } = require('./db');
const { MODELO, gerarEmbeddings, paraVetorSql } = require('./embeddings');

const LOTE = 64;
const MAX_CHARS = 1200; // o modelo trunca por tokens; limitar texto evita custo desnecessário

// Cada alvo define a tabela e como montar o texto que será vetorizado.
const ALVOS = [
  { tabela: 'produto', texto: `COALESCE(nome, '') || '. ' || COALESCE(descricao, '')` },
  { tabela: 'chamado_suporte', texto: `COALESCE(titulo, '') || '. ' || COALESCE(descricao, '')` },
  { tabela: 'artigo_base', texto: `COALESCE(titulo, '') || '. ' || COALESCE(conteudo, '')` },
];

async function processarAlvo(alvo) {
  const [{ total }] = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS total FROM "${alvo.tabela}" WHERE embedding IS NULL`);
  if (total === 0) {
    console.log(`- ${alvo.tabela}: nenhum registro pendente.`);
    return 0;
  }
  console.log(`- ${alvo.tabela}: ${total} registros sem embedding`);

  const inicio = Date.now();
  let feitos = 0;
  while (true) {
    const linhas = await prisma.$queryRawUnsafe(
      `SELECT id, left(${alvo.texto}, ${MAX_CHARS}) AS texto FROM "${alvo.tabela}" WHERE embedding IS NULL ORDER BY id LIMIT ${LOTE}`
    );
    if (linhas.length === 0) break;

    const vetores = await gerarEmbeddings(linhas.map((l) => l.texto));
    const ids = linhas.map((l) => l.id);
    const literais = vetores.map(paraVetorSql);
    await prisma.$executeRawUnsafe(
      `UPDATE "${alvo.tabela}" t SET embedding = v.e::vector FROM unnest($1::int[], $2::text[]) AS v(id, e) WHERE t.id = v.id`,
      ids,
      literais
    );

    feitos += linhas.length;
    const seg = (Date.now() - inicio) / 1000;
    process.stdout.write(`\r    ${feitos}/${total} (${(feitos / seg).toFixed(1)} reg/s)`);
  }
  process.stdout.write('\n');
  return feitos;
}

async function main() {
  const inicio = Date.now();
  console.log(`Gerando embeddings localmente com ${MODELO} (384 dimensões)...`);
  let total = 0;
  for (const alvo of ALVOS) total += await processarAlvo(alvo);
  await prisma.$executeRawUnsafe('ANALYZE "produto", "chamado_suporte", "artigo_base"');
  console.log(`Concluído: ${total} embeddings gerados em ${((Date.now() - inicio) / 1000).toFixed(1)}s.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
