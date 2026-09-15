const apiUrl = 'http://localhost:5079/api/sinais'; 

document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("teclibras_role");
  const username = localStorage.getItem("teclibras_user");

  if (!role) {
    window.location.href = "login.html";
    return;
  }

  const usernameDisplay = document.getElementById("username-display");
  const loginFormContainer = document.getElementById("login-form-container");
  const loggedContainer = document.getElementById("logged-container");

  if (usernameDisplay) usernameDisplay.innerText = username;
  if (loginFormContainer) loginFormContainer.style.display = "none";
  if (loggedContainer) loggedContainer.style.display = "block";

  if (role === "professor") {
    document.body.classList.add("perfil-professor");
  } else {
    document.body.classList.remove("perfil-professor");
  }

  carregarSinais();

  async function carregarSinais() {
    const container = document.getElementById('sinais-container');
    if (!container) return;

    try {
      const resposta = await fetch(apiUrl);
      if (!resposta.ok) throw new Error("Erro de conexão");
      
      const sinais = await resposta.json();
      container.innerHTML = ''; 
      
      if (sinais.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum sinal cadastrado ainda.</p>';
        return;
      }

      sinais.forEach(sinal => {
        // let urlImg1 = sinal.imagem.url.startsWith("http") ? sinal.imagem.url : `http://localhost:5079/${sinal.imagem.url}`;
        // let imagensHtml = `<img src="${urlImg1}" alt="${sinal.termoTi} - Principal">`;
        
        // if (sinal.imagemSecundaria && sinal.imagemSecundaria.url) {
        //   let urlImg2 = sinal.imagemSecundaria.url.startsWith("http") ? sinal.imagemSecundaria.url : `http://localhost:5079/${sinal.imagemSecundaria.url}`;
        //   imagensHtml += `<img src="${urlImg2}" alt="${sinal.termoTi} - Secundária">`;
        // }
        let imagensHtml = '';

        // Verifica e monta a Imagem Principal com segurança
        if (sinal.imagem) {
          let urlOriginal1 = sinal.imagem.url || (typeof sinal.imagem === 'string' ? sinal.imagem : null);
          if (urlOriginal1) {
            let urlImg1 = urlOriginal1.startsWith("http") ? urlOriginal1 : `http://localhost:5079/${urlOriginal1}`;
            imagensHtml += `<img src="${urlImg1}" alt="${sinal.termoTi} - Principal">`;
          }
        }

        // Verifica e monta a Imagem Secundária com segurança
        if (sinal.imagemSecundaria) {
          // Pega a URL caso seja um objeto (.url) ou caso seja uma string direta
          let urlOriginal2 = sinal.imagemSecundaria.url || (typeof sinal.imagemSecundaria === 'string' ? sinal.imagemSecundaria : null);
          
          if (urlOriginal2) {
            let urlImg2 = urlOriginal2.startsWith("http") ? urlOriginal2 : `http://localhost:5079/${urlOriginal2}`;
            imagensHtml += `<img src="${urlImg2}" alt="${sinal.termoTi} - Secundária" style="margin-left: 10px;">`; // Margem para evitar que fiquem coladas/sobrepostas
          }
        }

        let videoHtml = `<iframe src="${sinal.video.url}" width="100%" height="200" frameborder="0" allowfullscreen></iframe>`;

        const card = document.createElement("div");
        card.className = "card";
        card.dataset.id = sinal.id;
        card.innerHTML = `
          <div class="acoes-card">
            <button class="btn-edit" title="Editar">✏️</button>
            <button class="btn-delete" title="Excluir">🗑️</button>
          </div>
          <h2>${sinal.termoTi}</h2>
          <div class="translation">
            ${imagensHtml}
          </div>
          ${videoHtml}
          <p>${sinal.descricaoSinal || `Sinal em Libras para "${sinal.termoTi}"`}</p>
          ${sinal.nomeInterprete ? `<p><small>Intérprete: ${sinal.nomeInterprete}</small></p>` : ''}
        `;
        container.appendChild(card);
      });
    } catch (erro) {
      console.error(erro);
      container.innerHTML = '<p style="text-align: center; width: 100%; color: red;">Erro ao conectar com o servidor.</p>';
    }
  }

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

  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.clear(); 
      window.location.href = "login.html"; 
    });
  }

  const modal = document.getElementById("modal-upload");
  const btnUpload = document.querySelector(".tool-upload");
  const btnFecharModal = document.getElementById("fechar-modal");
  const btnSalvarSinal = document.getElementById("salvar-sinal");
  let sinalEditandoId = null;

  if (btnUpload && modal) {
    btnUpload.addEventListener("click", () => {
      sinalEditandoId = null;
      document.querySelectorAll("#modal-upload input, #modal-upload textarea").forEach(campo => {
        campo.value = "";
      });
      modal.style.display = "block";
    });
  }

  if (btnFecharModal && modal) {
    btnFecharModal.addEventListener("click", () => modal.style.display = "none");
  }

  if (btnSalvarSinal) {
    btnSalvarSinal.addEventListener("click", async () => {
      const termo = document.getElementById("termo_ti").value;
      const descricao = document.getElementById("descricao_sinal").value;
      const interprete = document.getElementById("id_interprete").value;
      const videoUrl = document.getElementById("video_url").value;
      const imagemInput = document.getElementById("imagem_arquivo");
      const imagemSecInput = document.getElementById("imagem_secundaria_arquivo");

      if (!termo || !videoUrl) {
        alert("O termo e o link do vídeo são obrigatórios!");
        return;
      }

      const formData = new FormData();
      formData.append("TermoTi", termo);
      formData.append("DescricaoSinal", descricao || "");
      formData.append("IdInterprete", interprete || "0");
      formData.append("VideoUrl", videoUrl);

      if (imagemInput.files[0]) {
        formData.append("ImagemArquivo", imagemInput.files[0]);
      }
      if (imagemSecInput.files[0]) {
        formData.append("ImagemSecundaria", imagemSecInput.files[0]);
      }

      try {
        let url = apiUrl;
        let metodo = "POST";

        if (sinalEditandoId) {
          url = `${apiUrl}/${sinalEditandoId}`;
          metodo = "PUT";
        }

        const resposta = await fetch(url, {
          method: metodo,
          body: formData
        });

        if (!resposta.ok) {
          const erroJson = await resposta.json();
          throw new Error(erroJson.mensagem || "Erro ao salvar sinal");
        }

        modal.style.display = "none";
        carregarSinais();
      } catch (erro) {
        console.error(erro);
        alert("Falha ao salvar no banco de dados.");
      }
    });
  }

  document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("btn-edit")) return;

    const card = e.target.closest(".card");
    const id = card.dataset.id;
    sinalEditandoId = id;

    try {
      const resposta = await fetch(`${apiUrl}/${id}`);
      if (!resposta.ok) throw new Error("Erro ao buscar dados");
      const sinal = await resposta.json();

      document.getElementById("termo_ti").value = sinal.termoTi;
      document.getElementById("descricao_sinal").value = sinal.descricaoSinal || '';
      document.getElementById("id_interprete").value = sinal.idInterprete || '';
      document.getElementById("video_url").value = sinal.video.url.replace("embed/", "watch?v=");

      modal.style.display = "block";
    } catch (erro) {
      console.error(erro);
      alert("Erro ao buscar dados para edição.");
    }
  });

  document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("btn-delete")) return;

    const confirmar = confirm("Deseja realmente excluir este sinal?");
    if (!confirmar) return;

    const card = e.target.closest(".card");
    const id = card.dataset.id;

    try {
      const resposta = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!resposta.ok) throw new Error("Erro ao excluir");
      card.remove();
    } catch (erro) {
      console.error(erro);
      alert("Falha ao excluir o sinal no banco.");
    }
  });

  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".card") && e.target.tagName === "IMG") {
        lightbox.style.display = "flex"; 
        lightboxImg.src = e.target.src;  
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", () => lightbox.style.display = "none");
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.style.display = "none";
    });
  }
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && modal.style.display === "block") modal.style.display = "none";
      if (lightbox && lightbox.style.display === "flex") lightbox.style.display = "none";
      if (userDropdown) userDropdown.classList.remove("show");
    }
  });

});