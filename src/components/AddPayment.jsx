// src/components/AddPayment.jsx
import { useState } from 'react';

export default function AddPayment({ onSave, onCancel }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation to simulate a real payment gateway
    const cleanedCard = cardNumber.replace(/\D/g, '');
    if (cleanedCard.length < 15 || cleanedCard.length > 16) {
      setError("Please enter a valid 15 or 16 digit card number.");
      setIsLoading(false);
      return;
    }

    // Determine card type roughly based on first digit
    let cardType = 'Visa';
    if (cleanedCard.startsWith('5')) cardType = 'Mastercard';
    if (cleanedCard.startsWith('3')) cardType = 'Amex';
    if (cleanedCard.startsWith('6')) cardType = 'Discover';

    // Extract the last 4 digits for safe database storage
    const last4 = cleanedCard.slice(-4);

    try {
      await onSave({ 
        type: cardType, 
        last4: last4, 
        expiry: expiry, 
        is_default: isDefault 
      });
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
            <i className="bi bi-credit-card-2-front-fill me-2"></i>Add Payment Method
          </div>
          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger py-2 small fw-bold"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Name on Card</label>
                <input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Card Number</label>
                <div className="input-group bg-body border rounded border-0">
                  <input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" placeholder="0000 0000 0000 0000" maxLength="19" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                  <span className="input-group-text bg-body-tertiary border-0 text-muted"><i className="bi bi-credit-card-fill"></i></span>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Expiry Date</label>
                  <input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" placeholder="MM/YY" maxLength="5" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">CVV</label>
                  <input type="password" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" placeholder="123" maxLength="4" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                </div>
              </div>

              <div className="mb-4 form-check">
                <input type="checkbox" className="form-check-input shadow-none" id="defaultPayment" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                <label className="form-check-label small fw-semibold text-muted" htmlFor="defaultPayment">Set as default payment method</label>
              </div>
              
              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" className="btn btn-outline-secondary fw-semibold px-4 rounded-pill" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary fw-semibold px-5 rounded-pill d-flex align-items-center gap-2" disabled={isLoading}>
                  {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}