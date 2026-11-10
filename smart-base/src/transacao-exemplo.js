// Demonstra prisma.$transaction: cria Pedido + ItemPedido e baixa o estoque.
// Se algum produto não tiver estoque suficiente, TUDO é revertido (rollback).
// Uso: node src/transacao-exemplo.js
const { prisma } = require('./db');

class EstoqueInsuficienteError extends Error {}

async function criarPedido(usuarioId, itensSolicitados) {
  return prisma.$transaction(async (tx) => {
    let total = 0;
    const itens = [];

    for (const { produtoId, quantidade } of itensSolicitados) {
      const produto = await tx.produto.findUnique({ where: { id: produtoId } });
      if (!produto) throw new Error(`Produto ${produtoId} não encontrado`);

      // Baixa condicional e atômica: só atualiza se ainda houver estoque suficiente.
      const baixa = await tx.produto.updateMany({
        where: { id: produtoId, estoque: { gte: quantidade } },
        data: { estoque: { decrement: quantidade } },
      });
      if (baixa.count === 0) {
        throw new EstoqueInsuficienteError(
          `Estoque insuficiente para "${produto.nome}" (disponível: ${produto.estoque}, solicitado: ${quantidade})`
        );
      }

      const preco = Number(produto.preco);
      total += preco * quantidade;
      itens.push({ produtoId, quantidade, precoUnitario: preco });
    }

    return tx.pedido.create({
      data: {
        usuarioId,
        total: Math.round(total * 100) / 100,
        status: 'PENDENTE',
        itens: { create: itens },
      },
      include: { itens: true },
    });
  });
}

async function main() {
  const cliente = await prisma.usuario.findFirst({ where: { papel: 'CLIENTE' } });
  const [a, b] = await prisma.produto.findMany({ where: { estoque: { gte: 5 } }, take: 2, orderBy: { id: 'asc' } });
  if (!cliente || !a || !b) throw new Error('Rode "node src/seed.js" antes deste exemplo.');

  const estoque = async (id) => (await prisma.produto.findUnique({ where: { id } })).estoque;
  const pedidosAntes = await prisma.pedido.count();

  console.log('--- Cenário 1: pedido válido (commit) ---');
  console.log(`Estoque antes: produto ${a.id}=${await estoque(a.id)}, produto ${b.id}=${await estoque(b.id)}`);
  const pedido = await criarPedido(cliente.id, [
    { produtoId: a.id, quantidade: 2 },
    { produtoId: b.id, quantidade: 1 },
  ]);
  console.log(`Pedido #${pedido.id} criado com ${pedido.itens.length} itens, total R$ ${pedido.total}`);
  console.log(`Estoque depois: produto ${a.id}=${await estoque(a.id)}, produto ${b.id}=${await estoque(b.id)}`);

  console.log('\n--- Cenário 2: segundo item sem estoque (rollback) ---');
  const estoqueAntesA = await estoque(a.id);
  const pedidosAntesFalha = await prisma.pedido.count();
  try {
    await criarPedido(cliente.id, [
      { produtoId: a.id, quantidade: 1 }, // este item seria baixado...
      { produtoId: b.id, quantidade: 999999 }, // ...mas este falha e desfaz tudo
    ]);
  } catch (e) {
    if (!(e instanceof EstoqueInsuficienteError)) throw e;
    console.log(`Erro esperado: ${e.message}`);
  }
  console.log(`Estoque do produto ${a.id}: antes=${estoqueAntesA}, depois=${await estoque(a.id)} (inalterado => rollback OK)`);
  console.log(`Pedidos: antes=${pedidosAntesFalha}, depois=${await prisma.pedido.count()} (inalterado => rollback OK)`);
  console.log(`\nTotal de pedidos: ${pedidosAntes} -> ${await prisma.pedido.count()} (somente o pedido válido foi gravado)`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

