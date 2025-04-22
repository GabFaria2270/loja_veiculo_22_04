const rotas = [
    {
        'path': '',
        'component': '/page/home.html'
    },
    {
        'path': '/',
        'component': '/page/home.html'
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

const arquivoRoot = (arquivoRoot)=>{
    let rota = rotear(window.location.pathname);
    $(`#${arquivoRoot}`).load(rota.component);  
} 