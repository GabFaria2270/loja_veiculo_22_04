$(document).ready(() => {
    // Função para limpar o formulário
    const limparFormulario = () => {
        $('#formUsuario')[0].reset();
    };

    // Evento de envio do formulário
    $('#formUsuario').on('submit', async function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        // Coleta os dados do formulário
        const usuario = {
            fullname: $('#fullname').val(), // Nome completo
            email: $('#email').val(),       // E-mail
            telefone: $('#phone').val(),    // Telefone
            senha: $('#password').val(),    // Senha (sem encriptação)
            admin: false,                   // Define o usuário como não administrador por padrão
            imagem: ""                      // Campo de imagem vazio ao cadastrar
        };

        // Envia os dados para a API
        const response = await fetch('http://localhost:3000/usuario', {
            method: 'POST',
            body: JSON.stringify(usuario),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!', 'success');
            limparFormulario();
            setTimeout(() => {
                window.location.href = '/usuario/login'; // Redireciona para a página de login
            }, 1000); // Aguarda 2 segundos antes de redirecionar
        } else {
            alert('Erro ao cadastrar usuário!');
        }
    });
});