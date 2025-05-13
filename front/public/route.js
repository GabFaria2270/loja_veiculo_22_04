const rotas = [
    {
        path: '',
        component: '/page/home.html',
        showMenu: true // Exibir o menu por padrão
    },
    {
        path: '/',
        component: '/page/home.html',
        showMenu: true // Exibir o menu por padrão
    },
    {
        path: '/teste',
        component: '/page/teste.html',
        showMenu: true // Exibir o menu
    },
    {
        path: '/veiculo/cadastro',
        component: '/page/veiculo/cadastro.html',
        showMenu: true // Exibir o menu
    },
    {
        path: '/usuario/cadastro',
        component: '/page/cadastro.html',
        showMenu: false // Não exibir o menu
    },
    {
        path: '/usuario/login',
        component: '/page/login.html',
        showMenu: false // Não exibir o menu
    },
    {
        path: '/home',
        component: '/page/home.html',
        showMenu: true // Exibir o menu na página home
    },

    
];

const rotear = (rotaUrl) => {
    const rotaEncontrada = rotas.find(rota => rota.path.toLowerCase() === rotaUrl.toLowerCase());
    return rotaEncontrada || {
        path: '/error',
        component: '/page/erro.html',
        showMenu: true // Exibir o menu por padrão em páginas de erro
    };
};

export const loadPage = async (callBackPageReturned) => {
    try {
        let rota = rotear(window.location.pathname);

        // Verificar se o menu deve ser exibido
        const menuContainer = document.getElementById('menu');
        if (menuContainer) {
            menuContainer.style.display = rota.showMenu ? 'block' : 'none';
        }

        // Verificar se o rodapé deve ser exibido
        const footerContainer = document.getElementById('container-footer');
        if (footerContainer) {
            footerContainer.style.display = rota.showMenu ? 'block' : 'none';
        }

        const response = await fetch(rota.component);
        if (!response.ok) {
            throw new Error(`Erro ao carregar a página: ${response.statusText}`);
        }

        const page = await response.text();
        callBackPageReturned(page);
    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
};