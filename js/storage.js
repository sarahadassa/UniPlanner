
const Storage = {
  getDisciplinas() {
    const dados = localStorage.getItem('uniplanner_disciplinas');
    return dados ? JSON.parse(dados) : [];
  },

  saveDisciplinas(disciplinas) {
    localStorage.setItem('uniplanner_disciplinas', JSON.stringify(disciplinas));
  },

  addDisciplina(disciplina) {
    const lista = this.getDisciplinas();
    lista.push(disciplina);
    this.saveDisciplinas(lista);
  },

  removeDisciplina(id) {
    const lista = this.getDisciplinas().filter(d => d.id !== id);
    this.saveDisciplinas(lista);
  },

  updateDisciplina(id, dados) {
    const lista = this.getDisciplinas().map(d =>
      d.id === id ? { ...d, ...dados } : d
    );
    this.saveDisciplinas(lista);
  },

  getDisciplinaById(id) {
    return this.getDisciplinas().find(d => d.id === id);
  },

  getEventos() {
    const dados = localStorage.getItem('uniplanner_eventos');
    return dados ? JSON.parse(dados) : [];
  },

  saveEventos(eventos) {
    localStorage.setItem('uniplanner_eventos', JSON.stringify(eventos));
  },

  addEvento(evento) {
    const lista = this.getEventos();
    lista.push(evento);
    this.saveEventos(lista);
  },

  removeEvento(id) {
    const lista = this.getEventos().filter(e => e.id !== id);
    this.saveEventos(lista);
  },

  gerarId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
};