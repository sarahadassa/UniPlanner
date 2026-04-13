function navegarPara(pagina) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pagina).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pagina);
  });

  if (pagina === 'disciplinas') renderizarDisciplinas();
  if (pagina === 'agenda') renderizarEventos();
}

// Abre um modal
function abrirModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'flex';
  const input = modal.querySelector('input, select, textarea');
  if (input) setTimeout(() => input.focus(), 100);
}

// Fecha um modal
function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Mostra uma mensagem rápida na tela (toast)
let toastTimeout;
function mostrarToast(mensagem, tipo = 'ok') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.style.borderColor = tipo === 'erro' ? 'var(--red)' : 'var(--border-light)';
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Clique nos botões do menu lateral
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navegarPara(btn.dataset.page));
});

// Botões de fechar modal (atributo data-fecha)
document.querySelectorAll('[data-fecha]').forEach(btn => {
  btn.addEventListener('click', () => fecharModal(btn.dataset.fecha));
});

// Fecha modal ao clicar fora dele
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharModal(overlay.id);
  });
});

// Fecha modal com a tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      if (m.style.display !== 'none') fecharModal(m.id);
    });
  }
});

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
  renderizarDisciplinas();
  document.getElementById('evento-data').min = new Date().toISOString().split('T')[0];
});