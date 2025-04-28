export const loadJS = (containerId) =>{
    // Encontra e executa todos os <script> do conteúdo carregado
    const container = document.getElementById(containerId);
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");

        // Copia o conteúdo ou src
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }

        // Preserva atributos do script original, se houver
        [...oldScript.attributes].forEach(attr =>
            newScript.setAttribute(attr.name, attr.value)
        );

        // Adiciona ao DOM para execução
        document.body.appendChild(newScript);
    });
}