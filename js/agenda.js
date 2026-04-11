
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


const MESES_ABREV = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const TIPOS_LABEL = { prova: 'Prova', trabalho: 'Trabalho', entrega: 'Entrega', outro: 'Outro' };

function diasRestantes(dataStr) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataStr + 'T00:00:00');
  return Math.round((alvo - hoje) / (1000 * 60 * 60 * 24));
}

function labelDias(dias) {
  if (dias < 0)   return { texto: 'Passou',          classe: 'passou' };
  if (dias === 0) return { texto: 'Hoje!',            classe: 'urgente' };
  if (dias === 1) return { texto: 'Amanhã!',          classe: 'urgente' };
  if (dias <= 7)  return { texto: `Em ${dias} dias`,  classe: 'proximo' };
  return { texto: `Em ${dias} dias`, classe: '' };
}


function renderizarEventos() {
  const todos = Storage.getEventos();
  todos.sort((a, b) => new Date(a.data) - new Date(b.data));

  const filtrados = filtroAtivo === 'todos'
    ? todos
    : todos.filter(e => e.tipo === filtroAtivo);

  listaEventosEl.innerHTML = '';

  if (filtrados.length === 0) {
    emptyEventosEl.style.display = 'block';
    return;
  }

  emptyEventosEl.style.display = 'none';

  filtrados.forEach(evento => {
    const dataObj = new Date(evento.data + 'T00:00:00');
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = MESES_ABREV[dataObj.getMonth()];
    const dias = diasRestantes(evento.data);
    const labelD = labelDias(dias);

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
        <span class="evento-data-dia">${dia}</span>
        <span class="evento-data-mes">${mes}</span>
      </div>
      <div class="evento-info">
        <p class="evento-titulo-text">${evento.titulo}</p>
        <div class="evento-meta">
          <span class="evento-tipo-badge tipo--${evento.tipo}">${TIPOS_LABEL[evento.tipo] || evento.tipo}</span>
          ${nomeDisciplina ? `<span>${nomeDisciplina}</span>` : ''}
          ${evento.obs ? `<span>${evento.obs}</span>` : ''}
        </div>
      </div>
      <span class="evento-dias-restantes ${labelD.classe}">${labelD.texto}</span>
      <button class="evento-excluir" data-id="${evento.id}" aria-label="Excluir evento ${evento.titulo}">✕</button>
    `;

    listaEventosEl.appendChild(item);
  });

  listaEventosEl.querySelectorAll('.evento-excluir').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      excluirEvento(e.currentTarget.dataset.id);
    });
  });
}

function atualizarSelectDisciplinas() {
  const disciplinas = Storage.getDisciplinas();
  eventoDiscSelect.innerHTML = '<option value="">– Nenhuma –</option>';
  disciplinas.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.nome;
    eventoDiscSelect.appendChild(opt);
  });
}


function salvarEvento() {
  const titulo = eventoTituloInput.value.trim();
  const tipo   = eventoTipoSelect.value;
  const data   = eventoDataInput.value;

  if (!titulo || !data) { mostrarToast('Preencha o título e a data do evento.', 'erro'); return; }

  Storage.addEvento({
    id:           Storage.gerarId(),
    titulo,
    tipo,
    data,
    disciplinaId: eventoDiscSelect.value || null,
    obs:          eventoObsInput.value.trim()
  });

  fecharModal('modal-evento');
  renderizarEventos();
  mostrarToast(`Evento "${titulo}" adicionado!`);
}

function excluirEvento(id) {
  Storage.removeEvento(id);
  renderizarEventos();
  mostrarToast('Evento removido.');
}

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