const rupiahFormatter = new Intl.NumberFormat('id-ID');
export const formatRupiah = (price) => `Rp${rupiahFormatter.format(Number(price) || 0)}`;

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <section className="product-grid" aria-label="Daftar produk">
      {products.map((product) => (
        <article key={product.id} className="product-card">
          <p className="card-id">ID: {product.id}</p>
          <strong className="card-title">{product.name}</strong>
          <span className="card-price">{formatRupiah(product.price)}</span>
          <div className="card-actions">
            <button type="button" className="btn btn-outline" onClick={() => onEdit(product)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger-outline" onClick={() => onDelete(product)}>
              Hapus
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
