$(document).ready(() => {
  //**Função para enviar as imagens para o servidor
  const uploadImagens = async (imagens) => {
    try {
      let formdata = new FormData();
      formdata.append("file", imagens);

      let requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      // Adicionando o parâmetro tipo=veiculos para indicar onde salvar
      const response = await fetch(
        "http://localhost:3037/upload?tipo=veiculos",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      throw error; // Propaga o erro para quem chamar a função poder tratar também
    }
  };

  //função para
  //**Adiciona o evento de change(selecionar uma o mais imagens) ao elemento de imagem
  $("#imagem").on("change", function (e) {
    const files = e.target.files; // Pega os arquivos selecionados
    const imagensVeiculos = $("#imagensVeiculos");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadImagens(file)
        .then((result) => {
          const imgElement = $("<img>")
            .attr("src", result.url) // Supondo que a resposta contenha a URL da imagem
            .addClass("img-thumbnail")
            .addClass("listaDeFotosVeiculos")
            .css({ width: "180px", margin: "5px" });
          imagensVeiculos.prepend(imgElement);
        })
        .catch((error) => {
          console.error("Erro no upload:", error);
        });
    }
  });

  //**Função para gerar os anos de modelo para o select
  const loadAnoModelo = () => {
    const currentYear = new Date().getFullYear();
    let ano_modelo = [];
    for (let year = currentYear; year >= 1920; year--) {
      ano_modelo.push(
        `<option value="${year} - ${year}">${year} - ${year}</option>`
      );
      ano_modelo.push(
        `<option value="${year} - ${year + 1}">${year} - ${year + 1}</option>`
      );
    }
    return ano_modelo;
  };
  // Adiciona os anos de modelo gerados ao select
  $("#ano").empty(); // Limpa o select antes de adicionar os novos anos
  $("#ano").append(loadAnoModelo());

  // Função para limpar o formulário
  const limparFormulario = () => {
    $("#formVeiculo")[0].reset(); // Reseta todos os campos do formulário
    $(".listaDeFotosVeiculos").remove(); // Remove as imagens carregadas
  };

  // Função para exibir o alerta
  const exibirAlerta = (mensagem, tipo) => {
    const alerta = $("#alerta");
    alerta
      .removeClass("d-none alert-success alert-danger alert-warning") // Remove classes antigas
      .addClass(`alert-${tipo}`) // Adiciona a classe do tipo (success, danger ou warning)
      .find("strong")
      .text(mensagem); // Define a mensagem no elemento <strong>
  };

  // Atualize o evento de envio do formulário
  $("#formVeiculo").on("submit", function (e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    let fotosSelecionadas = [];

    // Pega todas as imagens selecionadas
    $(".listaDeFotosVeiculos").each(function () {
      fotosSelecionadas.push($(this).attr("src"));
    });

    // Pega todos os dados manualmente
    const veiculo = {
      modelo: $("#modelo").val(),
      ano: parseInt($("#ano").val()),
      preco: parseFloat($("#preco").val()),
      descricao: $("#descricao").val(),
      cor: $("#cor").val(),
      quilometragem: parseInt($("#quilometragem").val()),
      potencia: parseInt($("#potencia").val()),
      motor: $("#motor").val(),
      cambio: $("#cambio").val(),
      direcao: $("#direcao").val(),
      tracao: $("#tracao").val(),
      categoriaId: parseInt($("#categoriaId").val()),
      montadoraId: parseInt($("#montadoraId").val()),
      avaliacao: parseFloat($("#avaliacao").val()),
      destaque: $("#destaque").is(":checked"),
      disponivel: $("#disponivel").is(":checked"),
      imagem: fotosSelecionadas, // Adiciona as imagens selecionadas
    };

    // Enviando os dados para a API de back-end

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let dados = JSON.stringify(veiculo);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: dados,
      redirect: "follow",
    };

    fetch("http://localhost:3000/veiculo", requestOptions)
      .then((response) => {
        if (response.ok) {
          exibirAlerta("Veículo cadastrado com sucesso!", "success");
          limparFormulario();
        } else {
          throw new Error("Erro ao cadastrar o veículo.");
        }
        return response.json();
      })
      .then((result) => console.log(result))
      .catch((error) => {
        console.error("error", error);
        exibirAlerta("Erro ao cadastrar o veículo.", "danger");
      });
  });

  $(document).ready(() => {
    // Inicializa o SortableJS no contêiner de imagens
    const imagensVeiculos = document.getElementById("imagensVeiculos");
    Sortable.create(imagensVeiculos, {
      animation: 150, // Animação ao arrastar
      ghostClass: "sortable-ghost", // Classe para o item arrastado
      onEnd: function (evt) {
        console.log("Nova ordem:", getImagensOrdenadas());
      },
    });

    // Função para obter a nova ordem das imagens
    const getImagensOrdenadas = () => {
      const imagens = [];
      $("#imagensVeiculos img").each(function () {
        imagens.push($(this).attr("src"));
      });
      return imagens;
    };
  });

  $(document).ready(() => {
    // Função para carregar categorias no combo box
    const carregarCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3000/categoria");
        if (!response.ok) {
          throw new Error(
            `Erro ao carregar categorias: ${response.statusText}`
          );
        }
        const categorias = await response.json();
        const categoriaSelect = $("#categoriaId");
        categoriaSelect.empty(); // Limpa o select
        categoriaSelect.append(
          '<option value="">Selecione uma categoria</option>'
        ); // Opção padrão
        categorias.forEach((categoria) => {
          categoriaSelect.append(
            `<option value="${categoria.id}">${categoria.nome}</option>`
          );
        });
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    // Função para carregar montadoras no combo box
    const carregarMontadoras = async () => {
      try {
        const response = await fetch("http://localhost:3000/montadora");
        if (!response.ok) {
          throw new Error(
            `Erro ao carregar montadoras: ${response.statusText}`
          );
        }
        const montadoras = await response.json();
        const montadoraSelect = $("#montadoraId");
        montadoraSelect.empty(); // Limpa o select
        montadoraSelect.append(
          '<option value="">Selecione uma montadora</option>'
        ); // Opção padrão
        montadoras.forEach((montadora) => {
          montadoraSelect.append(
            `<option value="${montadora.id}">${montadora.nome}</option>`
          );
        });
      } catch (error) {
        console.error("Erro ao carregar montadoras:", error);
      }
    };

    // Chama as funções ao carregar a página
    carregarCategorias();
    carregarMontadoras();
  });
});
