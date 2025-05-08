const rotas = [
    {
        'path': '',
        'component': '/page/index.html'
    },
    {
        'path': '/',
        'component': '/page/index.html'
    },
    {
        'path': '/teste',
        'component': '/page/teste.html'
    },
    {
        'path': '/teste/teste',
        'component': '/page/teste.html'
    },
    {
        'path': '/veiculo/cadastro',
        'component': '/page/veiculo/cadastro.html'
    }
];

const rotear = (rotaUrl) => {
    const rotaEncontrada = rotas.find(rota => rota.path.toLowerCase() === rotaUrl.toLowerCase());
    return rotaEncontrada || {
        path: '/error',
        component: '/page/erro.html'
    };
}

export const loadPage = async (callBackPageReturned) => {
    try {
        let rota = rotear(window.location.pathname);
        const response = await fetch(rota.component);

        if (!response.ok) {
            throw new Error(`Erro ao carregar a página: ${response.statusText}`);
        }

        const page = await response.text();
        callBackPageReturned(page); // Chama o callback com o conteúdo

    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
}

// export const loadPage = (containerRootId)=>{
//     let rota = rotear();
//     $(`#${containerRootId}`).load(rota.component);
// }

// export const loadPage = async () => {
//     try {
//         let rota = rotear(window.location.pathname);
//         const response = await fetch(rota.component);

//         if (!response.ok) {
//             throw new Error(`Erro ao carregar a página: ${response.statusText}`);
//         }

//         return await response.text();

//     } catch (error) {
//         console.error('Erro ao carregar página:', error);
//     }
// }

//####Como usar se o loadPage retornar o conteudo
// const conteudo = await loadPage();
// if (conteudo) {
//     document.getElementById('app').innerHTML = conteudo;
// }

//####Como usar se o loadPage receber um callback
// loadPage().then(conteudo => {
//     if (conteudo) {
//         document.getElementById('app').innerHTML = conteudo;
//     }
// });


