import { useState } from "react";
import { seedNouns, seedSentences, seedVerbs } from "./data/seedContent";
import "./App.css";

const sections = [
  { id: "start", label: "Start" },
  { id: "wortschatz", label: "Wortschatz" },
  { id: "karten", label: "Karten" },
  { id: "uebungen", label: "Übungen" },
  { id: "meine-woerter", label: "Meine Wörter" },
  { id: "fortschritt", label: "Fortschritt" },
];

const cardFilters = [
  { id: "all", label: "Alle", cardLabel: null },
  { id: "nouns", label: "Substantive", cardLabel: "Substantiv" },
  { id: "verbs", label: "Verben", cardLabel: "Verb" },
  { id: "sentences", label: "Sätze", cardLabel: "Satz" },
];

function makeCards() {
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
    ...seedSentences.map((sentence) => ({
      id: `${sentence.id}-card`,
      label: "Satz",
      theme: sentence.theme,
      prompt: sentence.germanPrompt,
      task: "Übersetze den Satz ins Bokmål.",
      answer: sentence.bokmalAnswer,
    })),
  ];
}

const flashcardItems = makeCards();

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
          <strong>{seedNouns.length + seedVerbs.length} Einträge</strong>
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
  return (
    <section className="content-section" id="wortschatz">
      <div className="section-heading">
        <p className="eyebrow">Wortschatz</p>
        <h2>Substantive und Verben</h2>
      </div>

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
                {seedNouns.map((noun) => (
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
                {seedVerbs.map((verb) => (
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
      </div>
    </section>
  );
}

function FlashcardsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const selectedFilter = cardFilters.find((filter) => filter.id === activeFilter);
  const filteredCards = selectedFilter.cardLabel
    ? flashcardItems.filter((card) => card.label === selectedFilter.cardLabel)
    : flashcardItems;
  const currentCard = filteredCards[cardIndex];

  function changeFilter(filterId) {
    setActiveFilter(filterId);
    setCardIndex(0);
    setIsAnswerVisible(false);
  }

  function showNextCard() {
    setCardIndex((index) => (index + 1) % filteredCards.length);
    setIsAnswerVisible(false);
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

      <article className="flashcard" aria-live="polite">
        <div className="card-topline">
          <span className="theme-pill">{currentCard.label}</span>
          <span>Karte {cardIndex + 1} von {filteredCards.length}</span>
        </div>
        <p className="card-task">{currentCard.task}</p>
        <h3>{currentCard.prompt}</h3>
        <p className="card-theme">{currentCard.theme}</p>
        <div className="answer-panel">
          {isAnswerVisible ? currentCard.answer : "Antwort ist verdeckt"}
        </div>
        <div className="button-row">
          <button
            className="button-primary"
            type="button"
            onClick={() => setIsAnswerVisible(true)}
          >
            Antwort zeigen
          </button>
          <button className="button-secondary" type="button" onClick={showNextCard}>
            Nächste Karte
          </button>
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

function PlaceholderSections() {
  return (
    <section className="section-strip" id="meine-woerter">
      <article>
        <p className="eyebrow">Meine Wörter</p>
        <h2>Eigene Inhalte</h2>
        <p>Neue Substantive, Verben, Sätze und Korrekturen sammeln.</p>
      </article>
      <article id="fortschritt">
        <p className="eyebrow">Fortschritt</p>
        <h2>Einfacher Überblick</h2>
        <p>Karten, Antworten und Wiederholung bleiben bewusst klein.</p>
      </article>
    </section>
  );
}

function App() {
  return (
    <main className="app-shell">
      <Header />
      <StartSection />
      <VocabularySection />
      <FlashcardsSection />
      <SentencePracticeSection />
      <PlaceholderSections />
    </main>
  );
}

export default App;
