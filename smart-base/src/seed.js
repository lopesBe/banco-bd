// Seeder: popula o banco com massa de dados realista (idempotente).
// Uso: node src/seed.js
//
// Volumes: 50 categorias, 200 usuários, 3.000 produtos, 5.000 chamados,
// 1.000 artigos e 2.000 pedidos (com itens). Usa createMany em lotes.
const { fakerPT_BR: faker } = require('@faker-js/faker');
const { prisma } = require('./db');
const D = require('./dados-eletronicos');

const TAMANHO_LOTE = 500;
const QTD = { usuarios: 200, fornecedores: 30, produtos: 3000, chamados: 5000, pedidos: 2000 };

faker.seed(2026); // resultados reproduzíveis

const pick = (lista) => faker.helpers.arrayElement(lista);
const preencher = (texto, valores) => texto.replace(/\{(\w+)\}/g, (_, k) => valores[k] ?? `{${k}}`);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function log(msg) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

async function inserirEmLotes(nome, modelo, registros) {
  let feitos = 0;
  for (let i = 0; i < registros.length; i += TAMANHO_LOTE) {
    const lote = registros.slice(i, i + TAMANHO_LOTE);
    await prisma[modelo].createMany({ data: lote });
    feitos += lote.length;
    process.stdout.write(`\r    ${nome}: ${feitos}/${registros.length}`);
  }
  process.stdout.write('\n');
}

async function limpar() {
  log('Limpando tabelas (TRUNCATE ... RESTART IDENTITY CASCADE)...');
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "item_pedido", "pedido", "custo_produto", "chamado_suporte", "artigo_base", "produto", "fornecedor", "categoria", "usuario" RESTART IDENTITY CASCADE'
  );
}

async function seedCategorias() {
  log('Criando categorias e subcategorias...');
  const raizes = D.CATALOGO.map((c) => ({ nome: c.nome, slug: slugify(c.nome) }));
  await prisma.categoria.createMany({ data: raizes });
  const raizesDb = await prisma.categoria.findMany({ select: { id: true, slug: true } });
  const idRaiz = Object.fromEntries(raizesDb.map((r) => [r.slug, r.id]));

  const subs = [];
  for (const raiz of D.CATALOGO) {
    for (const sub of raiz.subs) {
      subs.push({ nome: sub.nome, slug: slugify(`${raiz.nome}-${sub.nome}`), paiId: idRaiz[slugify(raiz.nome)] });
    }
  }
  await prisma.categoria.createMany({ data: subs });

  const todas = await prisma.categoria.findMany({ select: { id: true, nome: true, slug: true, paiId: true } });
  log(`    ${todas.length} categorias (${raizes.length} raízes + ${subs.length} subcategorias)`);
  return todas;
}

async function seedUsuarios() {
  log(`Criando ${QTD.usuarios} usuários...`);
  const usuarios = [
    { nome: 'Administrador da Loja', email: 'admin@smartbase.com.br', cidade: 'Lages', papel: 'ADMIN' },
  ];
  for (let i = 0; i < 8; i++) {
    usuarios.push({ nome: faker.person.fullName(), email: `atendente${i + 1}@smartbase.com.br`, cidade: 'Lages', papel: 'ATENDENTE' });
  }
  while (usuarios.length < QTD.usuarios) {
    const nome = faker.person.fullName();
    usuarios.push({
      nome,
      email: `${slugify(nome).replace(/-/g, '.')}.${usuarios.length}@${pick(['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com.br'])}`,
      cidade: faker.location.city(),
      papel: 'CLIENTE',
      createdAt: faker.date.past({ years: 3 }),
    });
  }
  await inserirEmLotes('usuarios', 'usuario', usuarios);
  return prisma.usuario.findMany({ select: { id: true, papel: true } });
}

async function seedFornecedores() {
  log(`Criando ${QTD.fornecedores} fornecedores...`);
  const fornecedores = [];
  for (let i = 0; i < QTD.fornecedores; i++) {
    const n = faker.string.numeric(8) + '0001' + faker.string.numeric(2);
    fornecedores.push({
      nome: `${faker.company.name()} Eletrônicos`,
      cnpj: `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12, 14)}`,
      cidade: faker.location.city(),
    });
  }
  await inserirEmLotes('fornecedores', 'fornecedor', fornecedores);
  return prisma.fornecedor.findMany({ select: { id: true } });
}

function descricaoProduto(nome, sub) {
  const atributos = Object.entries(sub.atributos).map(([k, v]) => ({ k, v: pick(v) }));
  const valores = { nome, uso: sub.uso, tipo: sub.tipo };
  const specs = atributos.map((a) => `${a.k}: ${a.v}`).join('; ');
  return {
    atributos,
    texto: [
      preencher(pick(D.PRODUTO_ABERTURAS), valores),
      `Especificações principais — ${specs}.`,
      preencher(pick(D.PRODUTO_USO), valores),
      pick(D.PRODUTO_QUALIDADE),
      pick(D.PRODUTO_INCLUSOS),
      pick(D.PRODUTO_GARANTIA),
    ].join('\n\n'),
  };
}

const FAIXA_PRECO = {
  Smartphones: [599, 8999], 'Notebooks e Computadores': [1299, 14999], 'TVs e Monitores': [499, 9999], Áudio: [49, 3499],
  Games: [89, 4999], Acessórios: [19, 899], 'Câmeras e Drones': [199, 12999], 'Casa Inteligente': [39, 1999],
  'Redes e Conectividade': [59, 1799], Wearables: [99, 3999],
};

async function seedProdutos(categorias, fornecedores) {
  log(`Criando ${QTD.produtos} produtos...`);
  const porNome = Object.fromEntries(categorias.map((c) => [c.nome, c]));
  const subs = [];
  for (const raiz of D.CATALOGO) for (const sub of raiz.subs) subs.push({ raiz, sub, cat: porNome[sub.nome] });

  const produtos = [];
  for (let i = 0; i < QTD.produtos; i++) {
    const { raiz, sub, cat } = subs[i % subs.length];
    const marca = pick(sub.marcas);
    const serie = `${faker.string.alpha({ length: 1, casing: 'upper' })}${faker.number.int({ min: 10, max: 99 })}${pick(['', 'e', ' Pro', ' Plus', ' Lite', ' Max'])}`;
    const { atributos, texto } = descricaoProduto('{nome}', sub);
    const nome = `${cap(sub.tipo)} ${marca} ${serie} ${atributos[0].v}`.slice(0, 200);
    const [min, max] = FAIXA_PRECO[raiz.nome];
    produtos.push({
      nome,
      descricao: texto.replace('{nome}', nome).replace(/\{nome\}/g, nome),
      preco: faker.number.float({ min, max, fractionDigits: 2 }),
      estoque: faker.number.int({ min: 0, max: 250 }),
      sku: `SKU-${String(i + 1).padStart(5, '0')}`,
      categoriaId: cat.id,
      fornecedorId: pick(fornecedores).id,
      createdAt: faker.date.past({ years: 2 }),
    });
  }
  await inserirEmLotes('produtos', 'produto', produtos);
  return prisma.produto.findMany({ select: { id: true, nome: true, preco: true, categoriaId: true } });
}

function textoChamado(problema, produtoNome) {
  const valores = { produto: produtoNome ?? 'aparelho', meses: faker.number.int({ min: 1, max: 18 }) };
  const titulo = preencher(pick(problema.titulos), valores).slice(0, 250);
  const partes = [
    pick(D.CHAMADO_ABERTURAS),
    produtoNome ? preencher(pick(D.CHAMADO_CONTEXTO), valores) : null,
    preencher(pick(problema.sintomas), valores),
    faker.helpers.maybe(() => pick(D.CHAMADO_TENTATIVAS), { probability: 0.85 }),
    faker.helpers.maybe(() => pick(D.CHAMADO_TENTATIVAS), { probability: 0.4 }),
    pick(D.CHAMADO_FECHOS),
  ].filter(Boolean);
  if (produtoNome) partes.splice(2, 0, `Produto envolvido: ${produtoNome}.`);
  return { titulo, descricao: partes.join('\n\n') };
}

async function seedChamados(usuarios, produtos, categorias) {
  log(`Criando ${QTD.chamados} chamados de suporte...`);
  const clientes = usuarios.filter((u) => u.papel === 'CLIENTE');
  const atendentes = usuarios.filter((u) => u.papel === 'ATENDENTE' || u.papel === 'ADMIN');
  const raizes = categorias.filter((c) => c.paiId === null);
  const semProduto = new Set(['conta', 'entrega']);

  const chamados = [];
  for (let i = 0; i < QTD.chamados; i++) {
    const problema = pick(D.PROBLEMAS);
    const usaProduto = !semProduto.has(problema.chave) || faker.datatype.boolean(0.3);
    const produto = usaProduto ? pick(produtos) : null;
    const { titulo, descricao } = textoChamado(problema, produto?.nome);
    const status = faker.helpers.weightedArrayElement([
      { value: 'ABERTO', weight: 25 }, { value: 'EM_ANDAMENTO', weight: 25 }, { value: 'AGUARDANDO_CLIENTE', weight: 10 },
      { value: 'RESOLVIDO', weight: 25 }, { value: 'FECHADO', weight: 15 },
    ]);
    const criado = faker.date.past({ years: 1 });
    chamados.push({
      titulo,
      descricao,
      status,
      prioridade: faker.helpers.weightedArrayElement([
        { value: 'BAIXA', weight: 20 }, { value: 'MEDIA', weight: 45 }, { value: 'ALTA', weight: 25 }, { value: 'URGENTE', weight: 10 },
      ]),
      solicitanteId: pick(clientes).id,
      atendenteId: status === 'ABERTO' ? null : pick(atendentes).id,
      produtoId: produto?.id ?? null,
      categoriaId: produto?.categoriaId ?? pick(raizes).id,
      createdAt: criado,
      updatedAt: criado,
    });
  }
  await inserirEmLotes('chamados', 'chamadoSuporte', chamados);
}

async function seedArtigos(usuarios, categorias) {
  log('Criando artigos da base de conhecimento...');
  const autores = usuarios.filter((u) => u.papel !== 'CLIENTE');
  const artigos = [];
  for (const cat of categorias) {
    const ehRaiz = cat.paiId === null;
    let tipo = D.CATALOGO.flatMap((r) => r.subs).find((s) => s.nome === cat.nome)?.tipo;
    if (!tipo) tipo = `equipamento de ${cat.nome.toLowerCase()}`;
    for (const topico of D.TOPICOS_ARTIGO) {
      const criado = faker.date.past({ years: 2 });
      artigos.push({
        titulo: preencher(topico.titulo, { tipo }).slice(0, 250),
        conteudo: topico.paragrafos.map((p) => preencher(p, { tipo })).join('\n\n'),
        autorId: pick(autores).id,
        categoriaId: cat.id,
        publicado: ehRaiz ? true : faker.datatype.boolean(0.97),
        createdAt: criado,
        updatedAt: criado,
      });
    }
  }
  await inserirEmLotes('artigos', 'artigoBase', artigos);
}

async function seedPedidos(usuarios, produtos) {
  log(`Criando ${QTD.pedidos} pedidos com itens...`);
  const clientes = usuarios.filter((u) => u.papel === 'CLIENTE');
  const pedidos = [];
  const itensPorIndice = [];
  for (let i = 0; i < QTD.pedidos; i++) {
    const itens = faker.helpers.arrayElements(produtos, faker.number.int({ min: 1, max: 5 })).map((p) => ({
      produtoId: p.id,
      quantidade: faker.number.int({ min: 1, max: 3 }),
      precoUnitario: Number(p.preco),
    }));
    const total = itens.reduce((s, it) => s + it.precoUnitario * it.quantidade, 0);
    const data = faker.date.past({ years: 1 });
    pedidos.push({
      usuarioId: pick(clientes).id,
      data,
      total: Math.round(total * 100) / 100,
      status: faker.helpers.weightedArrayElement([
        { value: 'PENDENTE', weight: 10 }, { value: 'PAGO', weight: 20 }, { value: 'ENVIADO', weight: 20 },
        { value: 'ENTREGUE', weight: 45 }, { value: 'CANCELADO', weight: 5 },
      ]),
      createdAt: data,
      updatedAt: data,
    });
    itensPorIndice.push(itens);
  }
  await inserirEmLotes('pedidos', 'pedido', pedidos);

  const idsPedidos = await prisma.pedido.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  const itens = [];
  idsPedidos.forEach((p, idx) => itensPorIndice[idx].forEach((it) => itens.push({ pedidoId: p.id, ...it })));
  await inserirEmLotes('itens de pedido', 'itemPedido', itens);
}

async function seedCustos(produtos) {
  log('Criando histórico de custos de produtos...');
  const custos = produtos.slice(0, 1000).map((p) => ({
    produtoId: p.id,
    custo: Math.round(Number(p.preco) * faker.number.float({ min: 0.55, max: 0.8 }) * 100) / 100,
    dataAtualizacao: faker.date.past({ years: 1 }),
  }));
  await inserirEmLotes('custos', 'custoProduto', custos);
}

async function main() {
  const inicio = Date.now();
  await limpar();
  const categorias = await seedCategorias();
  const usuarios = await seedUsuarios();
  const fornecedores = await seedFornecedores();
  const produtos = await seedProdutos(categorias, fornecedores);
  await seedCustos(produtos);
  await seedChamados(usuarios, produtos, categorias);
  await seedArtigos(usuarios, categorias);
  await seedPedidos(usuarios, produtos);

  const contagens = {
    categoria: await prisma.categoria.count(), usuario: await prisma.usuario.count(), fornecedor: await prisma.fornecedor.count(),
    produto: await prisma.produto.count(), custo_produto: await prisma.custoProduto.count(), chamado_suporte: await prisma.chamadoSuporte.count(),
    artigo_base: await prisma.artigoBase.count(), pedido: await prisma.pedido.count(), item_pedido: await prisma.itemPedido.count(),
  };
  console.table(contagens);
  log(`Seed concluído em ${((Date.now() - inicio) / 1000).toFixed(1)}s`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
