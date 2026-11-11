const API_BASE = 'http://localhost:7000/api';
const SENHA_ADMIN = 'admin123';

let produtos = [];
let carrinho = [];
let termoBuscaProdutos = '';
let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!verificarLoginLoja()) {
        return;
    }
    document.getElementById('btn-admin').addEventListener('click', acessarAdmin);
    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', sairDaConta);
    }
    document.getElementById('btn-finalizar').addEventListener('click', finalizarCompra);
    const buscaProdutos = document.getElementById('busca-produtos');
    if (buscaProdutos) {
        buscaProdutos.addEventListener('input', () => {
            termoBuscaProdutos = buscaProdutos.value;
            renderizarProdutos();
        });
    }
    carregarProdutos();
});

function verificarLoginLoja() {
    try {
        const salvo = sessionStorage.getItem('gestaoLojaUsuario');
        if (!salvo) {
            window.location.href = 'login.html';
            return false;
        }
        usuarioLogado = JSON.parse(salvo);
        const badge = document.getElementById('usuario-logado-badge');
        if (badge && usuarioLogado) {
            const icone = usuarioLogado.papel === 'ADMIN' ? 'fa-user-shield' : 'fa-user';
            badge.innerHTML = `<i class="fa-solid ${icone}"></i> ${usuarioLogado.nome} (${usuarioLogado.papel})`;
            badge.classList.remove('oculto');
        }
        preencherDadosUsuarioCheckout();
        return true;
    } catch (e) {
        window.location.href = 'login.html';
        return false;
    }
}

function preencherDadosUsuarioCheckout() {
    if (!usuarioLogado) return;
    const campoNome = document.getElementById('cliente-nome');
    const campoEmail = document.getElementById('cliente-email');
    const campoCidade = document.getElementById('cliente-cidade');
    if (campoNome && !campoNome.value) campoNome.value = usuarioLogado.nome || '';
    if (campoEmail && !campoEmail.value) campoEmail.value = usuarioLogado.email || '';
    if (campoCidade && !campoCidade.value) campoCidade.value = usuarioLogado.cidade || '';
}

function sairDaConta() {
    sessionStorage.removeItem('gestaoLojaUsuario');
    sessionStorage.removeItem('gestaoLojaAdmin');
    window.location.href = 'login.html';
}

async function carregarProdutos() {
    try {
        const resposta = await fetch(`${API_BASE}/produto`);
        produtos = await lerResposta(resposta);
        renderizarProdutos();
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao carregar vitrine:', erro);
        mostrarMensagem(erro.message, 'erro');
    }
}

function renderizarProdutos() {
    const lista = document.getElementById('lista-produtos');
    const heroTotal = document.getElementById('hero-total-produtos');
    if (heroTotal) {
        heroTotal.textContent = produtos.length;
    }

    const termo = normalizarBusca(termoBuscaProdutos);
    const produtosVisiveis = produtos.filter((produto) => normalizarBusca(produto.nome).includes(termo));
    document.getElementById('total-produtos').textContent = `${produtosVisiveis.length} ${produtosVisiveis.length === 1 ? 'produto' : 'produtos'}`;
    lista.innerHTML = '';

    if (!produtos.length) {
        lista.innerHTML = '<p class="vazio-loja">Nenhum produto disponível no momento.</p>';
        return;
    }

    if (!produtosVisiveis.length) {
        lista.innerHTML = '<p class="vazio-loja">Nenhum produto encontrado para essa busca.</p>';
        return;
    }

    produtosVisiveis.forEach((produto) => {
        const card = document.createElement('article');
        card.className = 'produto-card';
        const icone = iconeProduto(produto.nome);
        card.innerHTML = `
            <div class="produto-media">
                <span class="produto-badge">Disponível</span>
                <div class="produto-icone"><i class="fa-solid ${icone}"></i></div>
            </div>
            <div class="produto-info">
                <span class="produto-categoria">Produto #${produto.id}</span>
                <h3>${produto.nome}</h3>
                <p class="produto-descricao">Item pronto para compra com pedido registrado automaticamente.</p>
            </div>
            <div class="produto-rodape">
                <strong>R$ ${formatarMoeda(produto.preco)}</strong>
                <button class="btn btn-primario" type="button"><i class="fa-solid fa-cart-plus"></i>Adicionar</button>
            </div>
        `;
        card.querySelector('button').addEventListener('click', () => adicionarAoCarrinho(produto));
        lista.appendChild(card);
    });
}

function iconeProduto(nome) {
    const texto = String(nome || '').toLowerCase();
    if (texto.includes('notebook')) return 'fa-laptop';
    if (texto.includes('mouse')) return 'fa-computer-mouse';
    if (texto.includes('teclado')) return 'fa-keyboard';
    if (texto.includes('monitor')) return 'fa-display';
    if (texto.includes('webcam')) return 'fa-video';
    return 'fa-box';
}
function adicionarAoCarrinho(produto) {
    const item = carrinho.find((registro) => Number(registro.produto.id) === Number(produto.id));
    if (item) {
        item.quantidade += 1;
    } else {
        carrinho.push({ produto, quantidade: 1 });
    }
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    lista.innerHTML = '';

    if (!carrinho.length) {
        lista.innerHTML = '<p class="vazio-loja">Carrinho vazio.</p>';
    } else {
        carrinho.forEach((item, indice) => {
            const linha = document.createElement('div');
            linha.className = 'carrinho-item';
            linha.innerHTML = `
                <div>
                    <strong>${item.produto.nome}</strong>
                    <span>R$ ${formatarMoeda(item.produto.preco)} cada</span>
                    <span>Subtotal: R$ ${formatarMoeda(subtotal(item))}</span>
                </div>
                <div class="carrinho-controles">
                    <input type="number" min="1" value="${item.quantidade}" data-indice="${indice}">
                    <button class="btn-mini" type="button" data-remover="${indice}">Remover</button>
                </div>
            `;
            lista.appendChild(linha);
        });
    }

    lista.querySelectorAll('input[type="number"]').forEach((input) => {
        input.addEventListener('input', () => {
            const indice = Number(input.dataset.indice);
            carrinho[indice].quantidade = Math.max(1, Number(input.value) || 1);
            renderizarCarrinho();
        });
    });
    lista.querySelectorAll('[data-remover]').forEach((botao) => {
        botao.addEventListener('click', () => {
            carrinho.splice(Number(botao.dataset.remover), 1);
            renderizarCarrinho();
        });
    });

    document.getElementById('total-carrinho').textContent = `R$ ${formatarMoeda(totalCarrinho())}`;
}

async function finalizarCompra() {
    try {
        const nome = document.getElementById('cliente-nome').value.trim();
        const email = document.getElementById('cliente-email').value.trim().toLowerCase();
        const cidade = document.getElementById('cliente-cidade').value.trim();
        if (!carrinho.length) {
            throw new Error('Adicione pelo menos um produto ao carrinho.');
        }
        if (!nome || !email || !cidade) {
            throw new Error('Informe nome, email e cidade para finalizar.');
        }

        const pedido = await enviarCheckout(nome, email, cidade);
        console.info(`[Gestão Loja] Pedido criado com sucesso. ID: ${pedido.idPedido}`, pedido);

        carrinho = [];
        document.getElementById('form-checkout').reset();
        preencherDadosUsuarioCheckout();
        renderizarCarrinho();
        mostrarMensagem(`Pedido realizado com sucesso! Código #${pedido.idPedido}`, 'sucesso');
    } catch (erro) {
        console.error('[Gestão Loja] Falha ao finalizar compra:', erro);
        mostrarMensagem(erro.message, 'erro');
    }
}

async function enviarCheckout(nome, email, cidade) {
    const payload = {
        cliente: { nome, email, cidade },
        itens: carrinho.map((item) => ({
            idProduto: item.produto.id,
            quantidade: item.quantidade,
        })),
    };
    console.info('[Gestão Loja] Enviando checkout:', {
        ...payload,
        totalCalculadoNoCarrinho: totalCarrinho(),
    });
    const resposta = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return lerResposta(resposta);
}

function acessarAdmin() {
    if (sessionStorage.getItem('gestaoLojaAdmin') === 'true') {
        window.location.href = 'admin.html';
        return;
    }
    mostrarMensagem('Acesso restrito ao perfil Admin. Redirecionando para o login...', 'erro');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1200);
}

async function lerResposta(resposta) {
    const texto = await resposta.text();
    const dados = texto ? JSON.parse(texto) : {};
    if (!resposta.ok) {
        throw new Error(dados.mensagem || `Erro HTTP ${resposta.status}.`);
    }
    return dados;
}

function normalizarBusca(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}
function subtotal(item) {
    return Number(item.produto.preco || 0) * Number(item.quantidade || 0);
}

function totalCarrinho() {
    return carrinho.reduce((total, item) => total + subtotal(item), 0);
}

function dataHoje() {
    return new Date().toISOString().slice(0, 10);
}

function formatarMoeda(valor) {
    return Number(valor || 0).toFixed(2);
}

function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById('mensagem-loja');
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    setTimeout(() => mensagem.classList.add('oculto'), 4000);
}





