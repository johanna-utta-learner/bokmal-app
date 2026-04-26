# Bokmål App — Day 2 Changes

**Date:** 26 April 2026
**Version:** v0.2

* Exported JSON backup files now use dated filenames.
* The long vocabulary list was moved off the front page and hidden behind a show/hide toggle.
* The vocabulary toggle now works both ways: show and hide.
* The **Wortschatz** display is now grouped more clearly.
* Vocabulary sorting was added:

  * nouns sort alphabetically while ignoring `en`, `ei`, `et`
  * verbs sort alphabetically while ignoring `å`
  * sentences sort by Bokmål text
* **Wortschatz** now displays seed content plus any user-added content currently available in `localStorage` or restored via Import.
* If browser storage is lost, **Wortschatz** falls back to seed content only.
* Flashcards now allow typed answers via **Meine Antwort**.
* **Antwort prüfen** now shows the learner’s answer and the correct solution.
* The redundant **Lösung anzeigen** button was removed.
* `src/data/seedContent.js` was expanded with curated adjective content.
* The adjective entries include Bokmål forms, German meanings, and example sentences in Bokmål and German.
* Ordinal numbers 1–10 were added as seed content using `type: "ordinal"` and `theme: "ordinals"`.
* A backup of the original seed content file was created before editing.
* `.gitignore` was updated so the seed-content backup file is not accidentally committed.
* Changes were tested, committed, and pushed to GitHub.