# 🎓 UniPlanner

O **UniPlanner** é uma aplicação web para organização acadêmica que permite gerenciar disciplinas, notas e eventos do semestre de forma simples, visual e interativa.

---

## 📌 Sobre o projeto

O projeto foi desenvolvido com foco em facilitar o acompanhamento do desempenho acadêmico e organização de tarefas importantes, como provas e entregas.

Todos os dados são armazenados localmente no navegador utilizando **LocalStorage**, sem necessidade de banco de dados externo.

---

## 🚀 Funcionalidades

### 📚 Disciplinas

* Cadastro de disciplinas com:

  * Nome
  * Professor
  * Cor personalizada
* Visualização em formato de cards
* Exclusão de disciplinas

---

### 📝 Notas

* Adição de notas com:

  * Descrição
  * Valor (0 a 10)
  * Peso
* Cálculo automático de média ponderada
* Exibição de status:

  * Aprovado
  * Recuperação
  * Reprovado
* Definição de média mínima (editável)
* Remoção de notas

---

### 📅 Agenda

* Cadastro de eventos com:

  * Título
  * Tipo (prova, trabalho, entrega, outros)
  * Data
  * Disciplina vinculada (opcional)
  * Observações
* Filtro por tipo de evento
* Cálculo de dias restantes
* Destaque visual para eventos:

  * Próximos
  * Urgentes
  * Já passados
* Remoção de eventos

---

### 💾 Armazenamento

* Utilização de **LocalStorage**
* Dados persistem mesmo após recarregar a página

---

## 🛠️ Tecnologias utilizadas

* HTML5
* CSS3 (com variáveis e layout responsivo)
* JavaScript (Vanilla JS)

---

## ⚙️ Como funciona

* A aplicação é baseada em **manipulação de DOM**
* Não utiliza frameworks ou bibliotecas externas
* A navegação entre páginas é feita dinamicamente via JavaScript
* Os dados são salvos e recuperados automaticamente do navegador

---

## ▶️ Como executar

1. Clone o repositório:

```id="y5gq9n"
git clone https://github.com/sarahadassa/UniPlanner.git
```

2. Abra o arquivo `index.html` no navegador

---

## 🎯 Objetivo acadêmico

Este projeto foi desenvolvido como atividade acadêmica com o objetivo de aplicar conceitos de:

* Manipulação de DOM
* Estruturação de código JavaScript
* Persistência de dados no navegador
* Interface e experiência do usuário

---

## ✨ Diferenciais do projeto

* Interface moderna e organizada
* Uso de cores para identificação de disciplinas
* Feedback visual (status, badges e alertas)
* Cálculo automático de desempenho acadêmico
* Sistema completo sem uso de backend

---


## 👩‍💻 Autores

Desenvolvido por **Maria Carolina Pereira** e **Sara Hadassa Carvalho** 


## 📌 Observação

Os dados são armazenados apenas no navegador. Caso o cache seja limpo, as informações serão perdidas.

---
