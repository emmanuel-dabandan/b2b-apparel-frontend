// src/components/EditPayment.jsx
import { useState } from 'react';

export default function EditPayment({ paymentData, onSave, onCancel }) {
  const [expiry, setExpiry] = useState(paymentData.expiry || '');
  const [isDefault, setIsDefault] = useState(paymentData.is_default || false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSave(paymentData.id, { expiry, is_default: isDefault });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center pb-5 animate-view">
      <div className="col-lg-8 mt-4">
        <button className="btn btn-link text-body text-decoration-none px-0 mb-3 fw-semibold" onClick={onCancel}>
          <i className="bi bi-arrow-left me-2"></i> Back
        </button>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body border">
          <div className="card-header bg-dark text-white fw-bold py-3">
            <i className="bi bi-pencil-square me-2"></i>Edit Payment Method
          </div>
          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger py-2 small fw-bold"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Card Type & Number</label>
                <input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-muted" value={`${paymentData.type} ending in ${paymentData.last4}`} disabled />
                <div className="form-text small mt-1 text-muted">Card numbers cannot be changed. To update a card number, please delete this payment method and add a new one.</div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Expiry Date</label>
                <input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" placeholder="MM/YY" maxLength="5" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
              </div>

              <div className="mb-4 form-check">
                <input type="checkbox" className="form-check-input shadow-none" id="editDefaultPayment" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                <label className="form-check-label small fw-semibold text-muted" htmlFor="editDefaultPayment">Set as default payment method</label>
              </div>
              
              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" className="btn btn-outline-secondary fw-semibold px-4 rounded-pill" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary fw-semibold px-5 rounded-pill d-flex align-items-center gap-2" disabled={isLoading}>
                  {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}