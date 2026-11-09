-- CreateEnum
CREATE TYPE "papel_usuario" AS ENUM ('CLIENTE', 'ADMIN', 'ATENDENTE');

-- CreateEnum
CREATE TYPE "status_pedido" AS ENUM ('PENDENTE', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "status_chamado" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'AGUARDANDO_CLIENTE', 'RESOLVIDO', 'FECHADO');

-- CreateEnum
CREATE TYPE "prioridade_chamado" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "cidade" VARCHAR(100),
    "papel" "papel_usuario" NOT NULL DEFAULT 'CLIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "id_pai" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornecedor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cnpj" VARCHAR(20) NOT NULL,
    "cidade" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "sku" VARCHAR(60) NOT NULL,
    "id_categoria" INTEGER,
    "id_fornecedor" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custo_produto" (
    "id" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "custo" DECIMAL(10,2) NOT NULL,
    "data_atualizacao" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custo_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(12,2) NOT NULL,
    "status" "status_pedido" NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pedido" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "item_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamado_suporte" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(250) NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "status_chamado" NOT NULL DEFAULT 'ABERTO',
    "prioridade" "prioridade_chamado" NOT NULL DEFAULT 'MEDIA',
    "id_solicitante" INTEGER NOT NULL,
    "id_atendente" INTEGER,
    "id_produto" INTEGER,
    "id_categoria" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chamado_suporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artigo_base" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(250) NOT NULL,
    "conteudo" TEXT NOT NULL,
    "id_autor" INTEGER,
    "id_categoria" INTEGER,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artigo_base_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "usuario_papel_idx" ON "usuario"("papel");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_slug_key" ON "categoria"("slug");

-- CreateIndex
CREATE INDEX "categoria_id_pai_idx" ON "categoria"("id_pai");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedor_cnpj_key" ON "fornecedor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "produto_sku_key" ON "produto"("sku");

-- CreateIndex
CREATE INDEX "produto_id_categoria_idx" ON "produto"("id_categoria");

-- CreateIndex
CREATE INDEX "produto_id_fornecedor_idx" ON "produto"("id_fornecedor");

-- CreateIndex
CREATE INDEX "produto_nome_idx" ON "produto"("nome");

-- CreateIndex
CREATE INDEX "custo_produto_id_produto_idx" ON "custo_produto"("id_produto");

-- CreateIndex
CREATE INDEX "pedido_id_usuario_idx" ON "pedido"("id_usuario");

-- CreateIndex
CREATE INDEX "pedido_data_idx" ON "pedido"("data");

-- CreateIndex
CREATE INDEX "item_pedido_id_pedido_idx" ON "item_pedido"("id_pedido");

-- CreateIndex
CREATE INDEX "item_pedido_id_produto_idx" ON "item_pedido"("id_produto");

-- CreateIndex
CREATE INDEX "chamado_suporte_status_prioridade_idx" ON "chamado_suporte"("status", "prioridade");

-- CreateIndex
CREATE INDEX "chamado_suporte_id_solicitante_idx" ON "chamado_suporte"("id_solicitante");

-- CreateIndex
CREATE INDEX "chamado_suporte_id_atendente_idx" ON "chamado_suporte"("id_atendente");

-- CreateIndex
CREATE INDEX "chamado_suporte_id_produto_idx" ON "chamado_suporte"("id_produto");

-- CreateIndex
CREATE INDEX "chamado_suporte_id_categoria_idx" ON "chamado_suporte"("id_categoria");

-- CreateIndex
CREATE INDEX "artigo_base_id_autor_idx" ON "artigo_base"("id_autor");

-- CreateIndex
CREATE INDEX "artigo_base_id_categoria_idx" ON "artigo_base"("id_categoria");

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_id_pai_fkey" FOREIGN KEY ("id_pai") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custo_produto" ADD CONSTRAINT "custo_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamado_suporte" ADD CONSTRAINT "chamado_suporte_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamado_suporte" ADD CONSTRAINT "chamado_suporte_id_atendente_fkey" FOREIGN KEY ("id_atendente") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamado_suporte" ADD CONSTRAINT "chamado_suporte_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamado_suporte" ADD CONSTRAINT "chamado_suporte_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigo_base" ADD CONSTRAINT "artigo_base_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artigo_base" ADD CONSTRAINT "artigo_base_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
