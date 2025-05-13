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
    } catch (error) {
        console.error('Erro ao carregar o menu:', error);
    }
};