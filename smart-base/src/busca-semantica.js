// CLI de busca semântica.
// Uso: node src/busca-semantica.js "minha tela não liga"
const { prisma } = require('./db');
const { buscarSemantica } = require('./busca');

async function main() {
  const consulta = process.argv.slice(2).join(' ').trim();
  if (!consulta) {
    console.error('Uso: node src/busca-semantica.js "sua pergunta"');
    process.exitCode = 1;
    return;
  }

  const inicio = process.hrtime.bigint();
  const resultados = await buscarSemantica(consulta, 5);
  const ms = Number(process.hrtime.bigint() - inicio) / 1e6;

  console.log(`\nBusca semântica: "${consulta}"  (${ms.toFixed(0)} ms, inclui o embedding da consulta)\n`);
  if (resultados.length === 0) {
    console.log('Nenhum resultado. Rode "node src/gerar-embeddings.js" primeiro.');
    return;
  }
  resultados.forEach((r, i) => {
    const trecho = String(r.texto).replace(/\s+/g, ' ').slice(0, 140);
    console.log(`${i + 1}. [${r.tipo.toUpperCase()} #${r.id}] similaridade ${Number(r.similaridade).toFixed(4)}`);
    console.log(`   ${r.titulo}`);
    console.log(`   ${trecho}...\n`);
  });
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
