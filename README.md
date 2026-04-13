◈ UniPlanner – Controle Acadêmico

Aplicação web para estudantes organizarem suas disciplinas, notas e compromissos acadêmicos ao longo do semestre.


📌 Sobre o projeto

O UniPlanner nasceu de uma necessidade real: durante o semestre, é fácil perder o controle de quantas provas faltam, qual a sua média atual e quando é o próximo prazo de entrega.
Com ele, você consegue:

Cadastrar suas disciplinas e acompanhar as notas em um só lugar
Ver automaticamente sua média e se está aprovado, em recuperação ou reprovado
Adicionar eventos na agenda (provas, trabalhos, entregas) e saber quantos dias faltam
Tudo salvo direto no navegador — sem precisar de conta ou internet


🚀 Como usar

Não precisa instalar nada. Basta:

Clonar ou baixar o repositório
Abrir o arquivo index.html no navegador


✨ Funcionalidades

Disciplinas

Cadastrar matérias com nome, professor e cor de identificação
Adicionar notas com peso (para média ponderada)
Cálculo automático da média e situação (✓ Aprovado / Recuperação / Reprovado)
Indicativo de quantos pontos faltam para atingir a média mínima
Média mínima configurável por disciplina

Agenda

Adicionar eventos acadêmicos: provas, trabalhos, entregas e outros
Filtrar eventos por tipo
Contador de dias restantes com alertas de urgência
Vincular eventos a disciplinas cadastradas


🛠️ Tecnologias

Projeto desenvolvido com HTML, CSS e JavaScript puro — sem frameworks ou bibliotecas externas.
TecnologiaUsoHTML5 semânticoEstrutura da aplicaçãoCSS3Estilização e layout responsivo (Flexbox + Grid)JavaScriptInteratividade e manipulação do DOMlocalStoragePersistência dos dados no navegador

📁 Estrutura de arquivos

uniplanner/
├── index.html          # Estrutura da aplicação
├── css/
│   └── style.css       # Toda a estilização
└── js/
    ├── storage.js      # Funções de salvar/carregar do localStorage
    ├── disciplinas.js  # Lógica de disciplinas e notas
    ├── agenda.js       # Lógica da agenda de eventos
    └── app.js          # Navegação, modais e inicialização


📋 Requisitos atendidos

✅ Tags semânticas: header, main, section, article, nav, aside, footer
✅ Formulários com label associados aos campos
✅ Layout responsivo (funciona em celular e desktop)
✅ Flexbox e Grid no layout
✅ CSS em arquivo externo (sem Bootstrap ou Tailwind)
✅ JavaScript em arquivos externos (sem frameworks)
✅ Manipulação do DOM dinamicamente
✅ Eventos de clique, digitação e mudança de valor
✅ Dados salvos com localStorage
