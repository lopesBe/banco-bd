const USUARIOS = {
    teste: {
        usuario: 'teste',
        senha: 'teste123',
        nome: 'Usuário Teste',
        email: 'teste@smartbase.com',
        cidade: 'Lages',
        papel: 'CLIENTE',
        destino: 'index.html',
    },
    admin: {
        usuario: 'admin',
        senha: 'admin123',
        nome: 'Administrador',
        email: 'admin@smartbase.com',
        cidade: 'Lages',
        papel: 'ADMIN',
        destino: 'admin.html',
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    const inputUsuario = document.getElementById('login-usuario');
    const inputSenha = document.getElementById('login-senha');

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        autenticar(inputUsuario.value, inputSenha.value);
    });

    document.querySelectorAll('.conta-card').forEach((card) => {
        card.addEventListener('click', () => {
            inputUsuario.value = card.dataset.usuario;
            inputSenha.value = card.dataset.senha;
            inputUsuario.focus();
        });
    });
});

function autenticar(usuarioDigitado, senhaDigitada) {
    const chave = String(usuarioDigitado || '').trim().toLowerCase();
    const senha = String(senhaDigitada || '').trim();

    const conta = USUARIOS[chave];
    if (!conta || conta.senha !== senha) {
        mostrarMensagem('Usuário ou senha inválidos. Use "teste / teste123" ou "admin / admin123".', 'erro');
        return;
    }

    const sessao = {
        usuario: conta.usuario,
        nome: conta.nome,
        email: conta.email,
        cidade: conta.cidade,
        papel: conta.papel,
    };

    sessionStorage.setItem('gestaoLojaUsuario', JSON.stringify(sessao));
    if (conta.papel === 'ADMIN') {
        sessionStorage.setItem('gestaoLojaAdmin', 'true');
    } else {
        sessionStorage.removeItem('gestaoLojaAdmin');
    }

    window.location.href = conta.destino;
}

function mostrarMensagem(texto, tipo) {
    const el = document.getElementById('mensagem-login');
    el.textContent = texto;
    el.className = `mensagem ${tipo}`;
}

