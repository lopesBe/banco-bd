// Funções de busca (semântica e por palavra-chave) reutilizadas pelos scripts da CLI.
const { prisma } = require('./db');
const { gerarEmbedding, paraVetorSql } = require('./embeddings');

// Busca semântica por similaridade de cosseno (operador <=> do pgvector).
// similaridade = 1 - distância_cosseno. Retorna os `limite` melhores entre
// chamados, artigos e produtos.
async function buscarSemantica(consulta, limite = 5) {
  const vetor = paraVetorSql(await gerarEmbedding(consulta));
  return buscarPorVetor(vetor, limite);
}

async function buscarPorVetor(vetorSql, limite = 5) {
  return prisma.$queryRawUnsafe(
    `
    SELECT * FROM (
      (SELECT 'chamado' AS tipo, id, titulo, descricao AS texto, 1 - (embedding <=> $1::vector) AS similaridade
         FROM chamado_suporte WHERE embedding IS NOT NULL ORDER BY embedding <=> $1::vector LIMIT ${limite})
      UNION ALL
      (SELECT 'artigo' AS tipo, id, titulo, conteudo AS texto, 1 - (embedding <=> $1::vector) AS similaridade
         FROM artigo_base WHERE embedding IS NOT NULL ORDER BY embedding <=> $1::vector LIMIT ${limite})
      UNION ALL
      (SELECT 'produto' AS tipo, id, nome AS titulo, descricao AS texto, 1 - (embedding <=> $1::vector) AS similaridade
         FROM produto WHERE embedding IS NOT NULL ORDER BY embedding <=> $1::vector LIMIT ${limite})
    ) r
    ORDER BY similaridade DESC
    LIMIT ${limite}
    `,
    vetorSql
  );
}

// Busca por palavra-chave exata (ILIKE) nas mesmas tabelas/colunas.
async function buscarPalavraChave(consulta, limite = 5) {
  const padrao = `%${consulta}%`;
  return prisma.$queryRawUnsafe(
    `
    SELECT * FROM (
      (SELECT 'chamado' AS tipo, id, titulo, descricao AS texto FROM chamado_suporte
         WHERE titulo ILIKE $1 OR descricao ILIKE $1 LIMIT ${limite})
      UNION ALL
      (SELECT 'artigo' AS tipo, id, titulo, conteudo AS texto FROM artigo_base
         WHERE titulo ILIKE $1 OR conteudo ILIKE $1 LIMIT ${limite})
      UNION ALL
      (SELECT 'produto' AS tipo, id, nome AS titulo, descricao AS texto FROM produto
         WHERE nome ILIKE $1 OR descricao ILIKE $1 LIMIT ${limite})
    ) r
    LIMIT ${limite}
    `,
    padrao
  );
}

module.exports = { buscarSemantica, buscarPorVetor, buscarPalavraChave };
