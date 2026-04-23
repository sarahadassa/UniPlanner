const listaDisciplinasEl = document.getElementById('lista-disciplinas');
const emptyDisciplinasEl = document.getElementById('empty-disciplinas');
const btnAbrirModalDisc  = document.getElementById('btn-abrir-modal-disciplina');
const btnSalvarDisc      = document.getElementById('btn-salvar-disciplina');
const discNomeInput      = document.getElementById('disc-nome');
const discProfInput      = document.getElementById('disc-professor');
const corPickerEl        = document.getElementById('cor-picker');

const pageDetalhe      = document.getElementById('page-detalhe');
const detalheNomeEl    = document.getElementById('detalhe-nome');
const detalheProfEl    = document.getElementById('detalhe-professor');
const detalheMediaEl   = document.getElementById('detalhe-media');
const detalheStatusEl  = document.getElementById('detalhe-status');
const detalheFaltaEl   = document.getElementById('detalhe-falta');
const btnVoltarEl      = document.getElementById('btn-voltar');
const btnExcluirDisc   = document.getElementById('btn-excluir-disciplina');
const listaNotasEl     = document.getElementById('lista-notas');
const emptyNotasEl     = document.getElementById('empty-notas');
const mediaMinInput    = document.getElementById('media-minima-input');

const btnAbrirModalNota = document.getElementById('btn-abrir-modal-nota');
const btnSalvarNota     = document.getElementById('btn-salvar-nota');
const notaDescInput     = document.getElementById('nota-descricao');
const notaValorInput    = document.getElementById('nota-valor');
const notaPesoInput     = document.getElementById('nota-peso');

let disciplinaAtualId = null;
let corSelecionada = '#E76F51';

// Calcula a media ponderada das notas
function calcularMedia(notas) {
  if (!notas || notas.length === 0) return null;

  let somaPeso = 0;
  let somaTotal = 0;

  notas.forEach(nota => {
    const peso = parseFloat(nota.peso) || 1;
    somaPeso += peso;
    somaTotal += parseFloat(nota.valor) * peso;
  });

  return somaPeso === 0 ? null : somaTotal / somaPeso;
}

// Retorna a situaçao do aluno com base na madia
function calcularSituacao(media, minima) {
  if (media === null) return { label: 'Sem notas', classe: 'status--sem-nota' };
  if (media >= minima) return { label: 'Aprovado ✓', classe: 'status--aprovado' };
  if (media >= minima * 0.75) return { label: 'Recuperação', classe: 'status--recuperacao' };
  return { label: 'Reprovado', classe: 'status--reprovado' };
}

// Mostra quanto falta para atingir a média minima
function mensagemFalta(notas, minima) {
  const media = calcularMedia(notas);
  if (media === null) return `Adicione notas. Média mínima: ${minima}`;
  if (media >= minima) return `Você atingiu a média mínima de ${minima}! 🎉`;
  return `Faltam ${(minima - media).toFixed(2)} pontos para atingir a média ${minima}.`;
}

// Mostra os cards de disciplinas na tela
function renderizarDisciplinas() {
  const disciplinas = Storage.getDisciplinas();
  listaDisciplinasEl.innerHTML = '';

  if (disciplinas.length === 0) {
    emptyDisciplinasEl.style.display = 'block';
    return;
  }

  emptyDisciplinasEl.style.display = 'none';

  disciplinas.forEach(disciplina => {
    const media = calcularMedia(disciplina.notas || []);
    const minima = disciplina.mediaMinima || 6;
    const situacao = calcularSituacao(media, minima);

    const card = document.createElement('article');
    card.className = 'disc-card';
    card.style.setProperty('--card-cor', disciplina.cor || '#5B7BFF');

    card.innerHTML = `
      <h2 class="disc-card-nome">${disciplina.nome}</h2>
      <p class="disc-card-professor">${disciplina.professor || 'Professor não informado'}</p>
      <div class="disc-card-stats">
        <span class="disc-media-badge">${media !== null ? media.toFixed(1) : '–'}</span>
        <span class="disc-status-badge ${situacao.classe}">${situacao.label}</span>
      </div>
      <p class="disc-card-notas-count">${(disciplina.notas || []).length} nota(s) registrada(s)</p>
    `;

    card.addEventListener('click', () => abrirDetalhe(disciplina.id));
    listaDisciplinasEl.appendChild(card);
  });
}

// Abre a tela de detalhe de uma disciplina
function abrirDetalhe(id) {
  disciplinaAtualId = id;
  const disciplina = Storage.getDisciplinaById(id);
  if (!disciplina) return;

  detalheNomeEl.textContent = disciplina.nome;
  detalheProfEl.textContent = disciplina.professor || 'Professor não informado';
  mediaMinInput.value = disciplina.mediaMinima || 6;

  renderizarDetalhe(disciplina);

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  pageDetalhe.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
}

// Atualiza as informaçoes de notas e media na tela de detalhe
function renderizarDetalhe(disciplina) {
  const notas = disciplina.notas || [];
  const minima = parseFloat(disciplina.mediaMinima) || 6;
  const media = calcularMedia(notas);
  const situacao = calcularSituacao(media, minima);

  detalheMediaEl.textContent = media !== null ? media.toFixed(2) : '–';
  detalheStatusEl.textContent = situacao.label;
  detalheStatusEl.className = `media-status ${situacao.classe}`;
  detalheFaltaEl.textContent = mensagemFalta(notas, minima);

  listaNotasEl.innerHTML = '';

  if (notas.length === 0) {
    emptyNotasEl.style.display = 'block';
    return;
  }

  emptyNotasEl.style.display = 'none';

  notas.forEach((nota, index) => {
    const valor = parseFloat(nota.valor);
    let cor = 'color:var(--red)';
    if (valor >= minima) cor = 'color:var(--green)';
    else if (valor >= minima * 0.75) cor = 'color:var(--yellow)';

    const item = document.createElement('div');
    item.className = 'nota-item';
    item.innerHTML = `
      <div class="nota-info">
        <p class="nota-descricao">${nota.descricao}</p>
        <p class="nota-peso">Peso: ${nota.peso || 1}</p>
      </div>
      <span class="nota-valor" style="${cor}">${valor.toFixed(1)}</span>
      <button class="nota-excluir" data-index="${index}">✕</button>
    `;
    listaNotasEl.appendChild(item);
  });

  listaNotasEl.querySelectorAll('.nota-excluir').forEach(btn => {
    btn.addEventListener('click', (e) => excluirNota(parseInt(e.currentTarget.dataset.index)));
  });
}

// Salva uma nova disciplina
function salvarDisciplina() {
  const nome = discNomeInput.value.trim();
  if (!nome) {
    mostrarToast('Informe o nome da disciplina.', 'erro');
    return;
  }

  Storage.addDisciplina({
    id: Storage.gerarId(),
    nome,
    professor: discProfInput.value.trim(),
    cor: corSelecionada,
    notas: [],
    mediaMinima: 6
  });

  fecharModal('modal-disciplina');
  renderizarDisciplinas();
  mostrarToast(`"${nome}" adicionada!`);
}

// Salva uma nova nota
function salvarNota() {
  const descricao = notaDescInput.value.trim();
  const valor = parseFloat(notaValorInput.value);
  const peso = parseFloat(notaPesoInput.value) || 1;

  if (!descricao || isNaN(valor)) {
    mostrarToast('Preencha a descrição e a nota.', 'erro');
    return;
  }

  if (valor < 0 || valor > 10) {
    mostrarToast('A nota deve ser entre 0 e 10.', 'erro');
    return;
  }

  const disciplina = Storage.getDisciplinaById(disciplinaAtualId);
  const notas = disciplina.notas || [];
  notas.push({ descricao, valor, peso });
  Storage.updateDisciplina(disciplinaAtualId, { notas });

  fecharModal('modal-nota');
  renderizarDetalhe(Storage.getDisciplinaById(disciplinaAtualId));
  mostrarToast('Nota adicionada!');
}

// Remove uma nota pelo indice
function excluirNota(index) {
  const disciplina = Storage.getDisciplinaById(disciplinaAtualId);
  const notas = disciplina.notas || [];
  notas.splice(index, 1);
  Storage.updateDisciplina(disciplinaAtualId, { notas });
  renderizarDetalhe(Storage.getDisciplinaById(disciplinaAtualId));
  mostrarToast('Nota removida.');
}

// Remove a disciplina atual
function excluirDisciplina() {
  const disciplina = Storage.getDisciplinaById(disciplinaAtualId);
  if (!confirm(`Excluir "${disciplina.nome}"? Todas as notas serão perdidas.`)) return;

  Storage.removeDisciplina(disciplinaAtualId);
  disciplinaAtualId = null;
  voltarParaLista();
  renderizarDisciplinas();
  mostrarToast('Disciplina excluída.');
}

// Volta para a lista de disciplinas
function voltarParaLista() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-disciplinas').classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === 'disciplinas');
  });
}

// Eventos dos botões
btnAbrirModalDisc.addEventListener('click', () => {
  discNomeInput.value = '';
  discProfInput.value = '';
  corSelecionada = '#E76F51';
  corPickerEl.querySelectorAll('.cor-btn').forEach((btn, i) => btn.classList.toggle('active', i === 0));
  abrirModal('modal-disciplina');
});

corPickerEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cor-btn');
  if (!btn) return;
  corPickerEl.querySelectorAll('.cor-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  corSelecionada = btn.dataset.cor;
});

btnSalvarDisc.addEventListener('click', salvarDisciplina);
discNomeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') salvarDisciplina(); });
btnVoltarEl.addEventListener('click', voltarParaLista);
btnExcluirDisc.addEventListener('click', excluirDisciplina);

btnAbrirModalNota.addEventListener('click', () => {
  notaDescInput.value = '';
  notaValorInput.value = '';
  notaPesoInput.value = '1';
  abrirModal('modal-nota');
});

btnSalvarNota.addEventListener('click', salvarNota);

mediaMinInput.addEventListener('change', () => {
  const novaMin = parseFloat(mediaMinInput.value);
  if (isNaN(novaMin) || novaMin < 0 || novaMin > 10) {
    mostrarToast('Média mínima deve ser entre 0 e 10.', 'erro');
    return;
  }
  Storage.updateDisciplina(disciplinaAtualId, { mediaMinima: novaMin });
  renderizarDetalhe(Storage.getDisciplinaById(disciplinaAtualId));
});