import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  seedAdjectives,
  seedNouns,
  seedOrdinals,
  seedSentences,
  seedVerbs,
} from "./data/seedContent";
import "./App.css";

const USER_CONTENT_KEY = "bokmal-app-user-content";
const HOMEWORK_CONTENT_KEY = "bokmal-app-homework-content";

const UserContentContext = createContext(null);
const HomeworkContentContext = createContext(null);

const sections = [
  { id: "start", label: "Start" },
  { id: "wortschatz", label: "Wortschatz" },
  { id: "karten", label: "Karten" },
  { id: "uebungen", label: "Übungen" },
  { id: "hausaufgaben", label: "Hausaufgaben" },
  { id: "meine-woerter", label: "Meine Wörter" },
  { id: "fortschritt", label: "Fortschritt" },
];

const cardFilters = [
  { id: "all", label: "Alle", cardLabel: null },
  { id: "nouns", label: "Substantive", cardLabel: "Substantiv" },
  { id: "verbs", label: "Verben", cardLabel: "Verb" },
  { id: "adjectives", label: "Adjektive", cardLabel: "Adjektiv" },
  { id: "ordinals", label: "Ordnungszahlen", cardLabel: "Ordnungszahl" },
  { id: "sentences", label: "Sätze", cardLabel: "Satz" },
];

const practiceSizeOptions = [
  { id: "all", label: "Alle Karten", cardCount: null },
  { id: "10", label: "10 zufällige Karten", cardCount: 10 },
  { id: "20", label: "20 zufällige Karten", cardCount: 20 },
];

const userWordFields = {
  noun: [
    { name: "german", label: "Deutsch" },
    { name: "bokmalSingular", label: "Bokmål Singular" },
    { name: "bokmalSingularDefinite", label: "Bestimmt Singular" },
    { name: "bokmalPlural", label: "Plural" },
    { name: "bokmalPluralDefinite", label: "Bestimmt Plural" },
  ],
  verb: [
    { name: "german", label: "Deutsch" },
    { name: "bokmalInfinitive", label: "Infinitiv" },
    { name: "bokmalPresent", label: "Präsens" },
    { name: "bokmalPast", label: "Präteritum" },
  ],
  sentence: [
    { name: "germanPrompt", label: "Deutsch" },
    { name: "bokmalAnswer", label: "Bokmål" },
  ],
};

const userTypeLabels = {
  noun: "Substantiv",
  verb: "Verb",
  sentence: "Satz",
};

const bokmalCollator = new Intl.Collator("nb", { sensitivity: "base" });

function sortByBokmalText(items, getText) {
  return [...items].sort((firstItem, secondItem) =>
    bokmalCollator.compare(getText(firstItem), getText(secondItem)),
  );
}

function getNounSortText(noun) {
  return noun.bokmalSingular.replace(/^(en|ei|et)\s+/i, "");
}

function getVerbSortText(verb) {
  return verb.bokmalInfinitive.replace(/^å\s+/i, "");
}

function getAdjectiveSortText(adjective) {
  return adjective.bokmalBase;
}

function getOrdinalSortText(ordinal) {
  return ordinal.bokmal;
}

function getInitialUserItems() {
  try {
    const storedItems = window.localStorage.getItem(USER_CONTENT_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
}

function getInitialHomeworkEntries() {
  try {
    const storedEntries = window.localStorage.getItem(HOMEWORK_CONTENT_KEY);
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch {
    return [];
  }
}

function getTodayDateInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function makeEmptyUserForm() {
  return {
    german: "",
    bokmalSingular: "",
    bokmalSingularDefinite: "",
    bokmalPlural: "",
    bokmalPluralDefinite: "",
    bokmalInfinitive: "",
    bokmalPresent: "",
    bokmalPast: "",
    germanPrompt: "",
    bokmalAnswer: "",
  };
}

function isValidHomeworkEntry(entry) {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.id === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
    typeof entry.text === "string" &&
    typeof entry.createdAt === "string"
  );
}

function mapUserItemToCard(item) {
  if (item.type === "noun") {
    return {
      id: `${item.id}-card`,
      label: "Substantiv",
      theme: "Meine Wörter",
      prompt: item.german,
      task: "Erinnere dich an die Bokmål-Formen.",
      answer: [
        item.bokmalSingular,
        item.bokmalSingularDefinite,
        item.bokmalPlural,
        item.bokmalPluralDefinite,
      ].join(" / "),
    };
  }

  if (item.type === "verb") {
    return {
      id: `${item.id}-card`,
      label: "Verb",
      theme: "Meine Wörter",
      prompt: item.german,
      task: "Erinnere dich an Infinitiv, Präsens und Präteritum.",
      answer: [item.bokmalInfinitive, item.bokmalPresent, item.bokmalPast].join(
        " / ",
      ),
    };
  }

  return {
    id: `${item.id}-card`,
    label: "Satz",
    theme: "Meine Wörter",
    prompt: item.germanPrompt,
    task: "Übersetze den Satz ins Bokmål.",
    answer: item.bokmalAnswer,
  };
}

function isValidImportedItem(item) {
  if (!item || typeof item !== "object") {
    return false;
  }

  const fields = userWordFields[item.type];

  return (
    typeof item.id === "string" &&
    typeof item.type === "string" &&
    Array.isArray(fields) &&
    fields.every((field) => typeof item[field.name] === "string")
  );
}

function makeCards(userItems) {
  return [
    ...seedNouns.map((noun) => ({
      id: `${noun.id}-card`,
      label: "Substantiv",
      theme: noun.theme,
      prompt: noun.german,
      task: "Erinnere dich an die Bokmål-Formen.",
      answer: [
        noun.bokmalSingular,
        noun.bokmalSingularDefinite,
        noun.bokmalPlural,
        noun.bokmalPluralDefinite,
      ].join(" / "),
    })),
    ...seedVerbs.map((verb) => ({
      id: `${verb.id}-card`,
      label: "Verb",
      theme: verb.theme,
      prompt: verb.german,
      task: "Erinnere dich an Infinitiv, Präsens und Vergangenheit.",
      answer: [verb.bokmalInfinitive, verb.bokmalPresent, verb.bokmalPast].join(
        " / ",
      ),
    })),
    ...seedAdjectives.map((adjective) => ({
      id: `${adjective.id}-card`,
      label: "Adjektiv",
      theme: adjective.theme,
      prompt: adjective.german,
      task: "Erinnere dich an die Bokmål-Formen.",
      answer: [
        adjective.bokmalBase,
        adjective.bokmalNeuter,
        adjective.bokmalPlural,
        adjective.bokmalDefinite,
      ].join(" / "),
    })),
    ...seedOrdinals.map((ordinal) => ({
      id: `${ordinal.id}-card`,
      label: "Ordnungszahl",
      theme: ordinal.theme,
      prompt: `${ordinal.number}. ${ordinal.german}`,
      task: "Erinnere dich an die Bokmål-Ordnungszahl.",
      answer: ordinal.bokmal,
    })),
    ...seedSentences.map((sentence) => ({
      id: `${sentence.id}-card`,
      label: "Satz",
      theme: sentence.theme,
      prompt: sentence.germanPrompt,
      task: "Übersetze den Satz ins Bokmål.",
      answer: sentence.bokmalAnswer,
    })),
    ...userItems.map(mapUserItemToCard),
  ];
}

function shuffleCards(cards) {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCards[index], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
}

function getFlashcardPracticeKey(card) {
  return [card.label, card.answer, card.prompt]
    .map((value) => value.trim().toLocaleLowerCase("nb"))
    .join("|");
}

function getUniquePracticeCards(cards) {
  const seenCardKeys = new Set();

  return cards.filter((card) => {
    const cardKey = getFlashcardPracticeKey(card);

    if (seenCardKeys.has(cardKey)) {
      return false;
    }

    seenCardKeys.add(cardKey);
    return true;
  });
}

function makePracticeCards(cards, practiceSize) {
  const selectedPracticeSize =
    practiceSizeOptions.find((option) => option.id === practiceSize) ??
    practiceSizeOptions[0];

  if (!selectedPracticeSize.cardCount) {
    return cards;
  }

  return shuffleCards(getUniquePracticeCards(cards)).slice(
    0,
    selectedPracticeSize.cardCount,
  );
}

function Header() {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Bokmål üben</p>
        <h1>Bokmål Karten</h1>
      </div>
      <nav className="top-nav" aria-label="Hauptbereiche">
        {sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function StartSection() {
  return (
    <section className="start-grid" id="start">
      <article className="intro-card">
        <p className="eyebrow">Start</p>
        <h2>Heute kurz erinnern, prüfen, wiederholen.</h2>
        <p>Wähle eine einfache Übung mit dem ersten genehmigten Startinhalt.</p>
        <div className="button-row">
          <a className="button-primary" href="#karten">
            Karten starten
          </a>
          <a className="button-secondary" href="#wortschatz">
            Wortschatz ansehen
          </a>
        </div>
      </article>

      <div className="quick-options" aria-label="Schneller Zugriff">
        <article>
          <span>Karten</span>
          <strong>Deutsch &gt; Bokmål</strong>
        </article>
        <article>
          <span>Wortschatz</span>
          <strong>
            {seedNouns.length +
              seedVerbs.length +
              seedAdjectives.length +
              seedOrdinals.length}{" "}
            Einträge
          </strong>
        </article>
        <article>
          <span>Übungen</span>
          <strong>{seedSentences.length} Sätze</strong>
        </article>
        <article>
          <span>Meine Wörter</span>
          <strong>Neue Inhalte sammeln</strong>
        </article>
      </div>
    </section>
  );
}

function VocabularySection() {
  const { userItems } = useContext(UserContentContext);
  const [isVocabularyVisible, setIsVocabularyVisible] = useState(false);
  const sortedNouns = sortByBokmalText(
    [...seedNouns, ...userItems.filter((item) => item.type === "noun")],
    getNounSortText,
  );
  const sortedVerbs = sortByBokmalText(
    [...seedVerbs, ...userItems.filter((item) => item.type === "verb")],
    getVerbSortText,
  );
  const sortedAdjectives = sortByBokmalText(seedAdjectives, getAdjectiveSortText);
  const sortedOrdinals = sortByBokmalText(seedOrdinals, getOrdinalSortText);
  const sortedSentences = sortByBokmalText(
    [...seedSentences, ...userItems.filter((item) => item.type === "sentence")],
    (sentence) => sentence.bokmalAnswer,
  );

  return (
    <section className="content-section" id="wortschatz">
      <div className="section-heading">
        <p className="eyebrow">Wortschatz</p>
        <h2>Substantive, Verben, Adjektive und Ordnungszahlen</h2>
      </div>

      <button
        className="button-secondary"
        type="button"
        onClick={() => setIsVocabularyVisible((isVisible) => !isVisible)}
      >
        {isVocabularyVisible ? "Wortschatz ausblenden" : "Wortschatz anzeigen"}
      </button>

      {isVocabularyVisible && (
        <div className="vocabulary-grid">
          <article className="data-card">
            <h3>Substantive</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Deutsch</th>
                    <th>Singular</th>
                    <th>Bestimmt Singular</th>
                    <th>Plural</th>
                    <th>Bestimmt Plural</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNouns.map((noun) => (
                    <tr key={noun.id}>
                      <td>
                        <span className="theme-pill">{noun.theme}</span>
                        {noun.german}
                      </td>
                      <td>{noun.bokmalSingular}</td>
                      <td>{noun.bokmalSingularDefinite}</td>
                      <td>{noun.bokmalPlural}</td>
                      <td>{noun.bokmalPluralDefinite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="data-card">
            <h3>Verben</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Deutsch</th>
                    <th>Infinitiv</th>
                    <th>Präsens</th>
                    <th>Vergangenheit</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVerbs.map((verb) => (
                    <tr key={verb.id}>
                      <td>
                        <span className="theme-pill">{verb.theme}</span>
                        {verb.german}
                      </td>
                      <td>{verb.bokmalInfinitive}</td>
                      <td>{verb.bokmalPresent}</td>
                      <td>{verb.bokmalPast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="data-card">
            <h3>Adjektive</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Deutsch</th>
                    <th>Grundform</th>
                    <th>Neutrum</th>
                    <th>Plural</th>
                    <th>Bestimmt</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAdjectives.map((adjective) => (
                    <tr key={adjective.id}>
                      <td>
                        <span className="theme-pill">{adjective.theme}</span>
                        {adjective.german}
                      </td>
                      <td>{adjective.bokmalBase}</td>
                      <td>{adjective.bokmalNeuter}</td>
                      <td>{adjective.bokmalPlural}</td>
                      <td>{adjective.bokmalDefinite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="data-card">
            <h3>Ordnungszahlen</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Zahl</th>
                    <th>Deutsch</th>
                    <th>Bokmål</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrdinals.map((ordinal) => (
                    <tr key={ordinal.id}>
                      <td>{ordinal.number}</td>
                      <td>
                        <span className="theme-pill">{ordinal.theme}</span>
                        {ordinal.german}
                      </td>
                      <td>{ordinal.bokmal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="data-card">
            <h3>Sätze</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Deutsch</th>
                    <th>Bokmål</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSentences.map((sentence) => (
                    <tr key={sentence.id}>
                      <td>
                        <span className="theme-pill">{sentence.theme}</span>
                        {sentence.germanPrompt}
                      </td>
                      <td>{sentence.bokmalAnswer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function FlashcardsSection() {
  const { flashcardItems } = useContext(UserContentContext);
  const [activeFilter, setActiveFilter] = useState("all");
  const [practiceSize, setPracticeSize] = useState("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const selectedFilter =
    cardFilters.find((filter) => filter.id === activeFilter) ?? cardFilters[0];
  const filteredCards = useMemo(
    () =>
      selectedFilter.cardLabel
        ? flashcardItems.filter((card) => card.label === selectedFilter.cardLabel)
        : flashcardItems,
    [flashcardItems, selectedFilter.cardLabel],
  );
  const practiceCards = useMemo(
    () => makePracticeCards(filteredCards, practiceSize),
    [filteredCards, practiceSize],
  );
  const currentCardIndex =
    practiceCards.length > 0
      ? Math.min(cardIndex, practiceCards.length - 1)
      : 0;
  const currentCard = practiceCards[currentCardIndex];

  useEffect(() => {
    setCardIndex(0);
    setIsAnswerChecked(false);
    setTypedAnswer("");
  }, [activeFilter, flashcardItems, practiceSize]);

  function resetAnswerState() {
    setIsAnswerChecked(false);
    setTypedAnswer("");
  }

  function changeFilter(filterId) {
    setActiveFilter(filterId);
    setCardIndex(0);
    resetAnswerState();
  }

  function changePracticeSize(sizeId) {
    setPracticeSize(sizeId);
    setCardIndex(0);
    resetAnswerState();
  }

  function showPreviousCard() {
    setCardIndex((index) => Math.max(index - 1, 0));
    resetAnswerState();
  }

  function showNextCard() {
    setCardIndex((index) => Math.min(index + 1, practiceCards.length - 1));
    resetAnswerState();
  }

  return (
    <section className="content-section card-practice" id="karten">
      <div className="section-heading">
        <p className="eyebrow">Karten</p>
        <h2>Deutsch sehen, Bokmål erinnern.</h2>
      </div>

      <div className="filter-buttons" aria-label="Kartentyp filtern">
        {cardFilters.map((filter) => (
          <button
            className={
              filter.id === activeFilter
                ? "filter-button filter-button-active"
                : "filter-button"
            }
            key={filter.id}
            type="button"
            onClick={() => changeFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <label className="practice-size-control">
        <span>Übungsumfang</span>
        <select
          value={practiceSize}
          onChange={(event) => changePracticeSize(event.target.value)}
        >
          {practiceSizeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <article className="flashcard" aria-live="polite">
        <div className="card-topline">
          <span className="theme-pill">{currentCard.label}</span>
          <span>
            Karte {currentCardIndex + 1} von {practiceCards.length}
          </span>
        </div>
        <p className="card-task">{currentCard.task}</p>
        <h3>{currentCard.prompt}</h3>
        <p className="card-theme">{currentCard.theme}</p>
        <label className="answer-field">
          <span>Meine Antwort</span>
          <input
            type="text"
            value={typedAnswer}
            onChange={(event) => setTypedAnswer(event.target.value)}
          />
        </label>
        {isAnswerChecked && (
          <div className="comparison-grid">
            <section className="answer-panel">
              <span>Meine Antwort</span>
              <p>{typedAnswer || "Keine Antwort eingegeben."}</p>
            </section>
            <section className="answer-panel">
              <span>Korrekte Antwort</span>
              <p>{currentCard.answer}</p>
            </section>
          </div>
        )}
        <div className="button-row">
          <button
            className="button-primary"
            type="button"
            onClick={() => setIsAnswerChecked(true)}
          >
            Antwort prüfen
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={showPreviousCard}
            disabled={currentCardIndex === 0}
          >
            Vorherige Karte
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={showNextCard}
            disabled={currentCardIndex === practiceCards.length - 1}
          >
            Nächste Karte
          </button>
        </div>
      </article>
    </section>
  );
}

function MyWordsSection() {
  const { addUserItem, deleteUserItem, importUserItems, userItems } =
    useContext(UserContentContext);
  const [selectedType, setSelectedType] = useState("noun");
  const [formValues, setFormValues] = useState(makeEmptyUserForm);
  const [importStatus, setImportStatus] = useState("");
  const activeFields = userWordFields[selectedType];
  const groupedUserItems = [
    {
      title: "Substantive",
      items: sortByBokmalText(
        userItems.filter((item) => item.type === "noun"),
        getNounSortText,
      ),
    },
    {
      title: "Verben",
      items: sortByBokmalText(
        userItems.filter((item) => item.type === "verb"),
        getVerbSortText,
      ),
    },
    {
      title: "Sätze",
      items: sortByBokmalText(
        userItems.filter((item) => item.type === "sentence"),
        (sentence) => sentence.bokmalAnswer,
      ),
    },
  ];

  function updateField(fieldName, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  }

  function changeType(nextType) {
    setSelectedType(nextType);
    setFormValues(makeEmptyUserForm());
  }

  function handleSubmit(event) {
    event.preventDefault();

    const baseItem = {
      id: `user-${selectedType}-${Date.now()}`,
      type: selectedType,
      theme: "Meine Wörter",
    };

    const newItem = activeFields.reduce(
      (item, field) => ({
        ...item,
        [field.name]: formValues[field.name].trim(),
      }),
      baseItem,
    );

    addUserItem(newItem);
    setFormValues(makeEmptyUserForm());
  }

  function exportUserItems() {
    const fileContents = JSON.stringify(userItems, null, 2);
    const blob = new Blob([fileContents], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);
    const timePart = `${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    downloadLink.href = url;
    downloadLink.download = `bokmal-content-${datePart}-${timePart}.json`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  async function importUserItemsFromFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      const importedItems = JSON.parse(fileText);

      if (
        !Array.isArray(importedItems) ||
        !importedItems.every(isValidImportedItem)
      ) {
        setImportStatus("Die Datei enthält keine gültigen Meine Wörter-Daten.");
        return;
      }

      importUserItems(importedItems);
      setImportStatus(`${importedItems.length} Einträge importiert.`);
    } catch {
      setImportStatus("Die Datei konnte nicht importiert werden.");
    } finally {
      event.target.value = "";
    }
  }

  function getItemPrompt(item) {
    return item.type === "sentence" ? item.germanPrompt : item.german;
  }

  function getItemAnswer(item) {
    if (item.type === "noun") {
      return [
        item.bokmalSingular,
        item.bokmalSingularDefinite,
        item.bokmalPlural,
        item.bokmalPluralDefinite,
      ].join(" / ");
    }

    if (item.type === "verb") {
      return [item.bokmalInfinitive, item.bokmalPresent, item.bokmalPast].join(
        " / ",
      );
    }

    return item.bokmalAnswer;
  }

  return (
    <section className="content-section" id="meine-woerter">
      <div className="section-heading">
        <p className="eyebrow">Meine Wörter</p>
        <h2>Eigene Inhalte</h2>
      </div>

      <article className="data-card user-content-card">
        <div className="import-export-row">
          <button
            className="button-secondary"
            type="button"
            onClick={exportUserItems}
          >
            Exportieren
          </button>
          <label className="import-button">
            <span>Importieren</span>
            <input
              accept="application/json"
              type="file"
              onChange={importUserItemsFromFile}
            />
          </label>
        </div>
        {importStatus && <p className="import-status">{importStatus}</p>}

        <form className="user-word-form" onSubmit={handleSubmit}>
          <label>
            <span>Typ</span>
            <select
              value={selectedType}
              onChange={(event) => changeType(event.target.value)}
            >
              <option value="noun">Substantiv</option>
              <option value="verb">Verb</option>
              <option value="sentence">Satz</option>
            </select>
          </label>

          <div className="user-field-grid">
            {activeFields.map((field) => (
              <label key={field.name}>
                <span>{field.label}</span>
                <input
                  required
                  type="text"
                  value={formValues[field.name]}
                  onChange={(event) => updateField(field.name, event.target.value)}
                />
              </label>
            ))}
          </div>

          <button className="button-primary" type="submit">
            Hinzufügen
          </button>
        </form>

        <div className="user-items">
          <h3>Gespeicherte Inhalte</h3>
          {userItems.length === 0 ? (
            <p className="empty-state">Noch keine eigenen Inhalte.</p>
          ) : (
            <div className="user-item-groups">
              {groupedUserItems.map((group) => (
                <section className="user-item-group" key={group.title}>
                  <h4>{group.title}</h4>
                  {group.items.length === 0 ? (
                    <p className="empty-state">Keine Einträge.</p>
                  ) : (
                    <div className="user-item-list">
                      {group.items.map((item) => (
                        <article className="user-item" key={item.id}>
                          <div>
                            <span className="theme-pill">
                              {userTypeLabels[item.type]}
                            </span>
                            <strong>{getItemPrompt(item)}</strong>
                            <p>{getItemAnswer(item)}</p>
                          </div>
                          <button
                            className="button-secondary"
                            type="button"
                            onClick={() => deleteUserItem(item.id)}
                          >
                            Löschen
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function SentencePracticeSection() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const currentSentence = seedSentences[sentenceIndex];

  function showNextSentence() {
    setSentenceIndex((index) => (index + 1) % seedSentences.length);
    setIsAnswerVisible(false);
    setTypedAnswer("");
  }

  return (
    <section className="content-section card-practice" id="uebungen">
      <div className="section-heading">
        <p className="eyebrow">Übungen</p>
        <h2>Sätze</h2>
      </div>

      <article className="flashcard" aria-live="polite">
        <div className="card-topline">
          <span className="theme-pill">{currentSentence.theme}</span>
          <span>
            {sentenceIndex + 1} / {seedSentences.length}
          </span>
        </div>
        <p className="card-task">Übersetze den Satz ins Bokmål.</p>
        <h3>{currentSentence.germanPrompt}</h3>
        <label className="answer-field">
          <span>Deine Antwort auf Bokmål</span>
          <textarea
            value={typedAnswer}
            onChange={(event) => setTypedAnswer(event.target.value)}
            rows="4"
          />
        </label>
        {isAnswerVisible && (
          <div className="comparison-grid">
            <section className="answer-panel">
              <span>Meine Antwort</span>
              <p>{typedAnswer || "Keine Antwort eingegeben."}</p>
            </section>
            <section className="answer-panel">
              <span>Musterantwort</span>
              <p>{currentSentence.bokmalAnswer}</p>
            </section>
          </div>
        )}
        <div className="button-row">
          <button
            className="button-primary"
            type="button"
            onClick={() => setIsAnswerVisible(true)}
          >
            Antwort zeigen
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={showNextSentence}
          >
            Nächster Satz
          </button>
        </div>
      </article>
    </section>
  );
}

function HomeworkSection() {
  const {
    addHomeworkEntry,
    deleteHomeworkEntry,
    homeworkEntries,
    importHomeworkEntries,
    updateHomeworkEntry,
  } = useContext(HomeworkContentContext);
  const [selectedDate, setSelectedDate] = useState(getTodayDateInputValue);
  const [homeworkText, setHomeworkText] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const selectedHomeworkEntries = homeworkEntries
    .filter((entry) => entry.date === selectedDate)
    .sort((firstEntry, secondEntry) =>
      secondEntry.createdAt.localeCompare(firstEntry.createdAt),
    );
  const displayDate = selectedDate
    ? new Intl.DateTimeFormat("de-DE").format(
        new Date(`${selectedDate}T00:00:00`),
      )
    : "kein Datum";

  function saveHomeworkEntry(event) {
    event.preventDefault();

    const trimmedText = homeworkText.trim();

    if (!selectedDate || !trimmedText) {
      return;
    }

    addHomeworkEntry({
      id: `homework-${Date.now()}`,
      date: selectedDate,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    });
    setHomeworkText("");
  }

  function startEditingHomeworkEntry(entry) {
    setEditingEntryId(entry.id);
    setEditingText(entry.text);
  }

  function cancelEditingHomeworkEntry() {
    setEditingEntryId(null);
    setEditingText("");
  }

  function saveEditedHomeworkEntry(event) {
    event.preventDefault();

    const trimmedText = editingText.trim();

    if (!editingEntryId || !trimmedText) {
      return;
    }

    updateHomeworkEntry(editingEntryId, trimmedText);
    cancelEditingHomeworkEntry();
  }

  function deleteSelectedHomeworkEntry(entryId) {
    deleteHomeworkEntry(entryId);

    if (editingEntryId === entryId) {
      cancelEditingHomeworkEntry();
    }
  }

  function exportHomeworkEntries() {
    const fileContents = JSON.stringify(homeworkEntries, null, 2);
    const blob = new Blob([fileContents], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);
    const timePart = `${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    downloadLink.href = url;
    downloadLink.download = `bokmal-hausaufgaben-${datePart}-${timePart}.json`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  async function importHomeworkEntriesFromFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      const importedEntries = JSON.parse(fileText);

      if (
        !Array.isArray(importedEntries) ||
        !importedEntries.every(isValidHomeworkEntry)
      ) {
        setImportStatus("Die Datei enthält keine gültigen Hausaufgaben-Daten.");
        return;
      }

      importHomeworkEntries(importedEntries);
      setImportStatus(`${importedEntries.length} Einträge importiert.`);
    } catch {
      setImportStatus("Die Datei konnte nicht importiert werden.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <section className="content-section" id="hausaufgaben">
      <div className="section-heading">
        <p className="eyebrow">Hausaufgaben</p>
        <h2>Notizen für den Unterricht</h2>
      </div>

      <article className="data-card homework-card">
        <div className="import-export-row">
          <button
            className="button-secondary"
            type="button"
            onClick={exportHomeworkEntries}
          >
            Exportieren
          </button>
          <label className="import-button">
            <span>Importieren</span>
            <input
              accept="application/json"
              type="file"
              onChange={importHomeworkEntriesFromFile}
            />
          </label>
        </div>
        {importStatus && <p className="import-status">{importStatus}</p>}

        <form className="homework-form" onSubmit={saveHomeworkEntry}>
          <label>
            <span>Datum</span>
            <input
              required
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>
          <label>
            <span>Materialien</span>
            <textarea
              required
              rows="8"
              value={homeworkText}
              onChange={(event) => setHomeworkText(event.target.value)}
            />
          </label>
          <button className="button-primary" type="submit">
            Speichern
          </button>
        </form>

        <section className="homework-materials" aria-live="polite">
          <h3>Materialien für {displayDate}</h3>
          {selectedHomeworkEntries.length === 0 ? (
            <p className="empty-state">
              Noch keine Materialien für dieses Datum.
            </p>
          ) : (
            <div className="homework-entry-list">
              {selectedHomeworkEntries.map((entry) => (
                <article className="homework-entry" key={entry.id}>
                  <time dateTime={entry.createdAt}>
                    {new Intl.DateTimeFormat("de-DE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(entry.createdAt))}
                  </time>
                  {editingEntryId === entry.id ? (
                    <form
                      className="homework-edit-form"
                      onSubmit={saveEditedHomeworkEntry}
                    >
                      <label>
                        <span>Materialien bearbeiten</span>
                        <textarea
                          required
                          rows="6"
                          value={editingText}
                          onChange={(event) => setEditingText(event.target.value)}
                        />
                      </label>
                      <div className="button-row">
                        <button className="button-primary" type="submit">
                          Speichern
                        </button>
                        <button
                          className="button-secondary"
                          type="button"
                          onClick={cancelEditingHomeworkEntry}
                        >
                          Abbrechen
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>{entry.text}</p>
                      <div className="button-row">
                        <button
                          className="button-secondary"
                          type="button"
                          onClick={() => startEditingHomeworkEntry(entry)}
                        >
                          Bearbeiten
                        </button>
                        <button
                          className="button-secondary"
                          type="button"
                          onClick={() => deleteSelectedHomeworkEntry(entry.id)}
                        >
                          Löschen
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </article>
    </section>
  );
}

function PlaceholderSections() {
  return (
    <section className="section-strip">
      <article id="fortschritt">
        <p className="eyebrow">Fortschritt</p>
        <h2>Einfacher Überblick</h2>
        <p>Karten, Antworten und Wiederholung bleiben bewusst klein.</p>
      </article>
    </section>
  );
}

function App() {
  const [userItems, setUserItems] = useState(getInitialUserItems);
  const [homeworkEntries, setHomeworkEntries] = useState(
    getInitialHomeworkEntries,
  );
  const flashcardItems = useMemo(() => makeCards(userItems), [userItems]);

  useEffect(() => {
    window.localStorage.setItem(USER_CONTENT_KEY, JSON.stringify(userItems));
  }, [userItems]);

  useEffect(() => {
    window.localStorage.setItem(
      HOMEWORK_CONTENT_KEY,
      JSON.stringify(homeworkEntries),
    );
  }, [homeworkEntries]);

  function addUserItem(newItem) {
    setUserItems((currentItems) => [...currentItems, newItem]);
  }

  function deleteUserItem(itemId) {
    setUserItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }

  function importUserItems(importedItems) {
    setUserItems(importedItems);
  }

  function addHomeworkEntry(newEntry) {
    setHomeworkEntries((currentEntries) => [...currentEntries, newEntry]);
  }

  function deleteHomeworkEntry(entryId) {
    setHomeworkEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== entryId),
    );
  }

  function updateHomeworkEntry(entryId, updatedText) {
    setHomeworkEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === entryId ? { ...entry, text: updatedText } : entry,
      ),
    );
  }

  function importHomeworkEntries(importedEntries) {
    setHomeworkEntries(importedEntries);
  }

  const userContentValue = {
    addUserItem,
    deleteUserItem,
    flashcardItems,
    importUserItems,
    userItems,
  };

  const homeworkContentValue = {
    addHomeworkEntry,
    deleteHomeworkEntry,
    homeworkEntries,
    importHomeworkEntries,
    updateHomeworkEntry,
  };

  return (
    <UserContentContext.Provider value={userContentValue}>
      <HomeworkContentContext.Provider value={homeworkContentValue}>
        <main className="app-shell">
          <Header />
          <StartSection />
          <VocabularySection />
          <FlashcardsSection />
          <SentencePracticeSection />
          <HomeworkSection />
          <MyWordsSection />
          <PlaceholderSections />
        </main>
      </HomeworkContentContext.Provider>
    </UserContentContext.Provider>
  );
}

export default App;
