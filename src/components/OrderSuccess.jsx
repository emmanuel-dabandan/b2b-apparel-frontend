// src/components/OrderSuccess.jsx

export default function OrderSuccess({ orderDetails, onContinue }) {
  // Format today's date cleanly
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Generate a mock transaction ID
  const transactionId = `TXN-${Math.floor(Math.random() * 1000000000)}`;

  return (
    <div className="container py-5 animate-view">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-body">
            
            <div className="card-header bg-success text-white text-center py-5 border-0">
              <i className="bi bi-check-circle-fill display-1 d-block mb-3 shadow-sm rounded-circle" style={{width: 'max-content', margin: '0 auto'}}></i>
              <h2 className="fw-bold mb-1">Payment Successful!</h2>
              <p className="mb-0 opacity-75 fs-6">Your order has been processed securely.</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold border-bottom pb-3 mb-4 text-body">Order Details</h5>
              
              <div className="row mb-3">
                <div className="col-5 text-muted fw-semibold small">Order Number</div>
                <div className="col-7 fw-bold text-body text-end">#{orderDetails?.orderId || 'PENDING'}</div>
              </div>
              
              <div className="row mb-3">
                <div className="col-5 text-muted fw-semibold small">Transaction ID</div>
                <div className="col-7 fw-bold text-body text-end">{transactionId}</div>
              </div>

              <div className="row mb-3">
                <div className="col-5 text-muted fw-semibold small">Date</div>
                <div className="col-7 fw-bold text-body text-end">{today}</div>
              </div>

              <div className="row mb-3">
                <div className="col-5 text-muted fw-semibold small">Email Address</div>
                <div className="col-7 fw-bold text-body text-end text-break">{orderDetails?.email}</div>
              </div>

              <div className="row mb-3">
                <div className="col-5 text-muted fw-semibold small">Shipping Method</div>
                <div className="col-7 fw-bold text-body text-end text-capitalize">{orderDetails?.shipping} Delivery</div>
              </div>

              <div className="row mb-3">
                <div className="col-5 text-muted fw-semibold small">Payment Method</div>
                <div className="col-7 fw-bold text-body text-end">
                  {orderDetails?.cardLast4 ? `Card ending in ${orderDetails.cardLast4}` : 'Alternative Payment'}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-5 text-muted fw-semibold small">Delivery Address</div>
                <div className="col-7 fw-bold text-body text-end">
                  {orderDetails?.address || "Standard Billing Address"}
                </div>
              </div>

              <div className="alert bg-body-tertiary border text-center mt-4 mb-5 rounded-3">
                <i className="bi bi-envelope-check-fill text-primary me-2 fs-5"></i>
                <span className="small fw-semibold text-muted">A confirmation email with your receipt is on its way.</span>
              </div>

              <button className="btn btn-primary w-100 py-3 fw-bold rounded-pill" onClick={onContinue}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}