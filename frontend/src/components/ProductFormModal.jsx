import { useEffect, useId, useRef, useState } from 'react';

export default function ProductFormModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const titleId = useId();
  const nameId = useId();
  const priceId = useId();
  const helpId = useId();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setName(isEdit && initialProduct ? initialProduct.name : '');
      setPrice(isEdit && initialProduct ? String(initialProduct.price) : '');
      setError('');
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, isEdit, initialProduct]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);

    let handleBackdropClick;
    if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
      handleBackdropClick = (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isDialogContent) dialog.close();
      };
      dialog.addEventListener('click', handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      if (handleBackdropClick) dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const numPrice = Number(price);

    if (!trimmedName) {
      setError('Nama produk wajib diisi.');
      nameRef.current?.focus();
      return;
    }
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      setError('Harga harus lebih dari 0.');
      priceRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        id: isEdit ? initialProduct?.id : undefined,
        name: trimmedName,
        price: numPrice,
      });
      dialogRef.current?.close();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} {...{ closedby: 'any' }}>
      <div className="modal-header">
        <div>
          <h2 id={titleId}>{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <p className="modal-subtitle">
            {isEdit ? 'Perbarui informasi produk yang dipilih.' : 'Masukkan informasi produk baru.'}
          </p>
          {isEdit && initialProduct && <p className="card-id modal-id">ID: {initialProduct.id}</p>}
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={() => dialogRef.current?.close()}
          aria-label="Tutup dialog"
        >
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor={nameId}>Nama Produk</label>
          <input
            ref={nameRef}
            type="text"
            id={nameId}
            name="name"
            placeholder={isEdit ? undefined : 'Contoh: Pulpen'}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            required
          />
        </div>
        <div className="field">
          <label htmlFor={priceId}>Harga (Rp)</label>
          <input
            ref={priceRef}
            type="number"
            id={priceId}
            name="price"
            placeholder={isEdit ? undefined : 'Contoh: 5000'}
            min="1"
            aria-describedby={helpId}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setError('');
            }}
            required
          />
          <span id={helpId} className="field-hint">
            Harga harus lebih dari 0.
          </span>
        </div>
        <p className="form-error" role="status" aria-live="polite">
          {error}
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={() => dialogRef.current?.close()}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
