// Descrição: Script para alternar entre temas claro e escuro, salvando a preferência do usuário no localStorage.
// Este script deve ser incluído em todas as páginas que utilizam o tema alternativo.

$(document).ready(() => {
  // Aplica tema salvo ou padrão do sistema
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.getElementById('themeIcon').className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }

  // Alterna entre temas e salva no localStorage
  $(document).on('click', '#themeToggle', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  initTheme();
});
