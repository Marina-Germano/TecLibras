document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar-login");
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");

  // 🔐 FUNÇÃO PRINCIPAL DE LOGIN
  // Isolamos a lógica aqui para poder chamá-la de dois jeitos diferentes
  const realizarLogin = () => {
    const usuario = userInput.value.trim();
    const senha = passInput.value;

    if (usuario === "admin" && senha === "admin") {
      localStorage.setItem("teclibras_role", "professor");
      localStorage.setItem("teclibras_user", "Professor Admin");
      window.location.href = "index.html";
    } else if (usuario === "aluno" && senha === "aluno") {
      localStorage.setItem("teclibras_role", "aluno");
      localStorage.setItem("teclibras_user", "Aluno");
      window.location.href = "index.html";
    } else {
      alert("Usuário ou senha incorretos! Use 'admin' ou 'aluno'.");
    }
  };

  // 🖱️ 1º JEITO: Ouvinte para o clique no botão "Entrar"
  if (btnEntrar) {
    btnEntrar.addEventListener("click", realizarLogin);
  }

  // ⌨️ 2º JEITO: Ouvinte para a tecla "Enter" dentro dos campos de texto
  const checarTeclaEnter = (evento) => {
    if (evento.key === "Enter") {
      realizarLogin();
    }
  };

  // Ativa a escuta do "Enter" tanto no campo de usuário quanto no de senha
  if (userInput) userInput.addEventListener("keydown", checarTeclaEnter);
  if (passInput) passInput.addEventListener("keydown", checarTeclaEnter);

  // ==========================================
  // INTEGRAÇÃO COM GOOGLE SIGN-IN
  // ==========================================

  function handleGoogleLogin(response) {
      const token = response.credential;
      const payload = decodeJwtResponse(token);
      
      console.log("Dados do usuário logado pelo Google:", payload);
      
      localStorage.setItem("teclibras_user", payload.name);
      localStorage.setItem("teclibras_email", payload.email);
      
      // Define o papel do usuário (pode ser ajustado futuramente)
      localStorage.setItem("teclibras_role", "aluno"); 
      
      // Redireciona para a página principal
      window.location.href = "index.html"; 
  }

  function decodeJwtResponse(token) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
  }

  // ⚠️ ESSA LINHA É O SEGREDO: 
  // Ela garante que o HTML consiga enxergar a função, mesmo que este arquivo 
  // seja carregado como módulo ou esteja protegido dentro de um escopo.
  window.handleGoogleLogin = handleGoogleLogin;

});