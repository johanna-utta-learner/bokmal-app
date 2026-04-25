import "./App.css";

function App() {
  return (
    <main className="app">
      <section className="hero">
        <h1>Bokmål Learning App</h1>
        <p>Flashcards, tests, grammar and vocabulary practice.</p>
      </section>

      <section className="menu">
        <button>Flashcards</button>
        <button>Vocabulary</button>
        <button>Grammar</button>
        <button>Tests</button>
      </section>

      <section className="workspace">
        <h2>Welcome</h2>
        <p>Choose a section to begin.</p>
      </section>
    </main>
  );
}

export default App;
