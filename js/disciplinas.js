
const listaDisciplinasEl  = document.getElementById('lista-disciplinas');
const emptyDisciplinasEl  = document.getElementById('empty-disciplinas');
const btnAbrirModalDisc   = document.getElementById('btn-abrir-modal-disciplina');
const btnSalvarDisc       = document.getElementById('btn-salvar-disciplina');

const modalDisc           = document.getElementById('modal-disciplina');
const discNomeInput       = document.getElementById('disc-nome');
const discProfInput       = document.getElementById('disc-professor');
const corPickerEl         = document.getElementById('cor-picker');

const pageDetalhe         = document.getElementById('page-detalhe');
const detalheNomeEl       = document.getElementById('detalhe-nome');
const detalheProfEl       = document.getElementById('detalhe-professor');
const detalheMediaEl      = document.getElementById('detalhe-media');
const detalheStatusEl     = document.getElementById('detalhe-status');
const detalheFaltaEl      = document.getElementById('detalhe-falta');
const btnVoltarEl         = document.getElementById('btn-voltar');
const btnExcluirDisc      = document.getElementById('btn-excluir-disciplina');
const listaNotasEl        = document.getElementById('lista-notas');
const emptyNotasEl        = document.getElementById('empty-notas');
const mediaMinInput       = document.getElementById('media-minima-input');

const modalNota           = document.getElementById('modal-nota');
const btnAbrirModalNota   = document.getElementById('btn-abrir-modal-nota');
const btnSalvarNota       = document.getElementById('btn-salvar-nota');
const notaDescInput       = document.getElementById('nota-descricao');
const notaValorInput      = document.getElementById('nota-valor');
const notaPesoInput       = document.getElementById('nota-peso');


let disciplinaAtualId = null;
let corSelecionada = '#E76F51';


function calcularMedia(notas) {
  if (!notas || notas.length === 0) return null;
  let somaPeso = 0;
  let somaNotaPeso = 0;
  notas.forEach(nota => {
    const peso = parseFloat(nota.peso) || 1;
    somaPeso += peso;
    somaNotaPeso += parseFloat(nota.valor) * peso;
  });
  if (somaPeso === 0) return null;
  return somaNotaPeso / somaPeso;
}

function calcularSituacao(media, mediaMinima) {
  if (media === null) return { label: 'Sem notas', classe: 'status--sem-nota' };
  const limiteRecuperacao = mediaMinima * 0.75;
  if (media >= mediaMinima)        return { label: 'Aprovado ✓',  classe: 'status--aprovado' };
  if (media >= limiteRecuperacao)  return { label: 'Recuperação', classe: 'status--recuperacao' };
  return { label: 'Reprovado', classe: 'status--reprovado' };
}

function calcularFaltaMédia(notas, mediaMinima) {
  const media = calcularMedia(notas);
  if (media === null) return `Adicione notas para ver sua situação. Média mínima: ${mediaMinima}`;
  if (media >= mediaMinima) return `Você atingiu a média mínima de ${mediaMinima}! 🎉`;
  const falta = (mediaMinima - media).toFixed(2);
  return `Faltam ${falta} pontos para atingir a média ${mediaMinima}.`;
}


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
    const mediaMinima = disciplina.mediaMinima || 6;
    const situacao = calcularSituacao(media, mediaMinima);
    const mediaFormatada = media !== null ? media.toFixed(1) : '–';

    const card = document.createElement('article');
    card.className = 'disc-card';
    card.style.setProperty('--card-cor', disciplina.cor || '#5B7BFF');
    card.setAttribute('aria-label', `Disciplina: ${disciplina.nome}`);
    card.dataset.id = disciplina.id;

    card.innerHTML = `
      <h2 class="disc-card-nome">${disciplina.nome}</h2>
      <p class="disc-card-professor">${disciplina.professor || 'Professor não informado'}</p>
      <div class="disc-card-stats">
        <span class="disc-media-badge">${mediaFormatada}</span>
        <span class="disc-status-badge ${situacao.classe}">${situacao.label}</span>
      </div>
      <p class="disc-card-notas-count">${(disciplina.notas || []).length} nota(s) registrada(s)</p>
    `;

    card.addEventListener('click', () => abrirDetalhe(disciplina.id));
    listaDisciplinasEl.appendChild(card);
  });
}

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

function renderizarDetalhe(disciplina) {
  const notas = disciplina.notas || [];
  const mediaMinima = parseFloat(disciplina.mediaMinima) || 6;
  const media = calcularMedia(notas);
  const situacao = calcularSituacao(media, mediaMinima);

  detalheMediaEl.textContent = media !== null ? media.toFixed(2) : '–';
  detalheStatusEl.textContent = situacao.label;
  detalheStatusEl.className = `media-status ${situacao.classe}`;
  detalheFaltaEl.textContent = calcularFaltaMédia(notas, mediaMinima);

  listaNotasEl.innerHTML = '';

  if (notas.length === 0) {
    emptyNotasEl.style.display = 'block';
    return;
  }

  emptyNotasEl.style.display = 'none';

  notas.forEach((nota, index) => {
    const item = document.createElement('div');
    item.className = 'nota-item';

    const valorNum = parseFloat(nota.valor);
    let corValor = '';
    if (valorNum >= mediaMinima)              corValor = 'style="color:var(--green)"';
    else if (valorNum >= mediaMinima * 0.75)  corValor = 'style="color:var(--yellow)"';
    else                                      corValor = 'style="color:var(--red)"';

    item.innerHTML = `
      <div class="nota-info">
        <p class="nota-descricao">${nota.descricao}</p>
        <p class="nota-peso">Peso: ${nota.peso || 1}</p>
      </div>
      <span class="nota-valor" ${corValor}>${parseFloat(nota.valor).toFixed(1)}</span>
      <button class="nota-excluir" data-index="${index}" aria-label="Excluir nota ${nota.descricao}">✕</button>
    `;
    listaNotasEl.appendChild(item);
  });

  listaNotasEl.querySelectorAll('.nota-excluir').forEach(btn => {
    btn.addEventListener('click', (e) => excluirNota(parseInt(e.currentTarget.dataset.index)));
  });
}

function salvarDisciplina() {
  const nome = discNomeInput.value.trim();
  if (!nome) { mostrarToast('Informe o nome da disciplina.', 'erro'); discNomeInput.focus(); return; }

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
  mostrarToast(`"${nome}" adicionada com sucesso!`);
}

function salvarNota() {
  const descricao = notaDescInput.value.trim();
  const valorStr  = notaValorInput.value.trim();
  const pesoStr   = notaPesoInput.value.trim();

  if (!descricao || valorStr === '') { mostrarToast('Preencha a descrição e o valor da nota.', 'erro'); return; }

  const valor = parseFloat(valorStr);
  const peso  = parseFloat(pesoStr) || 1;

  if (isNaN(valor) || valor < 0 || valor > 10) { mostrarToast('A nota deve ser entre 0 e 10.', 'erro'); return; }

  const disciplina = Storage.getDisciplinaById(disciplinaAtualId);
  if (!disciplina) return;

  const notas = disciplina.notas || [];
  notas.push({ descricao, valor, peso });
  Storage.updateDisciplina(disciplinaAtualId, { notas });

  fecharModal('modal-nota');
  renderizarDetalhe(Storage.getDisciplinaById(disciplinaAtualId));
  mostrarToast('Nota adicionada!');
}

function excluirNota(index) {
  const disciplina = Storage.getDisciplinaById(disciplinaAtualId);
  if (!disciplina) return;
  const notas = disciplina.notas || [];
  notas.splice(index, 1);
  Storage.updateDisciplina(disciplinaAtualId, { notas });
  renderizarDetalhe(Storage.getDisciplinaById(disciplinaAtualId));
  mostrarToast('Nota removida.');
}

function excluirDisciplina() {
  const disciplina = Storage.getDisciplinaById(disciplinaAtualId);
  if (!disciplina) return;
  if (!confirm(`Deseja excluir "${disciplina.nome}"? Todas as notas serão perdidas.`)) return;
  Storage.removeDisciplina(disciplinaAtualId);
  disciplinaAtualId = null;
  voltarParaLista();
  renderizarDisciplinas();
  mostrarToast('Disciplina excluída.');
}

function voltarParaLista() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-disciplinas').classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === 'disciplinas');
  });
}


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
  if (isNaN(novaMin) || novaMin < 0 || novaMin > 10) { mostrarToast('Média mínima deve ser entre 0 e 10.', 'erro'); return; }
  Storage.updateDisciplina(disciplinaAtualId, { mediaMinima: novaMin });
  renderizarDetalhe(Storage.getDisciplinaById(disciplinaAtualId));
});