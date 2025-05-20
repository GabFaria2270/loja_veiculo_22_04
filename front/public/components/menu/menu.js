import { loadJS } from '/assets/js/helpers.js';

export const loadMenu = async (containerMenuId) => {
    let tipo;

    // Recupera e converte o valor de userData para número
    const userData = parseInt(localStorage.getItem('userData'), 10);

    if (userData === 1) {
        tipo = 'admin'; // Tipo de menu para administradores
    } else if (userData === 2) {
        tipo = 'logado'; // Tipo de menu para usuários comuns
    } else {
        tipo = 'default'; // Tipo de menu para visitantes
    }

    try {
        const response = await fetch(`/components/menu/menu-${tipo}.html`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o menu: ${response.statusText}`);
        }

        const menu = await response.text();
        const container = document.getElementById(containerMenuId);
        if (!container) {
            throw new Error(`Elemento com ID "${containerMenuId}" não encontrado.`);
        }

        container.innerHTML = menu;
        loadJS(containerMenuId); // Carrega os scripts do menu

        // ...adicione após o carregamento do menu...
        $(document).on('click', '#btnAbrirModalImagemUsuario', function (e) {
            e.preventDefault();
            const userData = JSON.parse(localStorage.getItem('userDataInfo') || '{}');
            $('#imgPreviewUsuario').attr('src', userData.imagem || 'https://via.placeholder.com/120');
            $('#inputNomeUsuario').val(userData.fullname || '');
            $('#modalImagemUsuario').modal('show');
        });

        // Preview da imagem selecionada
        $(document).on('change', '#inputImagemUsuario', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $('#imgPreviewUsuario').attr('src', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Salvar imagem (envia para o backend e atualiza localStorage)
        $(document).on('click', '#btnSalvarImagemUsuario', async function () {
            const fileInput = $('#inputImagemUsuario')[0];
            const novoNome = $('#inputNomeUsuario').val().trim();
            let novaImagem = null;

            // Upload da imagem se houver
            if (fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                const upload = await fetch('http://localhost:3037/upload', {
                    method: 'POST',
                    body: formData
                });
                if (!upload.ok) {
                    alert('Erro ao enviar imagem!');
                    return;
                }
                const result = await upload.json();
                novaImagem = result.url;
            }

            // Atualiza o usuário no backend
            let userData = JSON.parse(localStorage.getItem('userDataInfo') || '{}');
            const userId = String(userData.id);

            // Monta o objeto de atualização
            const updateObj = {};
            if (novoNome && novoNome !== userData.fullname) updateObj.fullname = novoNome;
            if (novaImagem) updateObj.imagem = novaImagem;

            if (Object.keys(updateObj).length === 0) {
                alert('Nenhuma alteração feita.');
                return;
            }

            const patchResponse = await fetch(`http://localhost:3000/usuario/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateObj)
            });

            if (!patchResponse.ok) {
                alert('Erro ao atualizar usuário no banco');
                return;
            }

            // Atualiza localStorage e interface
            if (novoNome) userData.fullname = novoNome;
            if (novaImagem) userData.imagem = novaImagem;
            localStorage.setItem('userDataInfo', JSON.stringify(userData));
            atualizarPerfilNavbar();
            $('#modalImagemUsuario').modal('hide');
            alert('Perfil atualizado!');
        });

        // Ao carregar o menu, sempre atualize a imagem do perfil
        const userDataInfo = JSON.parse(localStorage.getItem('userDataInfo') || '{}');
        $('.img-perfil-usuario').attr('src', userDataInfo.imagem || 'https://via.placeholder.com/40');
        $('#user-nome-menu').text(userDataInfo.fullname || 'Usuário');
    } catch (error) {
        console.error('Erro ao carregar o menu:', error);
    }
};

function atualizarPerfilNavbar() {
    const userDataInfo = JSON.parse(localStorage.getItem('userDataInfo') || '{}');
    // Use um seletor mais específico se necessário, por exemplo:
    const $container = $('.perfil-usuario-container');
    const $icone = $container.find('.perfil-usuario-icone');
    const $img = $container.find('.img-perfil-usuario');

    if (userDataInfo.imagem && userDataInfo.imagem.trim() !== "") {
        $img.attr('src', userDataInfo.imagem).removeClass('d-none');
        $icone.addClass('d-none');
    } else {
        $img.addClass('d-none');
        $icone.removeClass('d-none');
    }
    $('#user-nome-menu').text(userDataInfo.fullname || 'Usuário');
}

// Chame ao carregar o menu e após salvar:
$(document).ready(function() {
    atualizarPerfilNavbar();
});