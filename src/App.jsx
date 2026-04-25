import { useMemo, useState } from "react";
import { seedNouns, seedSentences, seedVerbs } from "./data/seedContent";
import "./App.css";

const sections = [
  "Start",
  "Wortschatz",
  "Karten",
  "Übungen",
  "Meine Wörter",
  "Fortschritt",
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

function App() {
  const cards = useMemo(makeCards, []);
  const [cardIndex, setCardIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const currentCard = cards[cardIndex];

  function showNextCard() {
    setCardIndex((index) => (index + 1) % cards.length);
    setIsAnswerVisible(false);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Bokmål üben</p>
          <h1>Bokmål Karten</h1>
        </div>
        <nav className="top-nav" aria-label="Hauptbereiche">
          {sections.map((section) => (
            <a href={`#${section.toLowerCase().replaceAll(" ", "-")}`} key={section}>
              {section}
            </a>
          ))}
        </nav>
      </header>

      <section className="start-grid" id="start">
        <article className="intro-card">
          <p className="eyebrow">Start</p>
          <h2>Heute kurz erinnern, prüfen, wiederholen.</h2>
          <p>
            Wähle eine einfache Übung mit dem ersten genehmigten Startinhalt.
          </p>
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

      <section className="content-section card-practice" id="karten">
        <div className="section-heading">
          <p className="eyebrow">Karten</p>
          <h2>Deutsch sehen, Bokmål erinnern.</h2>
        </div>

        <article className="flashcard" aria-live="polite">
          <div className="card-topline">
            <span className="theme-pill">{currentCard.label}</span>
            <span>
              {cardIndex + 1} / {cards.length}
            </span>
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

      <section className="content-section" id="übungen">
        <div className="section-heading">
          <p className="eyebrow">Übungen</p>
          <h2>Sätze</h2>
        </div>
        <div className="sentence-list">
          {seedSentences.slice(0, 6).map((sentence) => (
            <article className="sentence-card" key={sentence.id}>
              <span className="theme-pill">{sentence.theme}</span>
              <p>{sentence.germanPrompt}</p>
              <strong>{sentence.bokmalAnswer}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-strip" id="meine-wörter">
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
    </main>
  );
}

export default App;
