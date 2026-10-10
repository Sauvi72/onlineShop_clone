import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const json = await response.json();
      
      // Backend returns { success: true, count: 14, data: [...] }
      const items = Array.isArray(json) ? json : (json.data || []);
      setProducts(items);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">📦</span>
          <span className="brand-name">ProductHub</span>
        </div>
        <div className="header-status">
          <span className="pulse-dot"></span>
          <span>{loading ? 'Connecting...' : 'API Connected'}</span>
        </div>
      </header>

      <main className="app-main">
        <section className="hero-banner">
          <h1>Fullstack Product Dashboard</h1>
          <p>Real-time data synchronization between Express backend and React frontend</p>
        </section>

        {error && (
          <div className="error-banner" style={{ margin: '0 auto 20px auto', maxWidth: '1000px' }}>
            <span>⚠️ {error}</span>
            <button onClick={getData}>Retry</button>
          </div>
        )}

        <ProductList products={products} onRefresh={getData} />
      </main>

      <footer className="app-footer">
        <p>Fullstack Express + React App • Connected to {API_BASE_URL}</p>
      </footer>
    </div>
  );
}

export default App;

