import { useState } from 'react';

export default function EditProfile({ initialName, initialEmail, onSave, onCancel }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await onSave(name, email);
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
          <i className="bi bi-arrow-left me-2"></i> Back to Profile
        </button>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body border">
          <div className="card-header bg-primary text-white fw-bold py-3">
            <i className="bi bi-pencil-square me-2"></i>Edit Profile Details
          </div>
          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger py-2 small fw-bold"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Full Name</label>
                <input 
                  type="text" 
                  className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Email Address</label>
                <input 
                  type="email" 
                  className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <div className="form-text small mt-2 text-muted">
                  <i className="bi bi-info-circle me-1"></i> If you change your email, Supabase requires you to verify the change via a link sent to your inbox.
                </div>
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