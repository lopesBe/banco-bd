const API_BASE = 'http://localhost:7000/api';

const tabelas = {
    cliente: {
        titulo: 'Cliente',
        rota: 'cliente',
        icone: 'fa-user',
        busca: ['nome', 'email', 'cidade'],
        campos: [
            { nome: 'id', rotulo: 'ID', readonly: true },
            { nome: 'nome', rotulo: 'Nome' },
            { nome: 'email', rotulo: 'Email' },
            { nome: 'cidade', rotulo: 'Cidade' },
            { nome: 'dataCadastro', rotulo: 'Data Cadastro (yyyy-MM-dd)' },
        ],
    },
    produto: {
        titulo: 'Produto',
        rota: 'produto',
        icone: 'fa-box',
        busca: ['nome', 'preco', 'idFornecedor'],
        campos: [
            { nome: 'id', rotulo: 'ID', readonly: true },
            { nome: 'nome', rotulo: 'Nome' },
            { nome: 'preco', rotulo: 'Preco' },
            { nome: 'idFornecedor', rotulo: 'Fornecedor', tipo: 'select', fonte: 'fornecedores' },
        ],
        render: {
            idFornecedor: (registro) => nomePorId(dadosApoio.fornecedores, registro.idFornecedor),
        },
    },
    fornecedor: {
        titulo: 'Fornecedor',
        rota: 'fornecedor',
        icone: 'fa-truck-field',
        busca: ['nome', 'cnpj', 'cidade'],
        campos: [
            { nome: 'id', rotulo: 'ID', readonly: true },
            { nome: 'nome', rotulo: 'Nome' },
            { nome: 'cnpj', rotulo: 'CNPJ' },
            { nome: 'cidade', rotulo: 'Cidade' },
        ],
    },
    custo_produto: {
        titulo: 'Custo Produto',
        rota: 'custo_produto',
        icone: 'fa-coins',
        busca: ['idProduto', 'custo', 'dataAtualizacao'],
        campos: [
            { nome: 'id', rotulo: 'ID', readonly: true },
            { nome: 'idProduto', rotulo: 'Produto', tipo: 'select', fonte: 'produtos' },
            { nome: 'custo', rotulo: 'Custo' },
            { nome: 'dataAtualizacao', rotulo: 'Data Atualizacao (yyyy-MM-dd)' },
        ],
        render: {
            idProduto: (registro) => nomePorId(dadosApoio.produtos, registro.idProduto),
        },
    },
    item_pedido: {
        titulo: 'Item Pedido',
        rota: 'item_pedido',
        icone: 'fa-list-check',
        somenteConsulta: true,
        busca: ['idPedido', 'idProduto', 'quantidade', 'precoUnitario'],
        campos: [
            { nome: 'id', rotulo: 'ID', readonly: true },
            { nome: 'idPedido', rotulo: 'ID Pedido', readonly: true },
            { nome: 'idProduto', rotulo: 'Produto', readonly: true },
            { nome: 'quantidade', rotulo: 'Quantidade', readonly: true },
            { nome: 'precoUnitario', rotulo: 'Preco Unitario', readonly: true },
        ],
        render: {
            idProduto: (registro) => nomePorId(dadosApoio.produtos, registro.idProduto),
        },
    },
    pedido: {
        titulo: 'Pedido',
        rota: 'pedido',
        icone: 'fa-receipt',
        fluxoPedido: true,
        busca: ['idCliente', 'data', 'total'],
        campos: [
            { nome: 'id', rotulo: 'ID', readonly: true },
            { nome: 'idCliente', rotulo: 'Cliente', tipo: 'select', fonte: 'clientes' },
            { nome: 'data', rotulo: 'Data (yyyy-MM-dd)' },
            { nome: 'total', rotulo: 'Total', readonly: true },
        ],
        render: {
            idCliente: (registro) => nomePorId(dadosApoio.clientes, registro.idCliente),
        },
    },
};

let tabelaAtual = 'cliente';
let registrosAtuais = [];
let registrosFiltrados = [];
let itensTemporariosPedido = [];
const buscasPorTabela = {};
const dadosApoio = {
    clientes: [],
    fornecedores: [],
    produtos: [],
    itensPedido: [],
};

let menuTabelas;
let tituloTabela;
let cabecalhoTabela;
let corpoTabela;
let formRegistro;
let mensagem;
let totalRegistros;
let campoBusca;

document.addEventListener('DOMContentLoaded', inicializar);

function inicializar() {
    protegerAdmin();
    menuTabelas = document.getElementById('menu-tabelas');
    tituloTabela = document.getElementById('titulo-tabela');
    cabecalhoTabela = document.getElementById('cabecalho-tabela');
    corpoTabela = document.getElementById('corpo-tabela');
    formRegistro = document.getElementById('form-registro');
    mensagem = document.getElementById('mensagem');
    totalRegistros = document.getElementById('total-registros');
    campoBusca = document.getElementById('campo-busca');

    document.getElementById('btn-atualizar').addEventListener('click', carregarRegistros);
    document.getElementById('btn-salvar').addEventListener('click', salvarRegistro);
    document.getElementById('btn-editar').addEventListener('click', editarRegistro);
    document.getElementById('btn-deletar').addEventListener('click', deletarRegistro);
    document.getElementById('btn-limpar').addEventListener('click', limparFormulario);
    document.getElementById('btn-voltar-loja').addEventListener('click', voltarParaLoja);
    campoBusca.addEventListener('input', filtrarRegistros);
    document.getElementById('btn-limpar-busca').addEventListener('click', limparBusca);

    montarMenu();
    selecionarTabela('cliente');
}

function protegerAdmin() {
    if (sessionStorage.getItem('gestaoLojaAdmin') === 'true') {
        return;
    }
    const senha = prompt('Digite a senha da área administrativa:');
    if (senha === 'admin123') {
        sessionStorage.setItem('gestaoLojaAdmin', 'true');
        return;
    }
    window.location.href = 'index.html';
}

function voltarParaLoja() {
    window.location.href = 'index.html';
}

function montarMenu() {
    menuTabelas.innerHTML = '';
    Object.entries(tabelas).forEach(([chave, config]) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.innerHTML = `<i class="fa-solid ${config.icone}"></i><span>${config.titulo}</span>`;
        botao.addEventListener('click', () => selecionarTabela(chave));
        botao.dataset.tabela = chave;
        menuTabelas.appendChild(botao);
    });
}

async function selecionarTabela(chave) {
    tabelaAtual = chave;
    tituloTabela.textContent = tabelas[chave].titulo;

    document.querySelectorAll('#menu-tabelas button').forEach((botao) => {
        botao.classList.toggle('ativo', botao.dataset.tabela === chave);
    });

    limparMensagem();
    campoBusca.value = buscasPorTabela[chave] || '';
    await carregarDadosApoio();
    montarCabecalho();
    montarFormulario();
    atualizarBotoesContexto();
    await carregarRegistros();
}

async function carregarDadosApoio() {
    try {
        const [clientes, fornecedores, produtos, itensPedido] = await Promise.all([
            buscarLista('cliente'),
            buscarLista('fornecedor'),
            buscarLista('produto'),
            buscarLista('item_pedido'),
        ]);
        dadosApoio.clientes = clientes;
        dadosApoio.fornecedores = fornecedores;
        dadosApoio.produtos = produtos;
        dadosApoio.itensPedido = itensPedido;
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao carregar dados auxiliares:', erro);
        mostrarMensagem('Erro ao carregar dados auxiliares: ' + erro.message, 'erro');
    }
}

async function buscarLista(rota) {
    const resposta = await fetch(`${API_BASE}/${rota}`);
    const dados = await lerResposta(resposta);
    return Array.isArray(dados) ? dados : [];
}

function montarCabecalho() {
    const campos = tabelas[tabelaAtual].campos;
    cabecalhoTabela.innerHTML = '<tr>' + campos.map((campo) => `<th>${campo.rotulo}</th>`).join('') + '</tr>';
}

function montarFormulario() {
    formRegistro.innerHTML = '';
    tabelas[tabelaAtual].campos.forEach((campo) => {
        const div = document.createElement('div');
        div.className = 'campo';
        div.innerHTML = campo.tipo === 'select' ? htmlSelect(campo) : htmlInput(campo);
        formRegistro.appendChild(div);
    });

    if (tabelas[tabelaAtual].fluxoPedido) {
        prepararFormularioPedido();
    }
}

function htmlInput(campo) {
    return `
        <label for="${campo.nome}">${campo.rotulo}</label>
        <input id="${campo.nome}" name="${campo.nome}" ${campo.readonly ? 'readonly' : ''}>
    `;
}

function htmlSelect(campo) {
    const opcoes = opcoesSelect(campo);
    const aviso = opcoes.length === 0 ? `<p class="aviso-campo">${mensagemSemDados(campo.fonte)}</p>` : '';
    return `
        <label for="${campo.nome}">${campo.rotulo}</label>
        <select id="${campo.nome}" name="${campo.nome}" ${opcoes.length === 0 ? 'disabled' : ''}>
            <option value="">Selecione...</option>
            ${opcoes.map((item) => `<option value="${item.id}">${item.nome}</option>`).join('')}
        </select>
        ${aviso}
    `;
}

function opcoesSelect(campo) {
    return dadosApoio[campo.fonte] || [];
}

function mensagemSemDados(fonte) {
    if (fonte === 'fornecedores') return 'Cadastre um fornecedor primeiro.';
    if (fonte === 'produtos') return 'Cadastre um produto primeiro.';
    if (fonte === 'clientes') return 'Cadastre um cliente primeiro.';
    return 'Cadastre os registros relacionados primeiro.';
}

function prepararFormularioPedido() {
    document.getElementById('data').value = dataHoje();
    document.getElementById('total').value = '0.00';
    itensTemporariosPedido = [];

    const bloco = document.createElement('div');
    bloco.className = 'pedido-itens';
    bloco.innerHTML = `
        <h4>Itens do pedido</h4>
        <div class="pedido-adicionar">
            <div class="campo">
                <label for="pedido-produto">Produto</label>
                <select id="pedido-produto" ${dadosApoio.produtos.length === 0 ? 'disabled' : ''}>
                    <option value="">Selecione...</option>
                    ${dadosApoio.produtos.map((produto) => `<option value="${produto.id}">${produto.nome} - R$ ${formatarMoeda(produto.preco)}</option>`).join('')}
                </select>
            </div>
            <div class="campo">
                <label for="pedido-quantidade">Quantidade</label>
                <input id="pedido-quantidade" type="number" min="1" value="1">
            </div>
        </div>
        <button id="btn-adicionar-item" class="btn btn-secundario" type="button">
            <i class="fa-solid fa-plus"></i>
            Adicionar ao pedido
        </button>
        <div class="mini-tabela-wrapper">
            <table class="mini-tabela">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Unitario</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="pedido-itens-corpo"></tbody>
            </table>
        </div>
        <div id="pedido-itens-detalhe" class="pedido-detalhe"></div>
    `;
    formRegistro.appendChild(bloco);
    document.getElementById('btn-adicionar-item').addEventListener('click', adicionarItemPedidoTemporario);
    renderizarItensTemporarios();
}

async function carregarRegistros() {
    try {
        console.info(`[Gestão Loja] Buscando dados: GET ${urlTabela()}`);
        await carregarDadosApoio();
        const resposta = await fetch(urlTabela());
        const dados = await lerResposta(resposta);

        if (!Array.isArray(dados)) {
            throw new Error('A API não retornou uma lista JSON.');
        }

        registrosAtuais = dados;
        aplicarFiltro();
        renderizarTabela();
        mostrarMensagem('Lista atualizada.', 'sucesso');
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao carregar registros:', erro);
        registrosAtuais = [];
        registrosFiltrados = [];
        renderizarTabela();
        mostrarMensagem(erro.message, 'erro');
    }
}

function renderizarTabela() {
    const campos = tabelas[tabelaAtual].campos;
    corpoTabela.innerHTML = '';
    totalRegistros.textContent = `${registrosFiltrados.length} ${registrosFiltrados.length === 1 ? 'item' : 'itens'}`;

    if (!registrosFiltrados.length) {
        corpoTabela.innerHTML = `<tr><td colspan="${campos.length}">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    registrosFiltrados.forEach((registro) => {
        const linha = document.createElement('tr');
        linha.innerHTML = campos.map((campo) => `<td>${valorExibicao(registro, campo)}</td>`).join('');
        linha.addEventListener('click', () => selecionarRegistro(linha, registro));
        corpoTabela.appendChild(linha);
    });
}

function selecionarRegistro(linha, registro) {
    document.querySelectorAll('tbody tr').forEach((tr) => tr.classList.remove('selecionado'));
    linha.classList.add('selecionado');

    tabelas[tabelaAtual].campos.forEach((campo) => {
        const elemento = document.getElementById(campo.nome);
        if (elemento) {
            elemento.value = valor(campoValor(registro, campo.nome));
        }
    });

    if (tabelas[tabelaAtual].fluxoPedido) {
        carregarItensDoPedidoSelecionado(registro.id);
    }
}

async function salvarRegistro() {
    if (tabelas[tabelaAtual].fluxoPedido) {
        await salvarPedidoComItens();
        return;
    }
    if (tabelas[tabelaAtual].somenteConsulta) {
        mostrarMensagem('Item Pedido é gerenciado automaticamente pela tela Pedido.', 'erro');
        return;
    }

    try {
        const payload = dadosFormulario(false);
        console.info(`[Gestão Loja] Criando registro: POST ${urlTabela()}`, payload);
        const resposta = await fetch(urlTabela(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        await lerResposta(resposta);
        mostrarMensagem('Registro salvo.', 'sucesso');
        limparFormulario();
        await carregarRegistros();
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao salvar registro:', erro);
        mostrarMensagem(erro.message, 'erro');
    }
}

async function editarRegistro() {
    if (tabelas[tabelaAtual].somenteConsulta) {
        mostrarMensagem('Item Pedido é apenas consulta e exclusão.', 'erro');
        return;
    }

    const id = document.getElementById('id').value;
    if (!id) {
        mostrarMensagem('Selecione um registro antes de editar.', 'erro');
        return;
    }

    try {
        if (tabelas[tabelaAtual].fluxoPedido) {
            await salvarItensDoPedidoExistente(Number(id));
        }

        const payload = dadosFormulario(true);
        console.info(`[Gestão Loja] Editando registro: PUT ${urlTabela()}/${id}`, payload);
        const resposta = await fetch(`${urlTabela()}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        await lerResposta(resposta);
        mostrarMensagem('Registro editado.', 'sucesso');
        await carregarRegistros();
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao editar registro:', erro);
        mostrarMensagem(erro.message, 'erro');
    }
}

async function deletarRegistro() {
    const id = document.getElementById('id').value;
    if (!id) {
        mostrarMensagem('Selecione um registro antes de deletar.', 'erro');
        return;
    }

    if (!confirm(`Deseja deletar o registro #${id}?`)) {
        return;
    }

    try {
        console.info(`[Gestão Loja] Deletando registro: DELETE ${urlTabela()}/${id}`);
        const resposta = await fetch(`${urlTabela()}/${id}`, { method: 'DELETE' });
        await lerResposta(resposta);
        mostrarMensagem('Registro deletado.', 'sucesso');
        limparFormulario();
        await carregarRegistros();
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao deletar registro:', erro);
        mostrarMensagem(erro.message, 'erro');
    }
}

async function salvarPedidoComItens() {
    try {
        validarPedido();
        const pedido = dadosFormulario(false);
        const respostaPedido = await fetch(`${API_BASE}/pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido),
        });
        const pedidoCriado = await lerResposta(respostaPedido);

        for (const item of itensTemporariosPedido) {
            await criarItemPedido(pedidoCriado.id, item);
        }

        mostrarMensagem('Pedido salvo com itens.', 'sucesso');
        limparFormulario();
        await carregarRegistros();
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao salvar pedido:', erro);
        mostrarMensagem(erro.message, 'erro');
    }
}

async function salvarItensDoPedidoExistente(idPedido) {
    validarPedido();
    const itensAtuais = dadosApoio.itensPedido.filter((item) => Number(item.idPedido) === Number(idPedido));
    for (const item of itensAtuais) {
        await fetch(`${API_BASE}/item_pedido/${item.id}`, { method: 'DELETE' });
    }
    for (const item of itensTemporariosPedido) {
        await criarItemPedido(idPedido, item);
    }
}

async function criarItemPedido(idPedido, item) {
    const resposta = await fetch(`${API_BASE}/item_pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idPedido,
            idProduto: item.produto.id,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
        }),
    });
    await lerResposta(resposta);
}

function validarPedido() {
    if (!Number(document.getElementById('idCliente').value)) {
        throw new Error('Escolha um cliente.');
    }
    if (!document.getElementById('data').value) {
        throw new Error('Informe a data do pedido.');
    }
    if (itensTemporariosPedido.length === 0) {
        throw new Error('Adicione pelo menos um produto ao pedido.');
    }
}

function adicionarItemPedidoTemporario() {
    const idProduto = Number(document.getElementById('pedido-produto').value);
    const quantidade = Number(document.getElementById('pedido-quantidade').value);
    const produto = dadosApoio.produtos.find((item) => Number(item.id) === idProduto);

    if (!produto) {
        mostrarMensagem('Escolha um produto para adicionar ao pedido.', 'erro');
        return;
    }
    if (!quantidade || quantidade <= 0) {
        mostrarMensagem('Quantidade precisa ser maior que zero.', 'erro');
        return;
    }

    itensTemporariosPedido.push({
        produto,
        quantidade,
        precoUnitario: Number(produto.preco),
    });
    renderizarItensTemporarios();
}

function renderizarItensTemporarios() {
    const corpo = document.getElementById('pedido-itens-corpo');
    if (!corpo) return;

    corpo.innerHTML = '';
    if (!itensTemporariosPedido.length) {
        corpo.innerHTML = '<tr><td colspan="5">Nenhum item adicionado.</td></tr>';
    } else {
        itensTemporariosPedido.forEach((item, indice) => {
            const subtotal = item.quantidade * item.precoUnitario;
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${item.produto.nome}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${formatarMoeda(item.precoUnitario)}</td>
                <td>R$ ${formatarMoeda(subtotal)}</td>
                <td><button class="btn-mini" type="button" data-indice="${indice}">Remover</button></td>
            `;
            corpo.appendChild(linha);
        });
    }

    corpo.querySelectorAll('.btn-mini').forEach((botao) => {
        botao.addEventListener('click', () => {
            itensTemporariosPedido.splice(Number(botao.dataset.indice), 1);
            renderizarItensTemporarios();
        });
    });
    atualizarTotalPedido();
}

function atualizarTotalPedido() {
    const total = itensTemporariosPedido.reduce((soma, item) => soma + item.quantidade * item.precoUnitario, 0);
    const campoTotal = document.getElementById('total');
    if (campoTotal) {
        campoTotal.value = total.toFixed(2);
    }
}

function carregarItensDoPedidoSelecionado(idPedido) {
    itensTemporariosPedido = dadosApoio.itensPedido
        .filter((item) => Number(item.idPedido) === Number(idPedido))
        .map((item) => ({
            produto: dadosApoio.produtos.find((produto) => Number(produto.id) === Number(item.idProduto)) || {
                id: item.idProduto,
                nome: `Produto #${item.idProduto}`,
                preco: item.precoUnitario,
            },
            quantidade: Number(item.quantidade),
            precoUnitario: Number(item.precoUnitario),
        }));
    renderizarItensTemporarios();
    renderizarDetalhePedido();
}

function renderizarDetalhePedido() {
    const detalhe = document.getElementById('pedido-itens-detalhe');
    if (!detalhe) return;
    detalhe.textContent = itensTemporariosPedido.length
        ? `${itensTemporariosPedido.length} item(ns) carregado(s) para este pedido.`
        : 'Este pedido não possui itens vinculados.';
}

function filtrarRegistros() {
    buscasPorTabela[tabelaAtual] = campoBusca.value;
    aplicarFiltro();
    renderizarTabela();
}

function aplicarFiltro() {
    const termo = normalizarBusca(campoBusca.value);
    if (!termo) {
        registrosFiltrados = [...registrosAtuais];
        return;
    }

    const camposBusca = tabelas[tabelaAtual].busca || tabelas[tabelaAtual].campos.map((campo) => campo.nome);
    registrosFiltrados = registrosAtuais.filter((registro) =>
        camposBusca.some((campo) => normalizarBusca(valorCampoParaBusca(registro, campo)).includes(termo))
    );
}

function limparBusca() {
    campoBusca.value = '';
    buscasPorTabela[tabelaAtual] = '';
    aplicarFiltro();
    renderizarTabela();
}

function dadosFormulario(incluirId) {
    const dados = {};
    tabelas[tabelaAtual].campos.forEach((campo) => {
        if (campo.nome === 'id' && !incluirId) {
            return;
        }
        dados[campo.nome] = normalizarValor(campo.nome, document.getElementById(campo.nome).value);
    });
    return dados;
}

function normalizarValor(nome, valorCampo) {
    const valorLimpo = valorCampo.trim();
    if (valorLimpo === '') {
        return null;
    }
    if (nome === 'id' || nome.startsWith('id') || nome === 'quantidade') {
        return Number(valorLimpo);
    }
    if (nome === 'preco' || nome === 'custo' || nome === 'precoUnitario' || nome === 'total') {
        return Number(valorLimpo.replace(',', '.'));
    }
    return valorLimpo;
}

async function lerResposta(resposta) {
    const texto = await resposta.text();
    let dados = {};

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch (erro) {
        console.error('[Gestão Loja] Resposta não é JSON válido:', texto);
        throw new Error('A API retornou uma resposta inválida.');
    }

    if (!resposta.ok) {
        throw new Error(dados.mensagem || `Erro HTTP ${resposta.status}.`);
    }
    return dados;
}

function campoValor(registro, nomeCampo) {
    if (Object.prototype.hasOwnProperty.call(registro, nomeCampo)) {
        return registro[nomeCampo];
    }

    const snakeCase = camelParaSnake(nomeCampo);
    if (Object.prototype.hasOwnProperty.call(registro, snakeCase)) {
        return registro[snakeCase];
    }

    console.warn(`[Gestão Loja] Campo ausente no JSON: ${nomeCampo}. Registro recebido:`, registro);
    return '';
}

function valorExibicao(registro, campo) {
    const renderizador = tabelas[tabelaAtual].render?.[campo.nome];
    if (renderizador) {
        return valor(renderizador(registro));
    }
    return valor(campoValor(registro, campo.nome));
}

function valorCampoParaBusca(registro, campo) {
    const campoConfig = tabelas[tabelaAtual].campos.find((item) => item.nome === campo);
    return campoConfig ? valorExibicao(registro, campoConfig) : campoValor(registro, campo);
}

function camelParaSnake(texto) {
    return texto.replace(/[A-Z]/g, (letra) => `_${letra.toLowerCase()}`);
}

function limparFormulario() {
    formRegistro.reset();
    document.querySelectorAll('tbody tr').forEach((tr) => tr.classList.remove('selecionado'));
    if (tabelas[tabelaAtual].fluxoPedido) {
        document.getElementById('data').value = dataHoje();
        itensTemporariosPedido = [];
        renderizarItensTemporarios();
    }
}

function atualizarBotoesContexto() {
    document.getElementById('btn-salvar').disabled = Boolean(tabelas[tabelaAtual].somenteConsulta);
    document.getElementById('btn-editar').disabled = Boolean(tabelas[tabelaAtual].somenteConsulta);
    document.getElementById('btn-salvar').innerHTML = tabelas[tabelaAtual].fluxoPedido
        ? '<i class="fa-solid fa-floppy-disk"></i>Salvar Pedido'
        : '<i class="fa-solid fa-floppy-disk"></i>Salvar';
}

function urlTabela() {
    return `${API_BASE}/${tabelas[tabelaAtual].rota}`;
}

function valor(valorOriginal) {
    return valorOriginal === null || valorOriginal === undefined ? '' : valorOriginal;
}

function normalizarBusca(valorOriginal) {
    return String(valor(valorOriginal))
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function nomePorId(lista, id) {
    const item = lista.find((registro) => Number(registro.id) === Number(id));
    return item ? item.nome : `#${id}`;
}

function dataHoje() {
    return new Date().toISOString().slice(0, 10);
}

function formatarMoeda(valorOriginal) {
    return Number(valorOriginal || 0).toFixed(2);
}

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    setTimeout(() => mensagem.classList.add('oculto'), 3200);
}

function limparMensagem() {
    mensagem.textContent = '';
    mensagem.className = 'mensagem oculto';
}
