// Função de login
function fazerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    
    
    fetch("http://localhost:3000/usuario")
        .then(response => {
            return response.json();
        })
        .then(usuarios => {
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);
            
            if (usuario) {
                localStorage.setItem("userData", usuario.admin ? "1" : "2");
                localStorage.setItem("userDataInfo", JSON.stringify(usuario));
                window.location.href = "/home";
            } else {
                console.log("Usuário não encontrado");
                alert("Email ou senha incorretos!");
            }
        })
        .catch(error => {
            console.error("Erro durante o login:", error);
            alert("Erro ao conectar ao servidor. Verifique se o JSON Server está rodando.");
        });
}