// Geração de embeddings LOCAL (sem API paga) com @xenova/transformers.
// Modelo: Xenova/all-MiniLM-L6-v2 -> vetores de 384 dimensões.
// O modelo (~25 MB) é baixado na primeira execução e fica em cache local.
const path = require('path');

const MODELO = 'Xenova/all-MiniLM-L6-v2';
const DIMENSOES = 384;

let extratorPromise = null;

async function carregarExtrator() {
  if (!extratorPromise) {
    extratorPromise = (async () => {
      const { pipeline, env } = await import('@xenova/transformers');
      env.cacheDir = path.join(__dirname, '..', '.cache');
      return pipeline('feature-extraction', MODELO);
    })();
  }
  return extratorPromise;
}

// Gera embeddings normalizados (norma 1) para uma lista de textos.
// Retorna um array de arrays de 384 números.
async function gerarEmbeddings(textos, tamanhoLote = 32) {
  const extrator = await carregarExtrator();
  const resultado = [];
  for (let i = 0; i < textos.length; i += tamanhoLote) {
    const lote = textos.slice(i, i + tamanhoLote);
    const saida = await extrator(lote, { pooling: 'mean', normalize: true });
    const lista = saida.tolist();
    for (const vetor of lista) resultado.push(vetor);
  }
  return resultado;
}

async function gerarEmbedding(texto) {
  const [vetor] = await gerarEmbeddings([texto]);
  return vetor;
}

// Formata para o literal do pgvector: '[0.1,0.2,...]'
function paraVetorSql(vetor) {
  return '[' + vetor.map((n) => Number(n.toFixed(6))).join(',') + ']';
}

module.exports = { MODELO, DIMENSOES, gerarEmbedding, gerarEmbeddings, paraVetorSql };

