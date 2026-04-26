# Bokmål App Development Summary

**Version:** 2.1  
**Date:** 26 April 2026  
**Project:** Deutsch → Norwegisch Bokmål learning app  
**Stack:** React / Vite  
**Repository:** GitHub repository, with committed work available for other developers/users to build on.

---

## Overview

This app is a working local MVP for learning Norwegian Bokmål through German.

It supports vocabulary study, flashcards, sentence practice, user-added learning content, local saving, and JSON import/export.

---

## Technology used

The app was built with:

- React
- Vite
- JavaScript
- Browser `localStorage`
- JSON import/export
- Git and GitHub for version control

The seed learning data is stored separately in:

```text
src/data/seedContent.js
```

---

## App structure

The original rough prototype was refactored into clearer app sections/components, including:

- Header
- Start section
- Wortschatz / vocabulary section
- Karten / flashcards section
- Übungen / sentence practice section
- Meine Wörter / user-content section

This made the app easier to maintain and extend.

---

## Language and UI

Visible German and Norwegian labels were corrected and standardised.

The app now uses correct visible forms such as:

- Bokmål
- Wörter
- Übungen
- Meine Wörter
- Sätze
- Präsens
- Präteritum

Technical IDs may still use ASCII-safe forms where useful in code.

---

## Vocabulary and seed content

A curated Bokmål verb list was added.

The app currently includes 43 curated Bokmål verbs.

Each verb includes:

- Bokmål infinitive
- present tense
- preterite
- German translation

Example data shape:

```text
å være — er — var — sein
å ha — har — hadde — haben
å gjøre — gjør — gjorde — machen / tun
å dra — drar — dro — gehen / fahren / losfahren
å hente — henter — hentet — holen / abholen
```

---

## Flashcards

The app has a working flashcard system.

Flashcards can be filtered by:

- Alle
- Substantive
- Verben
- Sätze

Changing the filter resets the flashcard view to the first card in that group and hides the answer.

The card count updates correctly, for example:

```text
Karte 1 von 43
```

User-added and imported content is included in the relevant flashcard groups.

---

## Sentence practice

The Übungen section supports German → Bokmål sentence practice.

The user can:

- read a German sentence prompt
- type their own Bokmål answer
- click to reveal the model answer
- compare:
  - Meine Antwort
  - Musterantwort
- move to the next sentence

When moving to the next sentence, the typed answer is cleared and the model answer is hidden again.

---

## Meine Wörter

The app includes a “Meine Wörter” section for adding personal learning content.

The user can add:

### Substantive

Fields:

- Deutsch
- Bokmål Singular
- Bestimmt Singular
- Plural
- Bestimmt Plural

### Verben

Fields:

- Deutsch
- Infinitiv
- Präsens
- Präteritum

### Sätze

Fields:

- Deutsch
- Bokmål

User-added content is displayed in the app and included in flashcards.

---

## Local saving

User-added content is saved in browser `localStorage`.

This allows content to remain available after:

- page refresh
- closing and reopening the browser
- stopping and restarting the local Vite server

---

## Import and export

The app supports JSON import/export for user-added “Meine Wörter” content.

The export function downloads the user’s added content as a JSON file.

Export filenames are dated.

Imported content is restored into the app and appears in:

- Meine Wörter
- Wortschatz
- flashcards

The working backup route is:

```text
localStorage → export JSON file → import later
```

---

## Wortschatz display

The Wortschatz display has been improved.

It now supports:

- show/hide toggle
- alphabetical sorting
- inclusion of imported and user-added content when available

---

## Version control

The project is tracked with Git and committed to GitHub.

The latest tested work has been committed, and the repository is available so the work can be shared, reviewed, reused, or developed further by others.
