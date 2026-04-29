# Bokmal App - Day 4 Changes

**Date:** 29 April 2026  
**Version:** v4  
**Focus:** Hausaufgaben notes area

---

## Overview

Day 4 added a new **Hausaufgaben** area to the Bokmal app.

The purpose of this section is simple: provide a quick place to write class or homework materials by date, without requiring German translation, vocabulary structure, flashcards, or exercises.

The feature is intended as a practical class notebook inside the app.

---

## New Hausaufgaben section

A new top navigation item was added:

    Hausaufgaben

The new section appears after **Ubungen** and before **Meine Worter**.

The section heading is:

    Hausaufgaben
    Notizen fur den Unterricht

---

## Homework input fields

The first version of the Hausaufgaben area has two main input fields:

* **Datum**
* **Materialien**

The **Datum** field uses a normal date picker.

The **Materialien** field is a long text field for quickly writing or pasting notes.

The saved text is not translated, categorised, or changed by the app.

---

## Saving homework materials

The **Speichern** button saves a homework entry with:

* a unique id
* the selected date
* the written text
* a created timestamp

Saved entries are stored in browser local storage using a separate storage key:

    bokmal-app-homework-content

This keeps Hausaufgaben data separate from **Meine Worter** and the existing vocabulary import/export data.

---

## Display by selected date

The app displays saved homework materials for the currently selected date.

The display heading is:

    Materialien fur [date]

If there are no saved materials for that date, the app shows:

    Noch keine Materialien fur dieses Datum.

Saved notes are shown newest first for the selected date.

Line breaks in the saved notes are preserved, so class materials remain readable.

---

## Editing saved entries

Each saved Hausaufgaben entry now has a **Bearbeiten** button.

When **Bearbeiten** is selected, the saved entry changes into an inline edit form with:

* a text area containing the saved material
* **Speichern**
* **Abbrechen**

Saving an edit updates the text of that entry.

Editing does not change:

* the homework date
* the entry id
* the created timestamp
* the import/export data shape

This means existing exported Hausaufgaben JSON files remain compatible.

---

## Deleting saved entries

Each saved Hausaufgaben entry also has a **Loschen** button.

When **Loschen** is selected, that entry is removed from the saved Hausaufgaben list and from local storage.

Deleting a Hausaufgaben entry does not affect:

* other entries for the same date
* entries for other dates
* **Meine Worter**
* flashcards
* **Ubungen**

---

## Hausaufgaben import and export

Hausaufgaben has its own JSON import/export controls.

The export button downloads the homework entries as JSON.

Exported files use dated filenames, for example:

    bokmal-hausaufgaben-2026-04-29-1430.json

The import button restores Hausaufgaben entries from a JSON file.

Imported data is validated before it replaces the saved Hausaufgaben entries.

The app expects each imported Hausaufgaben entry to include:

* `id`
* `date`
* `text`
* `createdAt`

---

## Existing app areas preserved

The Hausaufgaben work did not change:

* flashcard navigation
* flashcard typed answer behaviour
* flashcard random practice logic
* `seedContent.js`
* **Ubungen**
* **Meine Worter** import/export
* vocabulary seed data

The new feature is separate from the existing learning content.

---

## Files changed

Main implementation:

    src/App.jsx

Styling:

    src/App.css

Documentation:

    docs/design/development-summary-v4-2026-04-29.md

---

## Result

The app now has a simple **Hausaufgaben** area for date-based class materials.

The user can:

* choose a homework date
* write long freeform notes
* save the notes
* see all saved materials for the selected date
* edit saved entries after they have been saved
* cancel an edit without changing the saved entry
* delete saved entries that are no longer needed
* export Hausaufgaben entries as JSON
* import Hausaufgaben entries from JSON

This gives the app a small, practical place for class preparation while keeping the existing flashcard, vocabulary, and exercise areas unchanged.
