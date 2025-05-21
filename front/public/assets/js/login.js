$(document).ready(() => {
    $('#formLogin').on('submit', async function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        // Captura os dados do formulário
        const email = $('#email').val();
        const senha = $('#password').val();

        try {
            // Faz uma requisição GET para buscar todos os usuários cadastrados
            const resposta = await fetch("http://localhost:3000/usuario");

            if (!resposta.ok) {
                throw new Error('Erro ao buscar usuários.');
            }

            const usuarios = await resposta.json(); // Converte a resposta para JSON

            // Verifica se o usuário existe e a senha está correta (sem encriptação)
            const usuarioEncontrado = usuarios.find(
                usuario => usuario.email === email && usuario.senha === senha
            );


            if (usuarioEncontrado) {
                const tipoUsuario = usuarioEncontrado.admin ? 1 : 2;
                localStorage.setItem('userData', tipoUsuario);
                localStorage.setItem('userDataInfo', JSON.stringify(usuarioEncontrado)); // Salva o usuário completo
                alert('Login realizado com sucesso!');
                window.location.href = '/home';
            } else {
                alert('E-mail ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao realizar login. Tente novamente mais tarde.');
        }
    });
});