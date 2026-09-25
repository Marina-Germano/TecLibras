document.getElementById('btn-enviar-codigo').addEventListener('click', function() {
  const email = document.getElementById('cad-email').value;
  const perfil = document.getElementById('cad-perfil').value;
  const nascimento = document.getElementById('cad-nascimento').value;
  const senha = document.getElementById('cad-senha').value;
  const confirmaSenha = document.getElementById('cad-confirma-senha').value;

  if (!email || !perfil || !nascimento || !senha || !confirmaSenha) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  if (senha !== confirmaSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  // Se o perfil for Intérprete, cria uma notificação pendente para o Admin
  if (perfil === 'interprete') {
    let pendentes = JSON.parse(localStorage.getItem('teclibras_pendentes')) || [];
    
    // Evita solicitações duplicadas do mesmo e-mail
    if (!pendentes.some(p => p.email === email)) {
      pendentes.push({
        id: Date.now(),
        email: email,
        perfil: 'Intérprete',
        nascimento: nascimento,
        data: new Date().toLocaleDateString('pt-BR')
      });
      localStorage.setItem('teclibras_pendentes', JSON.stringify(pendentes));
    }
    
    alert(`Solicitação enviada! Como o perfil é Intérprete, aguarde a aprovação do Administrador.`);
  } else {
    alert(`Código de verificação enviado para ${email}! Verifique sua caixa de entrada.`);
  }

  window.location.href = 'login.html';
});