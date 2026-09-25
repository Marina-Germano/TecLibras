const apiUrl = 'http://localhost:5079/api/sinais'; 
const apiUsuariosUrl = 'http://localhost:5079/api/usuarios';

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
    atualizarNotificacoesAdmin();
  } else {
    document.body.classList.remove("perfil-professor");
  }

  carregarSinais();

  // ===================================================
  // LÓGICA DE NOTIFICAÇÕES E GESTÃO DE INTÉRPRETES
  // ===================================================
  function atualizarNotificacoesAdmin() {
    const pendentes = JSON.parse(localStorage.getItem('teclibras_pendentes')) || [];
    const badge = document.getElementById('notif-badge');
    
    if (badge) {
      if (pendentes.length > 0) {
        badge.innerText = pendentes.length;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    }
  }

  function renderizarListaPendentes() {
    const container = document.getElementById('lista-pendentes-container');
    if (!container) return;

    const pendentes = JSON.parse(localStorage.getItem('teclibras_pendentes')) || [];

    if (pendentes.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #777;">Nenhuma solicitação pendente no momento.</p>';
      return;
    }

    container.innerHTML = pendentes.map(item => `
      <div class="item-pendente" data-id="${item.id}">
        <div class="item-pendente-info">
          <strong>${item.email}</strong>
          <small>Perfil solicitado: ${item.perfil} | Data: ${item.data}</small>
        </div>
        <div class="item-pendente-acoes">
          <button class="btn-aceitar-user" onclick="aceitarUsuario(${item.id})">✓ Aceitar</button>
          <button class="btn-rejeitar-user" onclick="rejeitarUsuario(${item.id})">✕ Rejeitar</button>
        </div>
      </div>
    `).join('');
  }

  window.aceitarUsuario = function(id) {
    let pendentes = JSON.parse(localStorage.getItem('teclibras_pendentes')) || [];
    const usuario = pendentes.find(p => p.id === id);
    
    pendentes = pendentes.filter(p => p.id !== id);
    localStorage.setItem('teclibras_pendentes', JSON.stringify(pendentes));
    
    atualizarNotificacoesAdmin();
    renderizarListaPendentes();
    alert(`Solicitação de ${usuario ? usuario.email : 'usuário'} aceita com sucesso!`);
  };

  window.rejeitarUsuario = function(id) {
    let pendentes = JSON.parse(localStorage.getItem('teclibras_pendentes')) || [];
    pendentes = pendentes.filter(p => p.id !== id);
    localStorage.setItem('teclibras_pendentes', JSON.stringify(pendentes));
    
    atualizarNotificacoesAdmin();
    renderizarListaPendentes();
    alert("Solicitação rejeitada.");
  };

  // ===================================================
  // BUSCA E RENDERIZAÇÃO DA TABELA DE USUÁRIOS
  // ===================================================
  async function carregarUsuarios() {
    const tabelaCorpo = document.getElementById('tabela-usuarios-corpo');
    if (!tabelaCorpo) return;

    try {
      const resposta = await fetch(apiUsuariosUrl);
      if (!resposta.ok) throw new Error("Erro ao conectar na rota de usuários");
      
      const usuarios = await resposta.json();
      tabelaCorpo.innerHTML = '';

      if (usuarios.length === 0) {
        tabelaCorpo.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 15px;">Nenhum usuário cadastrado encontrado.</td></tr>';
        return;
      }

      usuarios.forEach(user => {
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid #eee";
        tr.innerHTML = `
          <td style="padding: 10px;">${user.id_usuario || user.id || '-'}</td>
          <td style="padding: 10px;">${user.email || user.nome}</td>
          <td style="padding: 10px;"><strong>${user.perfil || 'USUARIO'}</strong></td>
          <td style="padding: 10px;">${user.data_criacao ? new Date(user.data_criacao).toLocaleDateString('pt-BR') : 'Recente'}</td>
        `;
        tabelaCorpo.appendChild(tr);
      });
    } catch (erro) {
      console.error(erro);
      // Fallback enquanto a API do backend não está pronta
      tabelaCorpo.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: #777; padding: 15px;">
            Aguardando integração com o backend (<code>${apiUsuariosUrl}</code>)
          </td>
        </tr>
      `;
    }
  }

  // EVENTO DE BUSCA EM TEMPO REAL DE USUÁRIOS
  const searchUsuarioInput = document.getElementById("search-usuario-input");
  if (searchUsuarioInput) {
    searchUsuarioInput.addEventListener("input", () => {
      const termo = searchUsuarioInput.value.toLowerCase().trim();
      const linhas = document.querySelectorAll("#tabela-usuarios-corpo tr");

      linhas.forEach(linha => {
        const textoLinha = linha.innerText.toLowerCase();
        if (textoLinha.includes(termo)) {
          linha.style.display = "";
        } else {
          linha.style.display = "none";
        }
      });
    });
  }

  // ===================================================
  // ABAS DO MODAL DE GERENCIAMENTO
  // ===================================================
  const tabPendentes = document.getElementById("tab-pendentes");
  const tabTodosUsuarios = document.getElementById("tab-todos-usuarios");
  const secPendentes = document.getElementById("sec-pendentes");
  const secTodosUsuarios = document.getElementById("sec-todos-usuarios");

  if (tabPendentes && tabTodosUsuarios) {
    tabPendentes.addEventListener("click", () => {
      tabPendentes.style.background = "#1a73e8";
      tabPendentes.style.color = "white";
      tabTodosUsuarios.style.background = "#e0e0e0";
      tabTodosUsuarios.style.color = "#333";

      secPendentes.style.display = "block";
      secTodosUsuarios.style.display = "none";
    });

    tabTodosUsuarios.addEventListener("click", () => {
      tabTodosUsuarios.style.background = "#1a73e8";
      tabTodosUsuarios.style.color = "white";
      tabPendentes.style.background = "#e0e0e0";
      tabPendentes.style.color = "#333";

      secPendentes.style.display = "none";
      secTodosUsuarios.style.display = "block";

      // Reseta o campo de busca e recarrega os usuários
      if (searchUsuarioInput) searchUsuarioInput.value = "";
      carregarUsuarios();
    });
  }

  // Eventos para abrir o modal de gestão pelo Sino ou Engrenagem
  const btnBell = document.getElementById('notif-bell-btn');
  const btnGear = document.getElementById('btn-gestao-gear');
  const modalGestao = document.getElementById('modal-gestao-usuarios');
  const btnFecharGestao = document.getElementById('fechar-modal-gestao');

  const abrirModalGestao = () => {
    renderizarListaPendentes();
    if (modalGestao) modalGestao.style.display = 'block';
  };

  if (btnBell) btnBell.addEventListener('click', abrirModalGestao);
  if (btnGear) btnGear.addEventListener('click', abrirModalGestao);
  if (btnFecharGestao) btnFecharGestao.addEventListener('click', () => modalGestao.style.display = 'none');

  // ===================================================
  // CARREGAR SINAIS E OUTRAS FUNÇÕES ORIGINAIS
  // ===================================================
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
        let imagensHtml = '';

        if (sinal.imagem) {
          let urlOriginal1 = sinal.imagem.url || (typeof sinal.imagem === 'string' ? sinal.imagem : null);
          if (urlOriginal1) {
            let urlImg1 = urlOriginal1.startsWith("http") ? urlOriginal1 : `http://localhost:5079/${urlOriginal1}`;
            imagensHtml += `<img src="${urlImg1}" alt="${sinal.termoTi} - Principal">`;
          }
        }

        if (sinal.imagemSecundaria) {
          let urlOriginal2 = sinal.imagemSecundaria.url || (typeof sinal.imagemSecundaria === 'string' ? sinal.imagemSecundaria : null);
          if (urlOriginal2) {
            let urlImg2 = urlOriginal2.startsWith("http") ? urlOriginal2 : `http://localhost:5079/${urlOriginal2}`;
            imagensHtml += `<img src="${urlImg2}" alt="${sinal.termoTi} - Secundária" style="margin-left: 10px;">`;
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
      if (modalGestao && modalGestao.style.display === "block") modalGestao.style.display = "none";
      if (lightbox && lightbox.style.display === "flex") lightbox.style.display = "none";
      if (userDropdown) userDropdown.classList.remove("show");
    }
  });

});