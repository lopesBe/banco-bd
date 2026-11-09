# IA_LOG — Registro de uso de IA

Projeto: **Smart-Base / Loja de Eletrônicos** — Banco de Dados II (UNIFACVEST)
Ferramenta de IA: Antigravity (agente de código, modelos Claude Sonnet / Opus)
Período: 09/11/2026

---

## 1. Prompts utilizados

### Prompt 1 — Pedido principal (texto integral)

> Atue como um Engenheiro de Software Sênior (DevOps + Banco de Dados + IA). Este projeto é uma loja de produtos eletrônicos em Java, com um módulo administrativo para o dono da loja, já conectada a um banco de dados. Preciso adaptar a camada de banco de dados para cumprir as diretrizes de um trabalho acadêmico de Banco de Dados II (UNIFACVEST). NÃO quebre a aplicação Java existente.
>
> **ETAPA 0 – Análise (faça antes de qualquer alteração)**
> 1. Leia a estrutura do projeto e descubra como o Java conecta ao banco hoje (driver, URL, tabelas, entidades, DAOs/repositories).
> 2. Me apresente um resumo curto do que encontrou e do plano de mudanças, e só então prossiga.
>
> **REQUISITOS OBRIGATÓRIOS DO TRABALHO**
>
> **1. Infraestrutura (Docker)** — Crie `docker-compose.yml` na raiz com: PostgreSQL 16 usando a imagem `pgvector/pgvector:pg16` (já inclui a extensão pgvector) e pgAdmin para visualização. Use volume persistente, healthcheck no Postgres e variáveis vindas de `.env`. Crie `.env.example` (versionado) e `.env` (ignorado pelo git). Tudo deve subir sem falhas com `docker-compose up -d`.
>
> **2. Camada Node.js (scripts do banco)** — Crie a pasta `smart-base/` (ou `database/`) com projeto Node.js compatível com versões 22 a 24 (defina `"engines"` no package.json). Rode `npm init -y` e instale: `pg`, `dotenv`, `prisma` (dev), `@prisma/client`. A aplicação Java deve passar a usar ESTE mesmo PostgreSQL via JDBC. Ajuste a configuração de conexão do Java (URL, usuário e senha lidos de variáveis de ambiente) e, se necessário, os nomes de tabelas/colunas nas queries Java, para que loja e painel administrativo continuem funcionando com o novo schema.
>
> **3. Trilha A – Prisma ORM (modelagem avançada)** — Crie `prisma/schema.prisma` normalizado (3FN) com relacionamentos complexos, adaptado à loja de eletrônicos e ao conceito "Smart-Base / Helpdesk": `Usuario` (papel: CLIENTE | ADMIN | ATENDENTE); `Categoria` (com auto-relacionamento para subcategorias); `Produto` (nome, descrição longa, preço, estoque, categoria, SKU único); `Pedido` e `ItemPedido` (N:N entre Pedido e Produto com tabela associativa); `ChamadoSuporte` (título, descrição longa, status, prioridade, solicitante, atendente, produto relacionado opcional, categoria); `ArtigoBase` (artigo de conhecimento/FAQ com texto longo, autor, categoria). Inclua índices adequados, chaves estrangeiras, enums, `createdAt`/`updatedAt` e `onDelete` coerentes. Rode `npx prisma migrate dev --name init` e gere o client. Crie `src/transacao-exemplo.js` demonstrando uma transação com `prisma.$transaction` (criar Pedido + ItemPedido + baixar estoque, com rollback se faltar estoque). Se a loja Java já tinha tabelas com dados, crie um script de migração desses dados para o novo schema (ou documente como recriar).
>
> **4. Trilha C – RAG / pgvector (busca semântica)** — Crie uma migration SQL (via `prisma migrate dev --create-only` + edição manual) que execute `CREATE EXTENSION IF NOT EXISTS vector;` e adicione a coluna `embedding vector(384)` em `Produto`, `ChamadoSuporte` e `ArtigoBase`, com índice HNSW (`vector_cosine_ops`). Gere embeddings LOCALMENTE (sem API paga) com `@xenova/transformers` usando o modelo `Xenova/all-MiniLM-L6-v2` (384 dimensões). Código em `src/embeddings.js`. Crie `src/gerar-embeddings.js` (lote, `$executeRaw`/`$queryRaw`), `src/busca-semantica.js` (CLI, top 5 por similaridade de cosseno `<=>`), `src/rag.js` (fluxo básico de RAG; LLM externo opcional e desativado por padrão) e `src/comparar-buscas.js` (ILIKE vs semântica, com tempos; ex.: "senha esquecida" vs "recuperar acesso", "carregador não funciona" vs "não carrega a bateria").
>
> **5. Seeder** — `src/seed.js` (`@faker-js/faker` pt_BR, `createMany` em lotes): ≥ 50 categorias/subcategorias, 200 usuários, 3.000 produtos com descrições longas, 5.000 chamados com textos longos e variados, 1.000 artigos e 2.000 pedidos com itens. Idempotente, com progresso e tempo total. Scripts no package.json: `seed`, `embeddings`, `busca`, `rag`, `comparar`, `migrate`.
>
> **6. Git e documentação** — `.gitignore` (node_modules, .env, target/, build/, *.class, .idea/, .vscode/, volumes do docker, arquivos do SO); `README.md` com passo a passo testável (pré-requisitos → `cp .env.example .env` → `docker-compose up -d` → `cd smart-base && npm install` → `npx prisma migrate dev` → `node src/seed.js` → `node src/gerar-embeddings.js` → exemplos de busca → rodar a aplicação Java), diagrama ER em Mermaid e solução de problemas; `IA_LOG.md` (prompts, o que a IA gerou e seção "Adaptações manuais da dupla"); commits pequenos em português no padrão Conventional Commits, nunca commitar o `.env`.
>
> **VERIFICAÇÃO FINAL** — Executar do zero (`docker-compose down -v && docker-compose up -d`, migrate, seed, embeddings, busca, comparação); confirmar que a aplicação Java compila, conecta e que loja + painel admin funcionam; entregar relatório com arquivos, comandos e resultados reais, contagem de registros por tabela e pendências.

### Prompt 2 — Respostas às perguntas do agente
- Docker não instalado: *"Pare aqui: vou instalar o Docker primeiro e volto."*
- Estratégia de schema: *"Não, criar tabelas novas (Usuario, Produto...) e reescrever os DAOs Java."*

### Prompt 3 — Retomada
> docker instalado de continuidade

---

## 2. O que a IA gerou

| Área | Arquivos | Resumo |
|---|---|---|
| Análise (Etapa 0) | — | Leitura do projeto: Java 17 + Spark + MySQL (`exercicio_sql`), DAOs JDBC, tabelas `cliente`, `fornecedor`, `produto`, `custo_produto`, `pedido`, `item_pedido`; credenciais fixas no código. |
| Infra | `docker-compose.yml`, `.env.example`, `.gitignore` | Postgres `pgvector/pgvector:pg16` com healthcheck e volume; pgAdmin; variáveis por `.env`. Porta do host 5433 (conflito com Postgres do Windows). |
| Prisma | `smart-base/prisma/schema.prisma`, `prisma.config.js`, migrations `init` e `add_pgvector_embeddings` | 3FN, enums, índices, `onDelete`; colunas `embedding` como `Unsupported("vector(384)")` + índices HNSW na migration manual. |
| Node | `src/db.js`, `seed.js`, `dados-eletronicos.js`, `transacao-exemplo.js`, `migrar-legado.js` | Seeder em lotes (createMany); transação com rollback; migração de legado via CSV. |
| RAG | `src/embeddings.js`, `gerar-embeddings.js`, `busca.js`, `busca-semantica.js`, `rag.js`, `comparar-buscas.js` | Embeddings locais MiniLM (384d), busca por `<=>`, RAG com LLM opcional, comparação ILIKE × semântica com tempos. |
| Java | `ConnectionFactory`, `pom.xml`, `ClienteDAO`, `ProdutoDAO`, `PedidoDAO`, `CheckoutController`, `ApiMain`, `Main` | Driver PostgreSQL; `DB_URL/DB_USER/DB_PASSWORD` via ambiente ou `.env`; `cliente` → `usuario` (papel CLIENTE); `id_cliente` → `id_usuario` em `pedido`; SKU automático; fornecedor opcional. |
| Docs | `README.md`, `IA_LOG.md` | Passo a passo, diagrama ER (Mermaid), troubleshooting. |

### Decisões e problemas encontrados pela IA
1. **Porta 5432 ocupada** por um PostgreSQL nativo do Windows → erro de autenticação enganoso. Solução: expor o container em 5433.
2. **Prisma + pgvector:** sem declarar `embedding` no schema, `migrate dev` tentava remover a coluna (drift). Solução: `Unsupported("vector(384)")?` e `@@index([embedding], map: "..._hnsw_idx")` para o Prisma reconhecer os índices pelo nome.
3. **`.env` na raiz** é compartilhado por Docker, Node e Java; o Prisma CLI o encontra via `prisma.config.js`.
4. **Estoque no Java:** o checkout Java não baixa estoque (comportamento original preservado); a baixa transacional está demonstrada em `transacao-exemplo.js`.

---

## 3. Adaptações manuais da dupla

> Preencham esta seção com o que vocês alteraram, validaram ou decidiram sem a IA.

| # | Arquivo / área | O que foi alterado manualmente | Motivo | Quem |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

**Revisões e testes feitos pela dupla**
- [ ] Revisamos o `schema.prisma` e entendemos cada relacionamento e `onDelete`.
- [ ] Rodamos o passo a passo do README em outra máquina: ______________________
- [ ] Conferimos as buscas semânticas com nossas próprias frases: ______________________
- [ ] Testamos loja e painel admin no navegador: ______________________

**Dificuldades encontradas / o que aprendemos**

- ______________________________________________________________
- ______________________________________________________________

**Prompts adicionais que a dupla usou (copiar e colar)**

1. ______________________________________________________________
2. ______________________________________________________________
