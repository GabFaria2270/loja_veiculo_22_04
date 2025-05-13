$(document).ready(() => {
    // Função para limpar o formulário
    const limparFormulario = () => {
        $('#formUsuario')[0].reset();
    };

    // Evento de envio do formulário
    $('#formUsuario').on('submit', function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        // Coleta os dados do formulário
        const usuario = {
            fullname: $('#fullname').val(), // Nome completo
            email: $('#email').val(),       // E-mail
            telefone: $('#phone').val(),    // Telefone
            senha: $('#password').val(),     // Senha (sem encriptação)
            admin: false // Define o usuário como não administrador por padrão
        };

        // Configuração da requisição
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(usuario), // Converte o objeto para JSON
            redirect: 'follow'
        };

        // Envia os dados para a API
        fetch("http://localhost:3000/usuario", requestOptions)
            .then(response => {
                if (response.ok) {
                    exibirAlerta('Usuário cadastrado com sucesso!', 'success');
                    limparFormulario();
                    setTimeout(() => {
                        window.location.href = './login.html'; // Redireciona para a página de login
                    }, 2000); // Aguarda 2 segundos antes de redirecionar
                } else {
                    throw new Error('Erro ao cadastrar o usuário.');
                }
                return response.json();
            })
            .then(result => console.log(result))
            .catch(error => {
                console.error('Erro:', error);
                exibirAlerta('Erro ao cadastrar o usuário.', 'danger');
            });
    });
});