document.addEventListener("DOMContentLoaded", () => {

  // 🛡️ SEGURANÇA E CONTROLE DE PERFIL (CHECA O LOGIN)
  const role = localStorage.getItem("teclibras_role");
  const username = localStorage.getItem("teclibras_user");

  // Se não houver login salvo, manda de volta para a tela de login
  if (!role) {
    window.location.href = "login.html";
    return;
  }

  // Elementos do cabeçalho para atualizar o perfil logado
  const usernameDisplay = document.getElementById("username-display");
  const loginFormContainer = document.getElementById("login-form-container");
  const loggedContainer = document.getElementById("logged-container");

  if (usernameDisplay) usernameDisplay.innerText = username;
  if (loginFormContainer) loginFormContainer.style.display = "none";
  if (loggedContainer) loggedContainer.style.display = "block";

  // Se for professor, ativa as ferramentas visuais de edição/exclusão/upload
  if (role === "professor") {
    document.body.classList.add("perfil-professor");
  } else {
    document.body.classList.remove("perfil-professor");
  }


  // 🔍 BUSCA EM TEMPO REAL (INSTANTÂNEA) COM BOTÃO LIMPAR
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");

  if (searchInput && clearSearchBtn) {
    const filtrarCards = (termo) => {
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => {
        const titulo = card.querySelector("h2") ? card.querySelector("h2").innerText.toLowerCase() : "";
        if (titulo.includes(termo)) {
          card.style.display = ""; 
        } else {
          card.style.display = "none"; 
        }
      });
    };

    searchInput.addEventListener("input", () => {
      const termo = searchInput.value.toLowerCase().trim();
      if (termo.length > 0) {
        clearSearchBtn.style.display = "block";
      } else {
        clearSearchBtn.style.display = "none";
      }
      filtrarCards(termo);
    });

    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchBtn.style.display = "none";
      filtrarCards("");
      searchInput.focus();
    });
  }

  // 📂 CATEGORIAS
  const btnCategorias = document.querySelector('[title="Categorias"]');
  if (btnCategorias) {
    btnCategorias.addEventListener("click", () => {
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => {
        card.style.display = "";
      });
      alert("Categorias: mostrando todos os conteúdos");
    });
  }

  // ⚙️ OPÇÕES
  const btnOpcoes = document.querySelector('[title="Opções"]');
  if (btnOpcoes) {
    btnOpcoes.addEventListener("click", () => {
      alert("Painel de opções (em breve você pode adicionar configurações aqui)");
    });
  }

  // 🌙 ALTERNAR MODO ESCURO
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        themeToggle.innerText = "☀️";
        themeToggle.setAttribute("aria-label", "Alternar modo claro");
      } else {
        themeToggle.innerText = "🌙";
        themeToggle.setAttribute("aria-label", "Alternar modo escuro");
      }
    });
  }

  // 👤 DROPDOWN DE USUÁRIO
  const userMenuBtn = document.getElementById("user-menu-btn");
  const userDropdown = document.getElementById("user-dropdown");
  const btnSair = document.getElementById("btn-sair");

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target) && e.target !== userMenuBtn) {
        userDropdown.classList.remove("show");
      }
    });
  }

  // 🚪 BOTÃO SAIR (LOGOUT COMPLETO)
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.clear(); // Limpa a memória de quem estava logado
      window.location.href = "login.html"; // Chuta de volta para a tela de login
    });
  }

  // ➕ MODAL NOVO SINAL
  const modal = document.getElementById("modal-upload");
  const btnUpload = document.querySelector(".tool-upload");
  const btnFecharModal = document.getElementById("fechar-modal");
  const btnSalvarSinal = document.getElementById("salvar-sinal");
  let cardEditando = null;

  if (btnUpload && modal) {
    btnUpload.addEventListener("click", () => {
      modal.style.display = "block";
      const dataInput = document.getElementById("data_publicacao");
      if (dataInput) {
        dataInput.value = new Date().toISOString().split("T")[0];
      }
    });
  }

  if (btnFecharModal && modal) {
    btnFecharModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (btnSalvarSinal) {
    btnSalvarSinal.addEventListener("click", () => {
      const termo = document.getElementById("termo_ti").value;
      const descricao = document.getElementById("descricao_sinal").value;
      const interprete = document.getElementById("id_interprete").value;
      const data = document.getElementById("data_publicacao").value;
      const tipo = document.getElementById("tipo_midia").value;
      const arquivoInput = document.getElementById("url_arquivo");
      const arquivo = arquivoInput ? arquivoInput.files[0] : null;
      const formato = document.getElementById("formato").value;

      if (!termo) {
        alert("Informe o Termo TI.");
        return;
      }

      if (cardEditando) {
        cardEditando.querySelector("h2").innerText = termo;
        const descricaoTag = cardEditando.querySelector(".translation p");
        if (descricaoTag) {
          descricaoTag.innerText = descricao;
        }
        cardEditando = null;
      } else {
        const container = document.querySelector(".container");
        if (container) {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <div class="acoes-card">
                <button class="btn-edit">✏️</button>
                <button class="btn-delete">🗑️</button>
            </div>
            <h2>${termo}</h2>
            <div class="translation">
                <p>${descricao}</p>
            </div>
            <p><b>Intérprete:</b> ${interprete}</p>
            <p><b>Data:</b> ${data}</p>
            <p><b>Tipo:</b> ${tipo}</p>
            <p><b>Formato:</b> ${formato}</p>
            <p>Arquivo: ${arquivo ? arquivo.name : 'Nenhum'}</p>
          `;
          container.appendChild(card);
        }
      }

      modal.style.display = "none";
      document.querySelectorAll("#modal-upload input, #modal-upload textarea").forEach(campo => campo.value = "");
    });
  }

  // ✏️ EVENTO EDITAR
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-edit")) return;

    const card = e.target.closest(".card");
    cardEditando = card;

    const titulo = card.querySelector("h2")?.innerText || "";
    const descricao = card.querySelector(".translation p")?.innerText || "";

    const termoInput = document.getElementById("termo_ti");
    const descInput = document.getElementById("descricao_sinal");

    if (termoInput) termoInput.value = titulo;
    if (descInput) descInput.value = descricao;

    if (modal) modal.style.display = "block";
  });

  // 🗑️ EVENTO EXCLUIR
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-delete")) return;

    const confirmar = confirm("Deseja realmente excluir este sinal?");
    if (!confirmar) return;

    const card = e.target.closest(".card");
    if (card) card.remove();
  });


  // 📸 LÓGICA PARA IMAGENS EM TELA CHEIA (LIGHTBOX INSERIDA AQUI)
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    // Escuta cliques no site todo, mas só ativa se clicar em uma tag IMG dentro de um .card
    document.addEventListener("click", (e) => {
      if (e.target.closest(".card") && e.target.tagName === "IMG") {
        lightbox.style.display = "flex"; // Abre a estrutura com flexbox
        lightboxImg.src = e.target.src;   // Copia o link da foto pro modal
      }
    });

    // Fecha ao clicar no botão X
    if (lightboxClose) {
      lightboxClose.addEventListener("click", () => {
        lightbox.style.display = "none";
      });
    }

    // Fecha ao clicar fora da foto (na região escura do fundo)
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
      }
    });
  }
  
// Fecha modais com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {

    if (modal && modal.style.display === "block") {
      modal.style.display = "none";
    }

    if (lightbox && lightbox.style.display === "flex") {
      lightbox.style.display = "none";
    }

    if (userDropdown) {
      userDropdown.classList.remove("show");
    }
  }
});

});
