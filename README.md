# Bokmål Learning App

A small personal learning app for studying Norwegian Bokmål  using German as the support/source language.

This is an early AI-assisted project built with **React + Vite**. It is also my first project using Codex.  I cannot code, I know a little html and css. That is all.  I do not know if codex has built the app in the most clean and elegant way.  I do not know if it contains flaws.  It is a rough mvp which works for my learning goals. 

## Development transparency

I am building the app in **VS Code on a Chromebook**, using the **Codex extension**. I am also using **ChatGPT / GPT-5.5 Thinking** to advise me step by step on setup, Git, GitHub, React/Vite structure, and safe incremental development.

The app is therefore an AI-assisted learning project. I am making the decisions about what the app should do, testing the changes myself, and committing each working checkpoint to GitHub.  But everything else is done with AI assistance.

The purpose of sharing this repo is transparency and usefulness. Others are welcome to view it, clone it, or fork it as a starting point for their own language-learning app, without changing this original repo.

## What the app does

The app currently includes:

- Bokmål vocabulary practice
- German ↔ Bokmål learning support
- Flashcards
- Sentence practice
- User-added words and sentences
- Import/export of user-added content as JSON
- A vocabulary display grouped into:
  - Substantive
  - Verben
  - Sätze

The app is aimed at early-stage Bokmål learning, roughly A1 moving towards A2/B1.

## Current storage model

The app uses two kinds of content.

### 1. Seed content

Seed content is the built-in starter vocabulary and sentence material stored in the source code.  The seed content is a set of verbs, nouns and example sentences in Bokmal with German translations that I created in conjunction with chatgpt and Norwegian for the web.  

This content is always available when the app loads.

### 2. User-added content

User-added content is content added through the app interface.  I add it myself when I see interesting phrases or vocab, for example from Duolingo or watching episodes of Peppa Gris.

It is currently stored in the browser using `localStorage`.

Because browser storage can disappear, the app includes an export/import system. This allows user-added content to be backed up to a JSON file and restored later.  The JSON file is saved on my chromebook with the date and time it was exported as part of the file name.  If I lose local browser status, then I import the data from my hard drive using the import button.   

If browser storage is lost, the app falls back to seed content only.

If a saved JSON file is imported, the user-added content is restored and appears again in the app.

## How someone else can use it

People can view the project on GitHub, download it, clone it, or fork it.

People cannot change this original repo unless they are given collaborator or write access.

I expect people to use the project respectfully and lawfully.

## Running locally

Install dependencies:

```bash
npm install
````

Start the development server:

```bash
npm run dev
```

Then open the local address shown in the terminal.

## Main source files

```text
src/App.jsx
src/App.css
src/data/seedContent.js
```


















# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
