import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

const API_BASE = `${API_BASE_URL}/api/products`;

export default function ProductList({ products: propProducts, onRefresh }) {
  const [internalProducts, setInternalProducts] = useState([]);
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState(null);

  // Normalize products whether received as raw array or API response wrapper { success, data }
  const normalizeData = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (Array.isArray(input.data)) return input.data;
    return [];
  };

  // Determine current active product list
  const products = propProducts !== undefined ? normalizeData(propProducts) : internalProducts;

  // New Product Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const list = normalizeData(data);
      setInternalProducts(list);
      if (onRefresh) onRefresh(list);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to backend server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propProducts === undefined) {
      fetchProducts();
    }
  }, [propProducts]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          price: parseFloat(price) || 0,
          category,
          description: description.trim(),
          inStock
        })
      });
      const data = await res.json();
      if (data.success) {
        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setInStock(true);
        // Refresh product list
        fetchProducts();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert('Error creating product. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(item => item.id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Failed to connect to backend server.');
    }
  };

  return (
    <div className="product-container">
      {/* Create Product Card */}
      <div className="form-card">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Wireless Ergonomic Mouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Apparel">Apparel</option>
                <option value="Software">Software</option>
                <option value="Books">Books</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="2"
              placeholder="Short product highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              In Stock & Ready to Ship
            </label>
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : '+ Add Product'}
          </button>
        </form>
      </div>

      {/* Product List Section */}
      <div className="list-section">
        <div className="list-header">
          <h2>Product Catalog ({products.length})</h2>
          <button className="btn-refresh" onClick={fetchProducts}>
            🔄 Refresh List
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={fetchProducts}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading products from backend...</div>
        ) : products.length === 0 && !error ? (
          <div className="empty-state">No products found. Add your first product above!</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <span className="product-category">{product.category || 'General'}</span>
                  <span className={`stock-badge ${product.inStock ? 'instock' : 'outstock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <h3 className="product-title">{product.name || product.title}</h3>
                <p className="product-desc">{product.description || 'No description provided.'}</p>

                <div className="product-footer">
                  <span className="product-price">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                    title="Delete product"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
