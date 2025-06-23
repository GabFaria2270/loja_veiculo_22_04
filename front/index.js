const express = require('express');
const path = require('path');
const app = express();

// Middleware para redirecionar HTTPS para HTTP (opcional)
app.use((req, res, next) => {
    if (req.secure) {
        return res.redirect(301, `http://${req.headers.host}${req.url}`);
    }
    next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Roteamento SPA: redireciona todas as requisições desconhecidas para index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
const PORT = 3030; // Altere a porta se necessário
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
