// Compara busca por palavra-chave exata (ILIKE) com busca semântica (pgvector),
// medindo o tempo de cada consulta.
// Uso: node src/comparar-buscas.js            (consultas de exemplo)
//      node src/comparar-buscas.js "minha consulta"
const { prisma } = require('./db');
const { gerarEmbedding, paraVetorSql } = require('./embeddings');
const { buscarPorVetor, buscarPalavraChave } = require('./busca');

const CONSULTAS_PADRAO = [
  'senha esquecida', // esperado: artigos/chamados sobre "recuperar acesso"
  'carregador não funciona', // esperado: "não carrega a bateria"
  'minha tela não liga',
];

const ms = (t0) => (Number(process.hrtime.bigint() - t0) / 1e6).toFixed(1);
const resumo = (s) => String(s).replace(/\s+/g, ' ').slice(0, 90);

async function comparar(consulta) {
  console.log('\n' + '='.repeat(100));
  console.log(`CONSULTA: "${consulta}"`);
  console.log('='.repeat(100));

  // 1) Palavra-chave exata
  let t = process.hrtime.bigint();
  const chave = await buscarPalavraChave(consulta, 5);
  const tChave = ms(t);
  console.log(`\n[ILIKE '%${consulta}%'] ${chave.length} resultado(s) em ${tChave} ms`);
  chave.forEach((r, i) => console.log(`  ${i + 1}. [${r.tipo} #${r.id}] ${resumo(r.titulo)}`));
  if (chave.length === 0) console.log('  (nenhum resultado: a frase exata não aparece em nenhum registro)');

  // 2) Semântica (tempo do embedding separado do tempo da consulta SQL)
  t = process.hrtime.bigint();
  const vetor = paraVetorSql(await gerarEmbedding(consulta));
  const tEmb = ms(t);
  t = process.hrtime.bigint();
  const sem = await buscarPorVetor(vetor, 5);
  const tSql = ms(t);
  console.log(`\n[SEMÂNTICA <=>] ${sem.length} resultado(s): embedding ${tEmb} ms + consulta SQL (HNSW) ${tSql} ms`);
  sem.forEach((r, i) => console.log(`  ${i + 1}. [${r.tipo} #${r.id}] sim=${Number(r.similaridade).toFixed(4)}  ${resumo(r.titulo)}`));

  return { consulta, ilikeResultados: chave.length, ilikeMs: tChave, semResultados: sem.length, embMs: tEmb, sqlMs: tSql };
}

async function main() {
  const argumento = process.argv.slice(2).join(' ').trim();
  const consultas = argumento ? [argumento] : CONSULTAS_PADRAO;

  console.log('Aquecendo o modelo de embeddings (carregamento único)...');
  await gerarEmbedding('aquecimento');

  const tabela = [];
  for (const c of consultas) tabela.push(await comparar(c));

  console.log('\nRESUMO');
  console.table(tabela.map((r) => ({
    consulta: r.consulta,
    'ILIKE (resultados)': r.ilikeResultados,
    'ILIKE (ms)': r.ilikeMs,
    'Semântica (resultados)': r.semResultados,
    'Embedding (ms)': r.embMs,
    'SQL vetor (ms)': r.sqlMs,
  })));
  console.log('Conclusão: o ILIKE só acha textos que contenham a frase exata; a busca semântica encontra');
  console.log('conteúdo relevante pelo significado, mesmo sem a palavra (ex.: "senha esquecida" -> "recuperar acesso").');
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
