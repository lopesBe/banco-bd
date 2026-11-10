// Migra os dados da loja legada (MySQL, banco `exercicio_sql`) para o novo schema PostgreSQL.
//
// Como exportar o legado (no MySQL) para CSV com cabeçalho — exemplo para a tabela cliente:
//   mysql -u root -p exercicio_sql --batch -e "SELECT * FROM cliente" | sed 's/\t/,/g' > legado/cliente.csv
// ou use o MySQL Workbench / DBeaver: "Exportar resultado -> CSV (com cabeçalho)".
//
// Arquivos esperados na pasta (padrão: ./legado): cliente.csv, fornecedor.csv, produto.csv,
// custo_produto.csv, pedido.csv, item_pedido.csv — com as colunas ORIGINAIS do legado.
// Uso: node src/migrar-legado.js [pasta]      (exemplo pronto: node src/migrar-legado.js legado-exemplo)
//
// Os IDs originais são preservados (a API/telas Java continuam referenciando os mesmos ids)
// e as sequences do PostgreSQL são reajustadas ao final. Rode em um banco recém-migrado
// (antes do seed) ou use skipDuplicates (já ativo) para reexecutar com segurança.
const fs = require('fs');
const path = require('path');
const { prisma } = require('./db');

function lerCsv(arquivo) {
  if (!fs.existsSync(arquivo)) return null;
  const texto = fs.readFileSync(arquivo, 'utf8').replace(/^\uFEFF/, '');
  const linhas = [];
  let campo = '', linha = [], aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      linha.push(campo); campo = '';
      if (linha.some((x) => x !== '')) linhas.push(linha);
      linha = [];
    } else campo += c;
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha); }
  const [cab, ...resto] = linhas;
  return resto.map((l) => Object.fromEntries(cab.map((h, i) => [h.trim(), (l[i] ?? '').trim()])));
}

const nulo = (v) => (v === '' || v === 'NULL' || v === '\\N' ? null : v);
const inteiro = (v) => (nulo(v) === null ? null : parseInt(v, 10));
const data = (v) => (nulo(v) === null ? undefined : new Date(`${v.slice(0, 10)}T12:00:00Z`));

async function migrar(modelo, rotulo, linhas, mapear) {
  if (!linhas) { console.log(`- ${rotulo}: arquivo não encontrado, ignorado.`); return; }
  const dados = linhas.map(mapear);
  const r = await prisma[modelo].createMany({ data: dados, skipDuplicates: true });
  console.log(`- ${rotulo}: ${linhas.length} linhas lidas, ${r.count} inseridas.`);
}

async function main() {
  const pasta = path.resolve(process.argv[2] || 'legado');
  console.log(`Migrando dados legados de ${pasta}`);
  const csv = (nome) => lerCsv(path.join(pasta, `${nome}.csv`));

  const fornecedores = csv('fornecedor');
  const idsFornecedor = new Set((fornecedores || []).map((f) => inteiro(f.id)));

  await migrar('usuario', 'cliente -> usuario (papel CLIENTE)', csv('cliente'), (c) => ({
    id: inteiro(c.id), nome: c.nome, email: c.email, cidade: nulo(c.cidade), papel: 'CLIENTE', createdAt: data(c.data_cadastro),
  }));
  await migrar('fornecedor', 'fornecedor', fornecedores, (f) => ({ id: inteiro(f.id), nome: f.nome, cnpj: f.cnpj, cidade: nulo(f.cidade) }));
  await migrar('produto', 'produto', csv('produto'), (p) => ({
    id: inteiro(p.id), nome: p.nome, preco: p.preco, sku: `LEGADO-${p.id}`, estoque: 0,
    fornecedorId: idsFornecedor.has(inteiro(p.id_fornecedor)) ? inteiro(p.id_fornecedor) : null,
  }));
  await migrar('custoProduto', 'custo_produto', csv('custo_produto'), (c) => ({
    id: inteiro(c.id), produtoId: inteiro(c.id_produto), custo: c.custo, dataAtualizacao: data(c.data_atualizacao),
  }));
  await migrar('pedido', 'pedido', csv('pedido'), (p) => ({
    id: inteiro(p.id), usuarioId: inteiro(p.id_cliente), data: data(p.data), total: p.total, status: 'ENTREGUE',
  }));
  await migrar('itemPedido', 'item_pedido', csv('item_pedido'), (i) => ({
    id: inteiro(i.id), pedidoId: inteiro(i.id_pedido), produtoId: inteiro(i.id_produto), quantidade: inteiro(i.quantidade), precoUnitario: i.preco_unitario,
  }));

  // Reajusta as sequences para que novos INSERTs (ex.: Java) não colidam com ids migrados.
  for (const t of ['usuario', 'fornecedor', 'produto', 'custo_produto', 'pedido', 'item_pedido']) {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${t}"', 'id'), COALESCE((SELECT MAX(id) FROM "${t}"), 0) + 1, false)`);
  }
  console.log('Sequences reajustadas. Migração concluída.');
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

