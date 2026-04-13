const listaEventosEl      = document.getElementById('lista-eventos');
const emptyEventosEl      = document.getElementById('empty-eventos');
const btnAbrirModalEvento = document.getElementById('btn-abrir-modal-evento');
const btnSalvarEvento     = document.getElementById('btn-salvar-evento');
const eventoTituloInput   = document.getElementById('evento-titulo');
const eventoTipoSelect    = document.getElementById('evento-tipo');
const eventoDataInput     = document.getElementById('evento-data');
const eventoDiscSelect    = document.getElementById('evento-disciplina');
const eventoObsInput      = document.getElementById('evento-obs');
const filtrosBtns         = document.querySelectorAll('.filtro-btn');

let filtroAtivo = 'todos';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const TIPOS  = { prova: 'Prova', trabalho: 'Trabalho', entrega: 'Entrega', outro: 'Outro' };

// Calcula quantos dias faltam até uma data
function diasRestantes(dataStr) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataStr + 'T00:00:00');
  return Math.round((alvo - hoje) / (1000 * 60 * 60 * 24));
}

// Retorna o texto e a classe de cor para os dias restantes
function labelDias(dias) {
  if (dias < 0)   return { texto: 'Passou',         classe: 'passou' };
  if (dias === 0) return { texto: 'Hoje!',           classe: 'urgente' };
  if (dias === 1) return { texto: 'Amanhã!',         classe: 'urgente' };
  if (dias <= 7)  return { texto: `Em ${dias} dias`, classe: 'proximo' };
  return { texto: `Em ${dias} dias`, classe: '' };
}

// Mostra os eventos na tela
function renderizarEventos() {
  const todos = Storage.getEventos();
  todos.sort((a, b) => new Date(a.data) - new Date(b.data));

  const lista = filtroAtivo === 'todos' ? todos : todos.filter(e => e.tipo === filtroAtivo);

  listaEventosEl.innerHTML = '';

  if (lista.length === 0) {
    emptyEventosEl.style.display = 'block';
    return;
  }

  emptyEventosEl.style.display = 'none';

  lista.forEach(evento => {
    const data = new Date(evento.data + 'T00:00:00');
    const dias = diasRestantes(evento.data);
    const label = labelDias(dias);

    let nomeDisciplina = '';
    if (evento.disciplinaId) {
      const disc = Storage.getDisciplinaById(evento.disciplinaId);
      if (disc) nomeDisciplina = disc.nome;
    }

    const item = document.createElement('article');
    item.className = `evento-item${dias < 0 ? ' evento-passado' : ''}`;
    item.dataset.tipo = evento.tipo;
    item.innerHTML = `
      <div class="evento-data-box">
        <span class="evento-data-dia">${data.getDate().toString().padStart(2, '0')}</span>
        <span class="evento-data-mes">${MESES[data.getMonth()]}</span>
      </div>
      <div class="evento-info">
        <p class="evento-titulo-text">${evento.titulo}</p>
        <div class="evento-meta">
          <span class="evento-tipo-badge tipo--${evento.tipo}">${TIPOS[evento.tipo]}</span>
          ${nomeDisciplina ? `<span>${nomeDisciplina}</span>` : ''}
          ${evento.obs ? `<span>${evento.obs}</span>` : ''}
        </div>
      </div>
      <span class="evento-dias-restantes ${label.classe}">${label.texto}</span>
      <button class="evento-excluir" data-id="${evento.id}">✕</button>
    `;
    listaEventosEl.appendChild(item);
  });

  listaEventosEl.querySelectorAll('.evento-excluir').forEach(btn => {
    btn.addEventListener('click', (e) => excluirEvento(e.currentTarget.dataset.id));
  });
}

// Preenche o select de disciplinas no modal de evento
function atualizarSelectDisciplinas() {
  eventoDiscSelect.innerHTML = '<option value="">– Nenhuma –</option>';
  Storage.getDisciplinas().forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.nome;
    eventoDiscSelect.appendChild(opt);
  });
}

// Salva um novo evento
function salvarEvento() {
  const titulo = eventoTituloInput.value.trim();
  const data   = eventoDataInput.value;

  if (!titulo || !data) {
    mostrarToast('Preencha o título e a data.', 'erro');
    return;
  }

  Storage.addEvento({
    id:           Storage.gerarId(),
    titulo,
    tipo:         eventoTipoSelect.value,
    data,
    disciplinaId: eventoDiscSelect.value || null,
    obs:          eventoObsInput.value.trim()
  });

  fecharModal('modal-evento');
  renderizarEventos();
  mostrarToast(`Evento "${titulo}" adicionado!`);
}

// Remove um evento
function excluirEvento(id) {
  Storage.removeEvento(id);
  renderizarEventos();
  mostrarToast('Evento removido.');
}

// Eventos dos botões e filtros
btnAbrirModalEvento.addEventListener('click', () => {
  eventoTituloInput.value = '';
  eventoTipoSelect.value  = 'prova';
  eventoDataInput.value   = '';
  eventoObsInput.value    = '';
  atualizarSelectDisciplinas();
  abrirModal('modal-evento');
});

btnSalvarEvento.addEventListener('click', salvarEvento);

filtrosBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtrosBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroAtivo = btn.dataset.filtro;
    renderizarEventos();
  });
});