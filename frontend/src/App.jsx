import ProductList from './ProductList'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">📦</span>
          <span className="brand-name">ProductHub</span>
        </div>
        <div className="header-status">
          <span className="pulse-dot"></span>
          <span>Live API Connection</span>
        </div>
      </header>

      <main className="app-main">
        <section className="hero-banner">
          <h1>Fullstack Product Dashboard</h1>
          <p>Real-time data synchronization between Express backend and React frontend</p>
        </section>

        <ProductList />
      </main>

      <footer className="app-footer">
        <p>Fullstack Express + React App • Powered by Node.js & Vite</p>
      </footer>
    </div>
  )
}

export default App
