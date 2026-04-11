
function navegarPara(nomePagina) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const paginaAlvo = document.getElementById(`page-${nomePagina}`);
  if (paginaAlvo) paginaAlvo.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === nomePagina);
  });

  if (nomePagina === 'disciplinas') renderizarDisciplinas();
  if (nomePagina === 'agenda')      renderizarEventos();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navegarPara(btn.dataset.page));
});

function abrirModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'flex';
  const primeiroInput = modal.querySelector('input, select, textarea');
  if (primeiroInput) setTimeout(() => primeiroInput.focus(), 100);
}

function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'none';
}

document.querySelectorAll('[data-fecha]').forEach(btn => {
  btn.addEventListener('click', () => fecharModal(btn.dataset.fecha));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharModal(overlay.id);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      if (m.style.display !== 'none') fecharModal(m.id);
    });
  }
});


let toastTimeout = null;

function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.style.borderColor = tipo === 'erro' ? 'var(--red)' : 'var(--border-light)';
  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function init() {
  renderizarDisciplinas();
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('evento-data').setAttribute('min', hoje);
}

document.addEventListener('DOMContentLoaded', init);