-- Trilha C (RAG / pgvector): habilita a extensão e adiciona colunas de embedding.
-- Migration escrita manualmente (o Prisma não modela o tipo `vector`).
-- Modelo de embeddings: Xenova/all-MiniLM-L6-v2 -> 384 dimensões.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "produto"         ADD COLUMN "embedding" vector(384);
ALTER TABLE "chamado_suporte" ADD COLUMN "embedding" vector(384);
ALTER TABLE "artigo_base"     ADD COLUMN "embedding" vector(384);

-- Índices HNSW para busca aproximada por similaridade de cosseno (operador <=>).
CREATE INDEX "produto_embedding_hnsw_idx"
  ON "produto" USING hnsw ("embedding" vector_cosine_ops);

CREATE INDEX "chamado_suporte_embedding_hnsw_idx"
  ON "chamado_suporte" USING hnsw ("embedding" vector_cosine_ops);

CREATE INDEX "artigo_base_embedding_hnsw_idx"
  ON "artigo_base" USING hnsw ("embedding" vector_cosine_ops);
