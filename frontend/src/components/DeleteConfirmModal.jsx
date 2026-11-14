import { useEffect, useId, useRef, useState } from 'react';
import { formatRupiah } from './ProductList.jsx';

export default function DeleteConfirmModal({ open, product, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && product) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, product]);

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

  const handleConfirm = async () => {
    if (!product) return;
    setDeleting(true);
    try {
      await onConfirm(product.id);
      dialogRef.current?.close();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} {...{ closedby: 'any' }}>
      <button
        type="button"
        className="btn-close btn-close-floating"
        onClick={() => dialogRef.current?.close()}
        aria-label="Tutup dialog"
      >
        ×
      </button>
      <div className="delete-modal-body">
        <div className="trash-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 id={titleId}>Hapus Produk?</h2>
        <p className="modal-subtitle">Produk yang dihapus tidak dapat dikembalikan.</p>
        <div className="delete-preview">
          <span className="card-id">ID: {product?.id ?? '-'}</span>
          <strong className="card-title">{product?.name ?? '-'}</strong>
          <span className="card-price">{formatRupiah(product?.price ?? 0)}</span>
        </div>
        <div className="modal-actions modal-actions-full">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger-solid"
            onClick={handleConfirm}
            disabled={deleting}
          >
            Hapus Produk
          </button>
        </div>
      </div>
    </dialog>
  );
}
