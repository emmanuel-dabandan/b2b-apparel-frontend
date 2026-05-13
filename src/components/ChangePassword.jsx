// src/components/ChangePassword.jsx
import { useState } from 'react';

export default function ChangePassword({ onSave, onCancel }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await onSave(newPassword);
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
            <i className="bi bi-shield-lock me-2"></i>Update Password
          </div>
          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger py-2 small fw-bold"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">New Password</label>
                <div className="input-group bg-body-tertiary rounded border-0">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control bg-transparent border-0 shadow-none py-2 text-body" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                  <button type="button" className="btn text-muted shadow-none border-0" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Confirm New Password</label>
                <div className="input-group bg-body-tertiary rounded border-0">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control bg-transparent border-0 shadow-none py-2 text-body" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                </div>
                <div className="form-text small mt-2 text-muted">
                  <i className="bi bi-info-circle me-1"></i> You will remain logged in after changing your password.
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" className="btn btn-outline-secondary fw-semibold px-4 rounded-pill" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary fw-semibold px-5 rounded-pill d-flex align-items-center gap-2" disabled={isLoading}>
                  {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}