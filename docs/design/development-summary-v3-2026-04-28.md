# Bokmål App — Day 3 Changes

**Date:** 27 April 2026  
**Version:** v3  
**Focus:** Flashcard navigation and short practice mode

---

## Overview

Day 3 focused on improving the flashcard area of the Deutsch → Norwegisch Bokmål learning app.

The flashcard section is the main learning area of the app, so the work focused on making flashcard practice easier to navigate and more flexible.

The changes were kept limited to the flashcard area.

---

## Flashcard navigation improved

A **Vorherige Karte** button was added next to **Nächste Karte**.

The user can now move backwards and forwards through the current flashcard set.

The app continues to show the current card position clearly, for example:

    Karte 1 von 10
    Karte 1 von 132

Navigation behaviour:

* **Vorherige Karte** is disabled on the first card.
* **Nächste Karte** is disabled on the last card.
* Moving to another card clears **Meine Antwort**.
* Moving to another card hides any checked answer/result.

---

## Short practice mode added

A practice size control was added to make flashcard practice shorter and easier to manage.

The available practice size options are:

* **Alle Karten**
* **10 zufällige Karten**
* **20 zufällige Karten**

The practice size applies to the currently selected flashcard filter.

Examples:

    Filter: Verben + 10 zufällige Karten = 10 random verb cards
    Filter: Substantive + 10 zufällige Karten = 10 random noun cards
    Filter: Sätze + 20 zufällige Karten = 20 random sentence cards

---

## Flashcard filters preserved

The existing flashcard filters remain available:

* **Alle**
* **Substantive**
* **Verben**
* **Sätze**

The new practice size control works together with these filters.

For example, selecting **Verben** and **10 zufällige Karten** creates a short random practice set using verb cards only.

---

## Reset behaviour improved

When the flashcard filter or practice size changes, the app now:

* creates a new flashcard set
* resets to the first card
* clears **Meine Antwort**
* hides any checked answer/result

When the user moves backwards or forwards to another card, the app now:

* clears **Meine Antwort**
* hides any checked answer/result

This keeps each flashcard attempt clean and prevents answers from carrying over between cards.

---

## Existing app logic preserved

The flashcard improvement did not change the seed content structure.

The import/export logic was preserved.

User-added content continues to work in flashcards.

Imported content continues to work in flashcards.

The **Übungen** area was not removed or changed.

The change was kept small and easy to test.

---

## Result

The flashcard area now supports both full-card practice and shorter random practice sessions.

The user can:

* practise all available cards
* practise 10 random cards
* practise 20 random cards
* apply short practice mode to a selected filter
* move forwards through a flashcard set
* move backwards through a flashcard set
* see the current card position
* type an answer using **Meine Antwort**
* move between cards without old answers/results remaining visible

The flashcard system continues to include seed content, user-added content, and imported content.