import { loadJS } from "/assets/js/helpers.js";

/**
 * Gerenciador de perfil do usuário
 */
const userProfileManager = {
  // Obtém os dados do usuário do localStorage
  getUserData() {
    return JSON.parse(localStorage.getItem("userDataInfo") || "{}");
  },

  // Atualiza os dados do usuário no localStorage
  updateUserData(newData) {
    const userData = this.getUserData();
    const updatedData = { ...userData, ...newData };
    localStorage.setItem("userDataInfo", JSON.stringify(updatedData));
    return updatedData;
  },

  // Verifica se uma URL de imagem existe e está acessível
  imageExists(url) {
    return new Promise((resolve) => {
      if (!url) return resolve(false);

      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  },

  // Atualiza a exibição do perfil na barra de navegação
  async updateProfileDisplay() {
    try {
      const userDataInfo = this.getUserData();
      // Verifica se os elementos existem no DOM
      const $container = $(".perfil-usuario-container");
      if ($container.length === 0) {
        console.warn("Container de perfil não encontrado no DOM");
        return;
      }
      const $icone = $container.find(".perfil-usuario-icone");
      const $img = $container.find(".img-perfil-usuario");
      // Verifica se a imagem existe e está acessível
      const imagemExiste =
        userDataInfo.imagem && (await this.imageExists(userDataInfo.imagem));
      if (imagemExiste) {
        $img
          .attr("src", userDataInfo.imagem)
          .removeClass("d-none")
          .on("error", function () {
            // Fallback em caso de erro ao carregar a imagem
            $(this).addClass("d-none");
            $icone.removeClass("d-none");
          });
        $icone.addClass("d-none");
      } else {
        $img.addClass("d-none");
        $icone.removeClass("d-none");
      }
      // Atualiza o nome do usuário
      $("#user-nome-menu").text(userDataInfo.fullname || "Usuário");
    } catch (error) {
      console.error("Erro ao atualizar display do perfil:", error);
    }
  },

  // Faz upload da nova imagem de perfil
  async uploadProfileImage(file) {
    if (!file) return null;

    const userData = this.getUserData();
    const formData = new FormData();
    formData.append("file", file);
    // NÃO precisa enviar userId no body, só na query!
    formData.append("oldImageUrl", userData.imagem || "");

    const upload = await fetch(
      `http://localhost:3037/upload?tipo=usuarios&userId=${userData.id || ""}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!upload.ok) {
      throw new Error(
        `Erro no upload: ${upload.status} - ${upload.statusText}`
      );
    }

    const result = await upload.json();
    return result.url;
  },

  // Salva as alterações do perfil no backend
  async saveProfileChanges(userId, changes) {
    if (!userId) {
      console.error("ID de usuário não fornecido");
      return { success: false, message: "ID de usuário não fornecido" };
    }

    if (Object.keys(changes).length === 0) {
      return { success: false, message: "Nenhuma alteração feita." };
    }

    try {
      console.log(`Salvando alterações para usuário ${userId}:`, changes);
      const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error(
          `Erro ao atualizar usuário: ${response.status} - ${response.statusText}`
        );
      }

      console.log("Alterações salvas com sucesso");
      return { success: true };
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      return { success: false, message: error.message };
    }
  },
};

/**
 * Configuração dos handlers de eventos para o perfil
 */
function setupProfileEventHandlers() {
  console.log("Configurando handlers de eventos do perfil");

  // Abre o modal de edição de perfil
  $(document).on("click", "#btnAbrirModalImagemUsuario", function (e) {
    e.preventDefault();
    console.log("Abrindo modal de edição de perfil");

    const userData = userProfileManager.getUserData();
    const imgPreview = $("#imgPreviewUsuario");

    if (imgPreview.length > 0) {
      imgPreview.attr(
        "src",
        userData.imagem || "https://via.placeholder.com/120"
      );
      $("#inputNomeUsuario").val(userData.fullname || "");
      $("#modalImagemUsuario").modal("show");
    } else {
      console.error("Elemento de preview não encontrado");
    }
  });

  // Preview da imagem selecionada
  $(document).on("change", "#inputImagemUsuario", function () {
    const file = this.files && this.files[0];
    if (file) {
      console.log("Previsualizando imagem selecionada");
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#imgPreviewUsuario").attr("src", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Salvar alterações no perfil
  $(document).on("click", "#btnSalvarImagemUsuario", async function () {
    console.log("Salvando alterações no perfil");

    const fileInput = $("#inputImagemUsuario")[0];
    const novoNome = $("#inputNomeUsuario").val().trim();
    const userData = userProfileManager.getUserData();
    const userId = userData.id;

    if (!userId) {
      alert("Erro: ID de usuário não encontrado. Faça login novamente.");
      return;
    }

    const changes = {};

    // Adiciona o novo nome se foi alterado
    if (novoNome && novoNome !== userData.fullname) {
      changes.fullname = novoNome;
    }

    // Faz upload da nova imagem se foi selecionada
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      console.log("Enviando nova imagem de perfil");
      const novaImagemUrl = await userProfileManager.uploadProfileImage(
        fileInput.files[0]
      );
      if (novaImagemUrl) {
        changes.imagem = novaImagemUrl;
      } else {
        alert("Erro ao fazer upload da imagem");
        return;
      }
    }

    // Salva as alterações
    const result = await userProfileManager.saveProfileChanges(userId, changes);

    if (result.success) {
      userProfileManager.updateUserData(changes);
      await userProfileManager.updateProfileDisplay();
      $("#modalImagemUsuario").modal("hide");
      alert("Perfil atualizado com sucesso!");
    } else {
      alert(result.message || "Erro ao atualizar perfil");
    }
  });
}

/**
 * Expõe funções críticas globalmente
 */
window.userProfile = {
  logout: function () {
    localStorage.removeItem("userData");
    localStorage.removeItem("userDataInfo");
    window.location.href = "/";
  },
  updateDisplay: function () {
    userProfileManager.updateProfileDisplay();
  },
};

/**
 * Carrega o menu apropriado com base no tipo de usuário
 */
export const loadMenu = async (containerMenuId) => {
  console.log("Carregando menu...");
  let tipo;

  // Determina o tipo de menu com base no tipo de usuário
  const userData = parseInt(localStorage.getItem("userData"), 10);
  if (userData === 1) {
    tipo = "admin"; // Menu para administradores
    console.log("Carregando menu de administrador");
  } else if (userData === 2) {
    tipo = "logado"; // Menu para usuários logados
    console.log("Carregando menu de usuário logado");
  } else {
    tipo = "default"; // Menu para visitantes
    console.log("Carregando menu padrão (visitante)");
  }

  try {
    // Carrega o HTML do menu
    const response = await fetch(`/components/menu/menu-${tipo}.html`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o menu: ${response.statusText}`);
    }

    // Insere o menu no container
    const menu = await response.text();
    const container = document.getElementById(containerMenuId);
    if (!container) {
      throw new Error(`Elemento com ID "${containerMenuId}" não encontrado.`);
    }
    container.innerHTML = menu;
    console.log("Menu HTML inserido no DOM");

    // Carrega scripts associados e configura eventos
    loadJS(containerMenuId);
    setupProfileEventHandlers();

    // Aguarda um momento para garantir que os elementos estejam no DOM
    setTimeout(() => {
      userProfileManager.updateProfileDisplay();
    }, 100);
  } catch (error) {
    console.error("Erro ao carregar o menu:", error);
  }
};
