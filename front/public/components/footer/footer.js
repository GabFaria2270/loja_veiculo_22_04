export const loadFooter = async (containerFooterId) => {
    try {
        const response = await fetch('/components/footer/footer.html');
        if (!response.ok) {
            throw new Error(`Erro ao carregar o footer: ${response.statusText}`);
        }
        const footer = await response.text();
        const container = document.getElementById(containerFooterId);
        if (container) {
            container.innerHTML = footer;
        } else {
            console.error(`Elemento com ID "${containerFooterId}" não encontrado.`);
        }
    } catch (error) {
        console.error('Erro ao carregar o footer:', error);
    }
};