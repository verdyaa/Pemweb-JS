import { useCallback, useEffect, useId, useState } from 'react';
import ProductList from './components/ProductList.jsx';
import ProductFormModal from './components/ProductFormModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/products';

export default function App() {
  const searchId = useId();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formModal, setFormModal] = useState({ open: false, mode: 'add', product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = useCallback(async () => {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : products;

  const handleSaveProduct = async ({ id, name, price }) => {
    const isEdit = Boolean(id);
    const res = await fetch(isEdit ? `${API_URL}/${id}` : API_URL, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? { id, name, price } : { name, price }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Gagal menyimpan produk.');
    }
    await fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const closeFormModal = useCallback(() => {
    setFormModal((prev) => (prev.open ? { ...prev, open: false } : prev));
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>Manajemen Produk</h1>
          <p className="subtitle">Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setFormModal({ open: true, mode: 'add', product: null })}
        >
          + Tambah Produk
        </button>
      </header>

      <section className="toolbar">
        <search className="search-box">
          <label htmlFor={searchId} className="visually-hidden">
            Cari nama produk
          </label>
          <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            id={searchId}
            name="q"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
        </search>
        <span className="count-text" role="status" aria-live="polite">
          {products.length} produk
        </span>
      </section>

      <ProductList
        products={filteredProducts}
        onEdit={(product) => setFormModal({ open: true, mode: 'edit', product })}
        onDelete={(product) => setDeleteTarget(product)}
      />

      <footer className="page-footer">
        <p className="count-text">
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </p>
      </footer>

      <ProductFormModal
        open={formModal.open}
        mode={formModal.mode}
        initialProduct={formModal.product}
        onClose={closeFormModal}
        onSubmit={handleSaveProduct}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        product={deleteTarget}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
      />
    </main>
  );
}
