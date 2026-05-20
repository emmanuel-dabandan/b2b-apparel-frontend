import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from './context/CartContext';
import { createClient } from '@supabase/supabase-js';
import ProductCard from './components/ProductCard.jsx';
import EditProfile from './components/EditProfile.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import AddAddress from './components/AddAddress.jsx';
import AddPayment from './components/AddPayment.jsx';
import EditAddress from './components/EditAddress.jsx';
import EditPayment from './components/EditPayment.jsx';
import OrderSuccess from './components/OrderSuccess.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// --- INITIALIZE SUPABASE CLIENT ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- CSS Animations & Theme Overrides ---
const globalStyles = `
  /* --- EXACT COLOR SCHEME INJECTION --- */
  :root {
    /* Primary Deep Blue */
    --bs-primary: #274c77;
    --bs-primary-rgb: 39, 76, 119;
    
    /* Light Grayish-Blue Background */
    --bs-body-bg: #e7ecef;
    --bs-body-bg-rgb: 231, 236, 239;
    
    /* Text Color */
    --bs-body-color: #162b44;
    --bs-body-color-rgb: 22, 43, 68;

    /* Custom Layout Colors */
    --b2b-card-bg: #ffffff;
    --b2b-input-bg: #f8f9fa;
    --b2b-border: #dee2e6;
  }

  [data-bs-theme='dark'] {
    /* Lighten primary slightly so links/borders are legible in the dark */
    --bs-primary: #4a80bc; 
    --bs-primary-rgb: 74, 128, 188;
    
    /* Dark mode background: a very deep, rich slate blue */
    --bs-body-bg: #0b1521; 
    --bs-body-bg-rgb: 11, 21, 33;
    
    /* In dark mode, #e7ecef becomes the soft text color! */
    --bs-body-color: #e7ecef; 
    --bs-body-color-rgb: 231, 236, 239;

    /* Custom Layout Colors */
    --b2b-card-bg: #162b44;
    --b2b-input-bg: #1a3454;
    --b2b-border: #2a3f5a;
  }

  /* Force exact backgrounds and text colors overriding Bootstrap's stubborn utility classes */
  body { 
    background-color: var(--bs-body-bg) !important; 
    color: var(--bs-body-color) !important;
  }
  
  .bg-body, .bg-light, .navbar, .card, .modal-content { 
    background-color: var(--b2b-card-bg) !important; 
  }
  
  .bg-body-tertiary { 
    background-color: var(--bs-body-bg) !important; 
  }
  
  .text-body, .text-muted { 
    color: var(--bs-body-color) !important; 
  }
  
  .border, .border-top, .border-bottom, .border-end { 
    border-color: var(--b2b-border) !important; 
  }

  /* Form Inputs and Interactive Elements */
  .form-control, .form-select, .input-group-text, .list-group-item, .accordion-button, .accordion-item {
    background-color: var(--b2b-input-bg) !important;
    color: var(--bs-body-color) !important;
    border-color: var(--b2b-border) !important;
  }
  
  /* --- FIX: Allow transparent inputs to bypass the theme background --- */
  .form-control.bg-transparent, .form-control:focus.bg-transparent {
    background-color: transparent !important;
  }
  
  .form-control:focus, .form-select:focus {
     border-color: var(--bs-primary) !important;
     box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25) !important;
  }

  /* Primary Buttons */
  .btn-primary {
    background-color: #274c77 !important;
    border-color: #274c77 !important;
    color: #e7ecef !important;
  }
  .btn-primary:hover {
    background-color: #1a3454 !important;
    border-color: #1a3454 !important;
  }
  .text-primary { color: var(--bs-primary) !important; }
  
  [data-bs-theme='dark'] .text-primary { color: #6fa0d9 !important; }
  [data-bs-theme='dark'] .btn-primary { 
    background-color: #4a80bc !important; 
    border-color: #4a80bc !important; 
    color: #0b1521 !important; 
  }
  [data-bs-theme='dark'] .btn-primary:hover {
    background-color: #3b6b9e !important;
    border-color: #3b6b9e !important;
  }

  /* Secondary Buttons */
  .btn-outline-secondary {
     color: var(--bs-body-color) !important;
     border-color: var(--b2b-border) !important;
  }
  .btn-outline-secondary:hover {
     background-color: var(--b2b-input-bg) !important;
  }

  /* --- EXISTING ANIMATIONS --- */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dropdownEnter {
    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-view { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-dropdown { animation: dropdownEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: top right; }
  
  /* Smooth Theme Transition (1 Second) */
  body, .navbar, .card, .bg-body, .bg-body-tertiary, .bg-light, .bg-dark, .text-body, .text-muted, input, select, textarea, .list-group-item, .accordion-item, .accordion-button, .btn {
    transition: background-color 1s ease-in-out, color 1s ease-in-out, border-color 1s ease-in-out, box-shadow 1s ease-in-out !important;
  }

  /* Custom Scrollbar for Checkout */
  .checkout-scroll::-webkit-scrollbar { width: 6px; }
  .checkout-scroll::-webkit-scrollbar-track { background: transparent; }
  .checkout-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
  [data-bs-theme='dark'] .checkout-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

  /* --- NEW: Search Bar Fix --- */
  .search-input, .search-input:focus {
    background-color: transparent !important;
  }

  /* --- NEW: Forces selected cards to highlight properly --- */
  .selected-card {
    background-color: rgba(var(--bs-primary-rgb), 0.15) !important;
    border-color: var(--bs-primary) !important;
    border-width: 2px !important;
  }

  /* --- NEW: Responsive Product Card Images --- */
  .grid-view-img {
    height: 200px;
    width: 100%;
  }
  .list-view-img {
    width: 120px !important;
    height: 100% !important;
    min-height: 150px !important;
  }
  @media (min-width: 768px) {
    .list-view-img {
      width: 250px !important;
      min-height: 200px !important;
    }
  }
`;

// --- Edit Product Modal ---
function EditProductModal({ product, onClose, onSave, categoryOptions, sizeOptions, colorOptions }) {
  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(product.basePrice);
  const [editCategory, setEditCategory] = useState(product.category);
  const [editImage, setEditImage] = useState(product.imageUrl || '');
  const [editDesc, setEditDesc] = useState(product.description || '');
  const [editStock, setEditStock] = useState(product.stock);
  const initialSizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
  const initialColors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(c => c) : [];
  const [editSizes, setEditSizes] = useState(initialSizes);
  const [editColors, setEditColors] = useState(initialColors);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleCheckbox = (item, stateArray, setStateArray) => setStateArray(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPayload = {
      name: editName, basePrice: parseFloat(editPrice), category: editCategory, imageUrl: editImage,
      description: editDesc, stock: parseInt(editStock) || 0, sizes: editSizes.join(', '), colors: editColors.join(', ')
    };
    onSave(product.id, updatedPayload);
  };

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1060 }} onClick={onClose}></div>
      <div className="position-fixed top-50 start-50 translate-middle w-100 px-3 animate-dropdown" style={{ zIndex: 1070, maxWidth: '900px' }}>
        <div className="card shadow-lg rounded-4 overflow-hidden outline-none border-0">
          <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center py-3">
            <span>Edit Product: {product.name}</span>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="card-body p-4 bg-body-tertiary" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-4"><label className="form-label fw-bold small text-muted">Product Name</label><input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} required/></div>
                <div className="col-md-4"><label className="form-label fw-bold small text-muted">Category</label><select className="form-select" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>{categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                <div className="col-md-4"><label className="form-label fw-bold small text-muted">Base Price (USD)</label><input type="number" step="0.01" className="form-control" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required/></div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4"><label className="form-label fw-bold small text-muted">Stock Quantity</label><input type="number" className="form-control" value={editStock} onChange={(e) => setEditStock(e.target.value)}/></div>
                <div className="col-md-8">
                  <label className="form-label fw-bold small text-muted">Update Product Image</label>
                  <div className="d-flex gap-3 align-items-center">
                    {editImage && <img src={editImage} alt="Preview" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />}
                    <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Available Sizes</label>
                  <div className="d-flex flex-wrap gap-3 p-3 bg-body border rounded">
                    {sizeOptions.map(size => (
                      <div className="form-check" key={size}><input className="form-check-input" type="checkbox" id={`edit-size-${size}`} checked={editSizes.includes(size)} onChange={() => toggleCheckbox(size, editSizes, setEditSizes)}/><label className="form-check-label fw-semibold" htmlFor={`edit-size-${size}`}>{size}</label></div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-muted">Available Colors</label>
                  <div className="d-flex flex-wrap gap-3 p-3 bg-body border rounded">
                    {colorOptions.map(color => (
                      <div className="form-check" key={color}><input className="form-check-input" type="checkbox" id={`edit-color-${color}`} checked={editColors.includes(color)} onChange={() => toggleCheckbox(color, editColors, setEditColors)}/><label className="form-check-label fw-semibold" htmlFor={`edit-color-${color}`}>{color}</label></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-4"><label className="form-label fw-bold small text-muted">Product Description</label><textarea className="form-control" rows="3" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}></textarea></div>
              <div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary fw-bold px-4" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary px-5 fw-bold">Save Changes</button></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Product Details Modal ---
function ProductModal({ product, onClose, userRole, onRequestLogin }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  // Update these to handle empty states safely
  const increment = () => setQuantity((prev) => (prev === '' ? 1 : prev + 1));
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Add these two new functions to control the typing
  const handleQuantityChange = (e) => {
    // Strip out letters or symbols, only allow numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    setQuantity(val === '' ? '' : parseInt(val, 10));
  };

  const handleQuantityBlur = () => {
    // If the user deletes the number and clicks away, reset to 1
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    }
  };
  const rawSizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
  const sizes = rawSizes.length > 0 ? rawSizes : ['S', 'M', 'L', 'XL', 'XXL', '3XL']; 
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(c => c) : [];

  const safeStock = product.stock > 0 ? product.stock : 100;
  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 0;
  
  
  const isReadyToAdd = (!needsSize || selectedSize) && (!needsColor || selectedColor);

  const handleAdd = () => {
    if (!userRole) {
      onClose();
      onRequestLogin();
      return;
    }

    if (!isReadyToAdd) return;
    const sizeText = selectedSize ? ` (${selectedSize})` : '';
    const colorText = selectedColor ? ` - ${selectedColor}` : '';
    const configuredProduct = { ...product, id: `${product.id}-${selectedSize}-${selectedColor}`, name: `${product.name}${sizeText}${colorText}` };
    addToCart(configuredProduct, parseInt(quantity) || 1);
    onClose(); 
  };

  let buttonText = "Add to Cart";
  if (!userRole) buttonText = "Log in to Purchase";
  else if (needsSize && !selectedSize) buttonText = "Please Select a Size";
  else if (needsColor && !selectedColor) buttonText = "Please Select a Color";

  const canClick = !userRole || isReadyToAdd;

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1040 }} onClick={onClose}></div>
      <div className="position-fixed top-50 start-50 translate-middle w-100 px-3 animate-dropdown" style={{ zIndex: 1050, maxWidth: '800px' }}>
        <div className="card shadow-lg rounded-4 overflow-hidden border-0 bg-body">
          <div className="row g-0">
            <div className="col-md-5 bg-body-tertiary d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
              {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} /> : <i className="bi bi-image text-muted" style={{ fontSize: '5rem' }}></i>}
            </div>
            <div className="col-md-7 position-relative">
              <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose}></button>
              <div className="card-body p-4 d-flex flex-column h-100">
                <small className="text-muted text-uppercase fw-bold mb-1">{product.category}</small>
                <h3 className="fw-bold mb-2">{product.name}</h3>
                <h4 className="text-primary fw-bold mb-3">${product.basePrice.toFixed(2)}</h4>
                <p className="text-muted small mb-4">{product.description || "No description provided for this item."}</p>
                <div className="row mb-4">
                  <div className="col-12 mb-3"><span className="d-block fw-bold small mb-2">Select Size {needsSize && !selectedSize && <span className="text-danger">*</span>}</span><div className="d-flex flex-wrap gap-2">{sizes.map(size => (<button key={size} className={`btn btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'} fw-bold`} onClick={() => setSelectedSize(size)}>{size}</button>))}</div></div>
                  {needsColor && (<div className="col-12"><span className="d-block fw-bold small mb-2">Select Color {!selectedColor && <span className="text-danger">*</span>}</span><div className="d-flex flex-wrap gap-2">{colors.map(color => (<button key={color} className={`btn btn-sm ${selectedColor === color ? 'btn-primary' : 'btn-outline-secondary'} fw-bold`} onClick={() => setSelectedColor(color)}>{color}</button>))}</div></div>)}
                </div>
                <div className="mt-auto border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3"><span className="fw-bold small text-muted">Stock Available: <span className="text-success">{safeStock}</span></span></div>
                  <div className="d-flex gap-3">
<div className="input-group" style={{ width: '130px' }}>
  <button className="btn btn-outline-secondary fw-bold" type="button" onClick={decrement}>-</button>
  <input 
    type="text" 
    className="form-control text-center fw-bold shadow-none" 
    value={quantity} 
    onChange={handleQuantityChange}
    onBlur={handleQuantityBlur}
  />
  <button className="btn btn-outline-secondary fw-bold" type="button" onClick={increment}>+</button>
</div>                    <button className={`btn ${canClick ? 'btn-primary' : 'btn-secondary'} fw-bold flex-grow-1 rounded-pill`} onClick={handleAdd} disabled={!canClick}>{buttonText}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Admin Order Details Modal ---
function AdminOrderModal({ order, onClose, onUpdateFulfillment }) {
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [carrier, setCarrier] = useState(order.carrier || 'USPS');
  
  // Safely determine current status (Fallback to 'Unfulfilled' if not set yet)
  const currentFulfillmentStatus = order.fulfillment_status || (order.status === 'Shipped' ? 'Fulfilled' : 'Unfulfilled');
  const isFulfilled = currentFulfillmentStatus === 'Fulfilled';

  const handleFulfill = (e) => {
    e.preventDefault();
    if (!trackingNumber) {
      showNotification("Please enter a tracking number.");
      return;
    }
    // Pass the data back up to the main App state
    onUpdateFulfillment(order.id, { 
      fulfillment_status: 'Fulfilled', 
      status: 'Shipped', 
      tracking_number: trackingNumber, 
      carrier: carrier 
    });
  };

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1060 }} onClick={onClose}></div>
      <div className="position-fixed top-50 start-50 translate-middle w-100 px-3 animate-dropdown" style={{ zIndex: 1070, maxWidth: '900px' }}>
        <div className="card shadow-lg rounded-4 overflow-hidden border-0 bg-body">
          <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center py-3">
            <span>Order #{order.id} Details</span>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="card-body p-0 d-flex flex-column flex-md-row" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            
            {/* Left Column: Items & Customer */}
            <div className="col-md-7 p-4 border-end">
              <h6 className="fw-bold mb-3 text-body">Customer Information</h6>
              <div className="bg-body-tertiary p-3 rounded mb-4 border">
                <div className="fw-semibold text-body">{order.customer_name || 'Guest Customer'}</div>
                <div className="text-muted small mb-2">{order.customer_email || 'No email provided'}</div>
                <div className="text-muted small"><i className="bi bi-geo-alt-fill me-1"></i> {order.shipping_address || 'Standard Shipping Address'}</div>
              </div>

              <h6 className="fw-bold mb-3 text-body">Line Items</h6>
              <ul className="list-group list-group-flush border rounded mb-0">
                {order.items && order.items.map((item, idx) => (
                  <li key={idx} className="list-group-item bg-body-tertiary d-flex justify-content-between align-items-center p-3 text-body border-bottom-0 border-light">
                    <div>
                      <div className="fw-bold">{item.name}</div>
                      <div className="text-muted small">${item.price?.toFixed(2)} x {item.quantity}</div>
                    </div>
                    <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Financials & Fulfillment */}
            <div className="col-md-5 p-4 bg-body-tertiary">
              <h6 className="fw-bold mb-3 text-body">Financial Summary</h6>
              <div className="bg-body p-3 rounded mb-4 border shadow-sm">
                <div className="d-flex justify-content-between mb-2 small"><span className="text-muted">Total Value:</span><span className="fw-bold text-body">${(order.final_total || 0).toFixed(2)}</span></div>
                <div className="d-flex justify-content-between mb-2 small"><span className="text-muted">Amount Paid:</span><span className="fw-bold text-success">${(order.amount_paid || 0).toFixed(2)}</span></div>
                <div className="d-flex justify-content-between pt-2 border-top mt-2">
                  <span className="fw-bold text-body">Balance Due:</span>
                  <span className={`fw-bold ${order.balance_due > 0 ? 'text-danger' : 'text-body'}`}>${(order.balance_due || 0).toFixed(2)}</span>
                </div>
              </div>

              <h6 className="fw-bold mb-3 text-body">Fulfillment Status</h6>
              <div className="bg-body p-3 rounded border shadow-sm">
                <div className="mb-3">
                  <span className={`badge ${isFulfilled ? 'bg-success' : currentFulfillmentStatus === 'Partially Fulfilled' ? 'bg-warning text-dark' : 'bg-secondary'} px-3 py-2 fs-6 w-100`}>
                    <i className={`bi ${isFulfilled ? 'bi-check-circle-fill' : 'bi-box-seam'} me-2`}></i> 
                    {currentFulfillmentStatus}
                  </span>
                </div>

                {/* Tracking Input Block */}
                {!isFulfilled ? (
                  <form onSubmit={handleFulfill}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Tracking Number</label>
                      <input type="text" className="form-control bg-body-tertiary shadow-none border" placeholder="e.g. 1Z99999999999" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Shipping Carrier</label>
                      <select className="form-select bg-body-tertiary shadow-none border" value={carrier} onChange={(e) => setCarrier(e.target.value)}>
                        <option value="USPS">USPS</option>
                        <option value="FedEx">FedEx</option>
                        <option value="UPS">UPS</option>
                        <option value="DHL">DHL</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Mark as Fulfilled</button>
                  </form>
                ) : (
                  <div className="alert alert-success border-0 small mb-0">
                    <div className="fw-bold mb-1">Tracking Added</div>
                    <div>Carrier: {order.carrier || carrier}</div>
                    <div>Tracking: {order.tracking_number || trackingNumber}</div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

// --- Main App ---
function App() {
  const { cart, totalQuantity, totalPrice, updateQuantity, removeFromCart, clearCart, reloadCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('full');
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);
  const [currentView, setCurrentView] = useState('store'); 
  

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // --- UPDATED: Start with empty arrays to fetch from DB ---
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedPayments, setSavedPayments] = useState([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [selectedSavedPayment, setSelectedSavedPayment] = useState(null);
  const [billingSame, setBillingSame] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  

  // Wishlist Storage Logic
  const getLikedKey = (email) => email ? `b2b_liked_${email}` : 'b2b_liked_guest';
  
  const [likedItems, setLikedItems] = useState([]);
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    
    // --- FIX: Strip out massive Base64 images before saving to local storage ---
    const optimizedWishlist = likedItems.map(item => {
      // If the image string is over 1000 characters, it's a massive Base64 file. Drop it.
      const isHugeFile = item.imageUrl && item.imageUrl.length > 1000;
      return isHugeFile ? { ...item, imageUrl: null } : item;
    });

    try {
      localStorage.setItem(getLikedKey(email), JSON.stringify(optimizedWishlist));
    } catch (error) {
      console.warn("Storage quota still exceeded even after optimization!", error);
    }
  }, [likedItems]);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  // Customer Orders State
  const [activeOrderTab, setActiveOrderTab] = useState('All');
  const orderTabs = ['All', 'To pay', 'To Ship', 'To Receive', 'To Review', 'Returns'];

  // Slideshow States
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    { id: 1, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80', text1: 'Simple', text2: 'is More' },
    { id: 2, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80', text1: 'Autumn', text2: 'Collection' },
    { id: 3, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80', text1: 'Essential', text2: 'Basics' },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);
  
  // Checkout States
  const [checkoutPhase, setCheckoutPhase] = useState('shipping');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [selectedPaymentType, setSelectedPaymentType] = useState('credit');
  const [paymentArrangement, setPaymentArrangement] = useState(100);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // --- Full Manual Address States ---
  const [shipFlat, setShipFlat] = useState('');
  const [shipStreet, setShipStreet] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipState, setShipState] = useState('');
  const [shipZip, setShipZip] = useState('');

  const [moqWarning, setMoqWarning] = useState('');
  
  // --- NEW: Global Toast Notification State ---
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000); // Auto-dismiss after 3 seconds
  };
  const [orderHistory, setOrderHistory] = useState([]);
  const [products, setProducts] = useState([]);

  // Auth States
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null); 
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || ''); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  
  // Advanced Auth States
  const [signupName, setSignupName] = useState('');
  const [signupConfirmPass, setSignupConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Cart & UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  
  // Catalog Form States
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('T-Shirts');
  const [newProductImage, setNewProductImage] = useState(''); 
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [selectedFormSizes, setSelectedFormSizes] = useState([]);
  const [selectedFormColors, setSelectedFormColors] = useState([]);

  const [productToEdit, setProductToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('relevance'); 
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Admin Ledger States
  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);

  // Temporary function to simulate updating the tracking data in your UI
  const handleUpdateFulfillment = (orderId, updateData) => {
    // 1. Update the local order history so the UI changes instantly
    setOrderHistory(prev => prev.map(order => order.id === orderId ? { ...order, ...updateData } : order));
    // 2. Update the currently viewed modal so it changes to green instantly
    setSelectedAdminOrder(prev => ({ ...prev, ...updateData }));
    
    showNotification("Order tracking updated successfully!");
    // NOTE: You will eventually add a fetch('PUT') request here to update your FastAPI backend!
  };

  const categoryOptions = ['T-Shirts', 'Hoodies', 'Outerwear', 'Bottoms', 'Other'];
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const colorOptions = ['Black', 'White', 'Heather Gray', 'Navy', 'Red', 'Olive', 'Cream', 'Brown'];

  let shippingCost = 0;
  if (shippingMethod === 'express') shippingCost = 30.00;
  if (shippingMethod === 'sameday') shippingCost = 90.00;

  const taxAmount = totalPrice * 0.065;
  const finalTotalDue = totalPrice + taxAmount + shippingCost;
  const amountToPayToday = finalTotalDue * (paymentArrangement / 100);

  // --- ADD THIS LINE BACK IN ---
  const moqMet = totalQuantity >= 20;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleLike = async (product) => {
    if (!userRole) {
      setIsSignUpMode(false); 
      setShowLoginModal(true);
      return;
    }

    const isLiked = likedItems.find((item) => item.id === product.id);

    if (isLiked) {
      // Remove from UI immediately, delete from DB in background
      setLikedItems((prev) => prev.filter((item) => item.id !== product.id));
      await supabase.from('user_wishlist').delete().match({ user_email: userEmail, product_id: product.id });
    } else {
      // Add to UI immediately, insert to DB in background
      setLikedItems((prev) => [...prev, product]);
      await supabase.from('user_wishlist').insert([{ user_email: userEmail, product_id: product.id, product_details: product }]);
    }
  };

  const handleCartDecrement = (item) => {
    if (totalQuantity <= 20) {
      setMoqWarning("Your order cannot drop below the 20-item B2B minimum.");
      return;
    }
    if (updateQuantity) {
      if (item.quantity === 1 && removeFromCart) {
        removeFromCart(item.id);
      } else {
        updateQuantity(item.id, item.quantity - 1);
      }
    }
  };

  const handleCartIncrement = (item) => {
    if (updateQuantity) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleCartRemove = (item) => {
    if (totalQuantity - item.quantity < 20) {
      setMoqWarning(`Removing these ${item.quantity} items drops your cart below the 20-item minimum. Add other items first.`);
      return;
    }
    if (removeFromCart) {
      removeFromCart(item.id);
    }
  };

  // --- UPDATED: Fetch user data from DB on login ---
  useEffect(() => {
    const fetchUserData = async (email) => {
    const { data: addresses } = await supabase.from('saved_addresses').select('*').eq('user_email', email);
    const { data: payments } = await supabase.from('saved_payments').select('*').eq('user_email', email);
    const { data: wishlist } = await supabase.from('user_wishlist').select('*').eq('user_email', email); // NEW LINE
    
    if (addresses) setSavedAddresses(addresses);
    if (payments) setSavedPayments(payments);
    if (wishlist) setLikedItems(wishlist.map(item => item.product_details)); // NEW LINE
  };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email;
        setUserEmail(email);
        setUserName(session.user.user_metadata?.full_name || email.split('@')[0]);
        fetchUserData(email);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://b2b-apparel-backend.onrender.com/api/products');
        const data = await response.json();
        setProducts(data);
        if (data.length > 0) {
          const highestPrice = Math.max(...data.map(p => p.basePrice));
          setMaxPrice(Math.ceil(highestPrice + 20));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      let authResponse;
      let extractedName = '';
      
      if (isSignUpMode) {
        if (!signupName.trim()) { setLoginError('Please enter your full name.'); return; }
        if (loginPass !== signupConfirmPass) { setLoginError('Passwords do not match.'); return; }

        authResponse = await supabase.auth.signUp({ 
          email: loginEmail, 
          password: loginPass,
          options: { data: { full_name: signupName } }
        });

        if (authResponse.error) { setLoginError(authResponse.error.message); return; }
        
        if (!authResponse.data.session) {
          setIsSignUpMode(false); 
          setLoginEmail(''); setLoginPass(''); setSignupConfirmPass(''); setSignupName('');
          setLoginError('Success! Please check your email to confirm your account, then log in.');
          return;
        }
        extractedName = signupName;
      } else {
        authResponse = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass });
        if (authResponse.error) { setLoginError(authResponse.error.message); return; }
        extractedName = authResponse.data.user.user_metadata?.full_name || loginEmail.split('@')[0];
      }
      
      const email = authResponse.data.user.email;
      
      // 1. Define all allowed admin emails here
      const adminEmails = [
        'admin@b2b.com', 
        'newadmin@b2b.com', 
        'emmanuel.dabandan@cvsu.edu.ph'
      ];
      
      // 2. Check if the logged-in user's email is inside the admin list
      const role = adminEmails.includes(email) ? 'admin' : 'customer';
      
      setUserRole(role);
      
      setUserRole(role); 
      setUserEmail(email);
      setUserName(extractedName);
      
      localStorage.setItem('userRole', role); 
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', extractedName);

      if (reloadCart) reloadCart();
      const savedLiked = localStorage.getItem(getLikedKey(email));
      setLikedItems(savedLiked ? JSON.parse(savedLiked) : []);

      const { data: addresses } = await supabase.from('saved_addresses').select('*').eq('user_email', email);
      const { data: payments } = await supabase.from('saved_payments').select('*').eq('user_email', email);
      if (addresses) setSavedAddresses(addresses);
      if (payments) setSavedPayments(payments);
      
      setShowLoginModal(false); setLoginEmail(''); setLoginPass(''); setSignupConfirmPass(''); setSignupName('');
      if (role === 'admin') setCurrentView('catalog'); else setCurrentView('store');
    } catch (error) {
      setLoginError("Failed to connect to authentication server.");
    }
  };

  const handleLogout = async () => {
    // We removed the window.confirm check from here!
    await supabase.auth.signOut();
    setUserRole(null); 
    setUserEmail(null);
    setUserName('');
    localStorage.removeItem('userRole'); 
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    if (reloadCart) reloadCart();
    const savedLiked = localStorage.getItem(getLikedKey(null));
    setLikedItems(savedLiked ? JSON.parse(savedLiked) : []);
    
    setSavedAddresses([]);
    setSavedPayments([]);

    setIsUserMenuOpen(false); 
    setShowLogoutConfirm(false); // Close the custom modal
    setCurrentView('store'); 
    showNotification("You have been successfully signed out.");
  };

  const handleProfileUpdate = async (newName, newEmail) => {
    // 1. Prepare what needs to be updated
    const updates = {};
    if (newName !== userName) updates.data = { full_name: newName };
    if (newEmail !== userEmail) {
        setUserEmail(newEmail);
        localStorage.setItem('userEmail', newEmail);
        showNotification("Email update initiated! Check your inbox for a verification link.");
      } else {
        showNotification("Profile details successfully updated!");
      }

    // 2. Send to Supabase if changes exist
    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error; // The EditProfile component will catch and display this
      
      // 3. Update local state immediately
      if (newName !== userName) {
        setUserName(newName);
        localStorage.setItem('userName', newName);
      }
      
      if (newEmail !== userEmail) {
  setUserEmail(newEmail);
  localStorage.setItem('userEmail', newEmail);
  showNotification("Email update initiated! Please check your inbox for a verification link.");
} else {
  showNotification("Profile details successfully updated!");
}
    }
    
    // 4. Return to the main profile screen
    setCurrentView('profile');
  };

  const handlePasswordUpdate = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error; // Throws to the component to show the red error box
    
    showNotification("Password successfully updated!");
    setCurrentView('profile');
  };

  const simulatePayment = async () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      setIsProcessingPayment(false);

      // 1. Run the checkout first so it can grab the current input data
      await handleCheckout();

      // 2. Clear the form data AFTER checkout is complete
      setCheckoutPhase('shipping');
      setCardNumber(''); setCardExpiry(''); setCardCvc('');
      setSelectedSavedAddress(null);
      setSelectedSavedPayment(null);
    }, 2000);
  };

  const handleCheckout = async () => {
    const backendMappedMethod = paymentArrangement === 100 ? 'full' : 'down_payment';

    // --- 1. FORMAT THE FULL DELIVERY ADDRESS FIRST ---
    let finalDeliveryAddress = 'Standard Billing Address';
    
    if (selectedSavedAddress) {
      const savedAddr = savedAddresses.find(a => a.id === selectedSavedAddress);
      finalDeliveryAddress = savedAddr ? `${savedAddr.address}, ${savedAddr.city}` : finalDeliveryAddress;
    } else if (shipStreet || shipCity) {
      // Safely filters out empty boxes
      const addressParts = [shipFlat, shipStreet, shipCity, shipState, shipZip].filter(Boolean);
      finalDeliveryAddress = addressParts.join(', ');
    }

    if (!finalDeliveryAddress || finalDeliveryAddress.trim() === '') {
      finalDeliveryAddress = 'No Address Provided by Customer';
    }

    // --- 2. BUILD THE BACKEND PAYLOAD ---
    const payload = {
      items: cart,
      payment_method: backendMappedMethod,
      customer_email: userEmail,
      customer_name: userName,
      payment_percentage: paymentArrangement,
      shipping_method: shippingMethod,
      shipping_address: finalDeliveryAddress // <--- THIS WAS MISSING!
    };

  

    

    try {
      const response = await fetch('https://b2b-apparel-backend.onrender.com/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        // --- CAPTURE DATA FOR SUCCESS SCREEN ---
        let last4 = '';
        if (selectedPaymentType === 'credit') {
          if (selectedSavedPayment) {
            const savedCard = savedPayments.find(p => p.id === selectedSavedPayment);
            last4 = savedCard ? savedCard.last4 : '';
          } else {
            last4 = cardNumber.slice(-4) || 'XXXX';
          }
        }

        // --- GRAB THE CORRECT ADDRESS ---
        // --- FORMAT THE FULL DELIVERY ADDRESS ---
        // --- FORMAT THE FULL DELIVERY ADDRESS (BULLETPROOF) ---
        let finalDeliveryAddress = 'Standard Billing Address';
        
        if (selectedSavedAddress) {
          const savedAddr = savedAddresses.find(a => a.id === selectedSavedAddress);
          finalDeliveryAddress = savedAddr ? `${savedAddr.address}, ${savedAddr.city}` : finalDeliveryAddress;
        } else if (shipStreet || shipCity) {
          // This safely filters out empty boxes so you don't get weird commas like " , , "
          const addressParts = [shipFlat, shipStreet, shipCity, shipState, shipZip].filter(Boolean);
          finalDeliveryAddress = addressParts.join(', ');
        }

        // Final safety net: If it's still completely blank, force a fallback message
        if (!finalDeliveryAddress || finalDeliveryAddress.trim() === '') {
          finalDeliveryAddress = 'No Address Provided by Customer';
        }

        // --- FORMAT THE PAYMENT METHOD ---
        let formattedPayment = 'Credit / Debit Card';
        if (selectedPaymentType === 'bank') formattedPayment = 'Direct Bank Transfer';
        if (selectedPaymentType === 'delivery') formattedPayment = 'Pay on Delivery';
        if (selectedPaymentType === 'other') formattedPayment = 'Other (PayPal, GPay, etc.)';

        const successData = {
          orderId: data.order_summary?.id || Math.floor(Math.random() * 90000) + 10000,
          email: userEmail || 'Guest User',
          shipping: shippingMethod,
          paymentType: formattedPayment, 
          cardLast4: last4,
          deliveryAddress: finalDeliveryAddress // <--- Explicitly named deliveryAddress!
        };

        setSuccessOrderDetails(successData);

        // --- NEW: TRIGGER AUTOMATION WEBHOOK FOR EMAIL/INVOICE ---
        // --- BUILD THE EXACT PAYLOAD FOR MAKE.COM ---
        const webhookPayload = {
          orderId: data.order_summary?.id || Math.floor(Math.random() * 90000) + 10000,
          email: userEmail || 'Guest User',
          shipping: shippingMethod,
          paymentType: formattedPayment, 
          cardLast4: last4,
          deliveryAddress: finalDeliveryAddress, // <-- Forced explicitly here!
          customerName: userName,
          items: cart,
          totalDue: finalTotalDue,
          amountPaid: amountToPayToday,
          balance: finalTotalDue - amountToPayToday,
          isFullyPaid: paymentArrangement === 100
        };

        // --- THE TRACKER: Prints the data to your browser console before sending ---
        console.log("🚀 DEBUG - PAYLOAD GOING TO MAKE.COM:", webhookPayload);

        // Fire to Make.com
        fetch('https://hook.eu1.make.com/mslkh51d5bhj5w67yl5yyio5d81fwutr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        }).catch(err => console.error("Receipt automation failed:", err));

        if (clearCart) clearCart(); 
        setCurrentView('order_success'); // Route to the new screen

      } else {
        showNotification(`Checkout Failed: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://b2b-apparel-backend.onrender.com/api/orders');
      const data = await response.json();
      setOrderHistory(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProductImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    const payload = { 
      name: newProductName, basePrice: parseFloat(newProductPrice), category: newProductCategory, imageUrl: newProductImage,
      description: newProductDesc, stock: parseInt(newProductStock) || 0, sizes: selectedFormSizes.join(', '), colors: selectedFormColors.join(', ')
    };
    try {
      const response = await fetch('https://b2b-apparel-backend.onrender.com/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setNewProductName(''); setNewProductPrice(''); setNewProductImage(''); setNewProductDesc(''); setNewProductStock(''); setSelectedFormSizes([]); setSelectedFormColors([]);
        document.getElementById('imageUploadInput').value = ''; 
        showNotification("Product added successfully!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleSaveEdit = async (productId, updatedPayload) => {
    try {
      const response = await fetch(`https://b2b-apparel-backend.onrender.com/api/products/${productId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedPayload) });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setProductToEdit(null); 
        showNotification("Changes saved successfully!");
      } else {
        showNotification("Failed to save changes.");
      }
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  // --- NEW: Functions to add data directly to DB ---
  const handleSaveNewAddress = async (addressData) => {
    // Attach the current user's email to the address payload
    const newAddr = { ...addressData, user_email: userEmail };
    
    // Push to Supabase
    const { data, error } = await supabase.from('saved_addresses').insert([newAddr]).select();
    
    if (error) throw error; // Throws error back to the component to display
    
    // Update local state to immediately show the new address
    if (data) {
      setSavedAddresses([...savedAddresses, data[0]]);
    }
    
    showNotification("Address successfully added!");
    setCurrentView('profile'); // Return to profile
  };

  const handleSaveNewPayment = async (paymentData) => {
    // Attach the current user's email to the payload
    const newPay = { ...paymentData, user_email: userEmail };
    
    // Push to Supabase (using the insert policy we created earlier)
    const { data, error } = await supabase.from('saved_payments').insert([newPay]).select();
    
    if (error) throw error; // Throws error back to the component to display
    
    // Update local state to immediately show the new card
    if (data) {
      setSavedPayments([...savedPayments, data[0]]);
    }
    
    showNotification("Payment method successfully added!");
    setCurrentView('profile'); // Return to profile
  };

  // --- EDIT / DELETE ADDRESSES ---
  const handleUpdateAddress = async (id, updatedData) => {
    const { data, error } = await supabase.from('saved_addresses').update(updatedData).eq('id', id).select();
    if (error) throw error;
    if (data) setSavedAddresses(savedAddresses.map(addr => addr.id === id ? data[0] : addr));
    showNotification("Address updated successfully!");
    setCurrentView('profile');
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    const { error } = await supabase.from('saved_addresses').delete().eq('id', id);
    if (error) {
      showNotification(`Error: ${error.message}`);
    } else {
      setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
      showNotification("Address removed.");
    }
  };

  // --- EDIT / DELETE PAYMENTS ---
  const handleUpdatePayment = async (id, updatedData) => {
    const { data, error } = await supabase.from('saved_payments').update(updatedData).eq('id', id).select();
    if (error) throw error;
    if (data) setSavedPayments(savedPayments.map(pay => pay.id === id ? data[0] : pay));
    showNotification("Payment method updated!");
    setCurrentView('profile');
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to remove this payment method?")) return;
    const { error } = await supabase.from('saved_payments').delete().eq('id', id);
    if (error) {
      showNotification(`Error: ${error.message}`);
    } else {
      setSavedPayments(savedPayments.filter(pay => pay.id !== id));
      showNotification("Payment method removed.");
    }
  };

  const toggleFormCheckbox = (item, stateArray, setStateArray) => setStateArray(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  const handleCategoryToggle = (category) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);

  let displayProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.basePrice <= maxPrice;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesPrice && matchesCategory;
  });

  if (sortOption === 'price-asc') displayProducts.sort((a, b) => a.basePrice - b.basePrice);
  else if (sortOption === 'price-desc') displayProducts.sort((a, b) => b.basePrice - a.basePrice);
  else if (sortOption === 'name-asc') displayProducts.sort((a, b) => a.name.localeCompare(b.name));

  const myCustomerOrders = orderHistory.filter(order => order.customer_email === userEmail);

  // --- NEW: Safe Tab Filtering Logic ---
  const filteredCustomerOrders = myCustomerOrders.filter(order => {
    if (activeOrderTab === 'All') return true;
    
    // Safely convert the backend data to a true number
    const balance = Number(order.balance_due) || 0;
    const status = order.status || 'Processing'; // Fallback if backend doesn't have statuses yet

    if (activeOrderTab === 'To pay') return balance > 0;
    if (activeOrderTab === 'To Ship') return balance <= 0 && status === 'Processing';
    
    // Safety catches for the future tabs (so they don't break the UI)
    if (activeOrderTab === 'To Receive') return status === 'Shipped';
    if (activeOrderTab === 'To Review') return status === 'Delivered';
    if (activeOrderTab === 'Returns') return status === 'Returned';
    
    return false;
  });

  return (
    <div className={`bg-body-tertiary min-vh-100 ${currentView.startsWith('admin_') ? 'overflow-hidden' : 'pb-5'}`}>
      <style>{globalStyles}</style>
      
      {currentView !== 'checkout' && !currentView.startsWith('admin_') && (
  <nav className={`navbar navbar-expand-lg bg-body shadow-sm py-3 mb-0 sticky-top border-bottom ${(currentView === 'customer_orders' || currentView === 'wishlist') ? 'd-none d-md-flex' : ''}`}>
  <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
    
    {/* --- CONDITIONAL LOGO --- */}
    {!currentView.startsWith('admin_') ? (
      <a className="navbar-brand fw-bold d-flex align-items-center gap-2 m-0 text-body" onClick={() => setCurrentView('store')} style={{cursor: 'pointer'}}>
        <div className="bg-primary text-white rounded text-center" style={{width: '35px', height: '35px', lineHeight: '35px'}}>B</div>
        BizBuy
      </a>
    ) : (
      <div></div> /* Keeps the profile button pushed to the right */
    )}

    <div className="d-flex align-items-center gap-3">
      
      {/* --- CONDITIONAL STORE TOOLS (Hidden in Admin) --- */}
      {!currentView.startsWith('admin_') && (
        <>
          <div className="d-flex align-items-center bg-body-tertiary rounded-pill border px-3 py-1 d-none d-md-flex" style={{maxWidth: '250px'}}>
            <i className="bi bi-search text-muted"></i>
            <input type="text" className="form-control bg-transparent border-0 shadow-none text-body ms-2 p-0 search-input" placeholder="Search products..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentView('store');}}/>
          </div>
          
          <button className="btn btn-outline-secondary border-0 position-relative rounded-circle d-none d-md-block" onClick={() => setCurrentView('wishlist')}>
            <i className="bi bi-heart fs-5 text-body"></i>
            {likedItems.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{likedItems.length}</span>}
          </button>

          <button className="btn btn-outline-secondary border-0 position-relative rounded-circle" onClick={() => setIsCartOpen(true)}>
            <i className="bi bi-cart3 fs-5 text-body"></i>
            {totalQuantity > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{totalQuantity}</span>}
          </button>

          <button className="btn btn-outline-secondary border-0 position-relative rounded-circle d-none d-md-block" onClick={() => {
            if (!userRole) {
              setIsSignUpMode(false);
              setShowLoginModal(true);
            } else {
              fetchOrders();
              setCurrentView('customer_orders');
            }
          }}>
            <i className="bi bi-bag fs-5 text-body"></i>
          </button>
        </>
      )}

      {/* --- PROFILE DROPDOWN (Always Visible) --- */}
      <div className="position-relative">
        <button className={`btn rounded-circle ${userRole ? 'btn-primary' : 'btn-outline-secondary border-0'}`} onClick={() => userRole ? setIsUserMenuOpen(!isUserMenuOpen) : setShowLoginModal(true)}>
          <i className={`bi bi-person fs-5 ${userRole ? 'text-white' : 'text-body'}`}></i>
        </button>

                {isUserMenuOpen && userRole && (
                  <div className="position-absolute end-0 mt-3 bg-body rounded-4 shadow border overflow-hidden animate-dropdown" style={{width: '260px', zIndex: 1050}}>
                    
                    <div className="px-3 py-4 border-bottom text-center bg-body-tertiary">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm" style={{width: '50px', height: '50px', fontSize: '1.5rem'}}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="fw-bold fs-5 text-body">{userName}</div>
                    </div>
                    
                    <div className="p-2">
                      <button className={`btn btn-sm w-100 text-start fw-semibold mb-1 py-2 ${currentView === 'profile' ? 'bg-primary text-white' : 'btn-light text-body bg-transparent'}`} onClick={() => {setCurrentView('profile'); setIsUserMenuOpen(false);}}>
                        <i className="bi bi-person-circle me-2"></i> My Profile
                      </button>
                      
                      <button className="btn btn-sm w-100 text-start fw-semibold mb-1 py-2 btn-light text-body bg-transparent" onClick={() => {setIsDarkMode(!isDarkMode); setIsUserMenuOpen(false);}}>
                        <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'} me-2`}></i> 
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </button>

                      <button className={`btn btn-sm w-100 text-start fw-semibold mb-1 py-2 ${currentView === 'support' ? 'bg-primary text-white' : 'btn-light text-body bg-transparent'}`} onClick={() => {setCurrentView('support'); setIsUserMenuOpen(false);}}>
                        <i className="bi bi-question-circle me-2"></i> Help & Support
                      </button>

                      {userRole === 'admin' && (
                        <div className="mt-2 pt-2 border-top">
                          <small className="text-muted text-uppercase fw-bold ms-2" style={{fontSize: '10px'}}>Admin Tools</small>
                          <button 
                            className={`btn btn-sm w-100 text-start fw-semibold mb-1 py-2 mt-1 ${currentView.startsWith('admin_') ? 'bg-primary text-white' : 'btn-light text-body bg-transparent'}`} 
                            onClick={() => { fetchOrders(); setCurrentView('admin_dashboard'); setIsUserMenuOpen(false); }}
                          >
                            <i className="bi bi-shield-lock-fill me-2"></i> Admin Dashboard
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-top p-2 bg-body-tertiary">
                       <button className="btn btn-outline-danger btn-sm w-100 fw-bold py-2" onClick={() => { setShowLogoutConfirm(true); setIsUserMenuOpen(false); }}>
  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* --- Main Content Wrapper (Animated) --- */}
      <div key={currentView} className="animate-view">
        
        {currentView === 'store' && (
          <div className="position-relative w-100 mb-5 overflow-hidden" style={{ minHeight: '400px', backgroundColor: '#8f959b' }}>
            <div className="d-flex w-100 h-100" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)', minHeight: '400px' }}>
              {heroSlides.map((slide) => (
                <div key={slide.id} className="w-100 flex-shrink-0 position-relative d-flex align-items-center" style={{ minHeight: '400px', backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                  <div className="position-relative" style={{ paddingLeft: '8%', zIndex: 2 }}>
                    <h1 className="text-white mb-0" style={{ fontSize: '6rem', fontWeight: 300, letterSpacing: '-2px', lineHeight: '1.1' }}>{slide.text1}</h1>
                    <h1 className="text-white mb-0" style={{ fontSize: '6rem', fontWeight: 300, letterSpacing: '-2px', lineHeight: '1.1', marginLeft: '4rem' }}>{slide.text2}</h1>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn text-white position-absolute top-50 start-0 translate-middle-y ms-4 p-2 shadow-none border-0" onClick={prevSlide} style={{ zIndex: 10, background: 'rgba(0,0,0,0.2)', borderRadius: '50%' }}><i className="bi bi-chevron-left fs-3"></i></button>
            <button className="btn text-white position-absolute top-50 end-0 translate-middle-y me-4 p-2 shadow-none border-0" onClick={nextSlide} style={{ zIndex: 10, background: 'rgba(0,0,0,0.2)', borderRadius: '50%' }}><i className="bi bi-chevron-right fs-3"></i></button>

            <div className="position-absolute bottom-0 end-0 mb-4 me-5 d-flex gap-2" style={{ zIndex: 10 }}>
              {heroSlides.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`btn p-0 rounded-circle ${currentSlide === index ? 'bg-white' : 'bg-white opacity-50'}`} style={{ width: '12px', height: '12px', border: 'none', transition: 'all 0.3s ease' }}></button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'checkout' && (
          <div className="container-fluid vh-100 p-0 bg-body overflow-hidden">
            <div className="row g-0 h-100">
              
              <div className="col-md-5 bg-body border-end p-4 p-md-5 h-100 overflow-y-auto checkout-scroll">
                <button className="btn btn-link text-primary text-decoration-none px-0 mb-5 fw-semibold" onClick={() => { setCurrentView('store'); setCheckoutPhase('shipping'); }}>
                  <i className="bi bi-arrow-left fs-4"></i> 
                </button>
                <h4 className="fw-bold mb-4 text-body">Order Summary</h4>
                
                <div className="mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex align-items-center mb-3">
                      <div className="bg-body-tertiary rounded border d-flex align-items-center justify-content-center me-3 overflow-hidden" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="bi bi-image text-muted fs-4"></i>}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold text-body">{item.name}</span>
                          <span className="fw-bold text-body">${(item.basePrice * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center bg-body-tertiary border rounded px-2 py-1">
                            <button className="btn btn-sm p-0 text-muted" style={{border: 'none'}} onClick={() => handleCartDecrement(item)}><i className="bi bi-dash"></i></button>
                            <span className="mx-3 small fw-bold text-body">{item.quantity}</span>
                            <button className="btn btn-sm p-0 text-muted" style={{border: 'none'}} onClick={() => handleCartIncrement(item)}><i className="bi bi-plus"></i></button>
                          </div>
                          <button className="btn btn-link text-muted p-0" onClick={() => handleCartRemove(item)}><i className="bi bi-trash3"></i></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4 pt-3 border-top">
                  <label className="form-label small fw-bold text-muted mb-2">Gift Card / Discount code</label>
                  <div className="d-flex gap-2">
                    <input type="text" className="form-control bg-body-tertiary border-0 shadow-none text-body" placeholder="" />
                    <button className="btn btn-outline-primary px-4 fw-semibold">Apply</button>
                  </div>
                </div>

                <div className="pt-4 border-top pb-5">
                  <div className="d-flex justify-content-between mb-3 small fw-semibold text-muted">
                    <span>Subtotal</span>
                    <span className="text-body">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 small fw-semibold text-muted">
                    <span>Sales tax (6.5%)</span>
                    <span className="text-body">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-4 small fw-semibold text-muted">
                    <span>Shipping Fee</span>
                    <span className={shippingCost === 0 ? "text-success fw-bold" : "text-body fw-bold"}>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-3 border-top">
                    <span className="fw-bold text-body">Total due</span>
                    <span className="fw-bold fs-5 text-primary">${finalTotalDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-7 p-4 p-md-5 bg-body-tertiary h-100 overflow-y-auto checkout-scroll">
                
                <div className="d-flex align-items-center mb-5 mt-2 justify-content-center">
                  <span className={`fw-bold me-3 ${checkoutPhase === 'shipping' ? 'text-primary' : 'text-muted opacity-75'}`} style={{fontSize: '1.1rem'}}>Shipping</span>
                  <div style={{height: '2px', width: '30px', backgroundColor: 'var(--bs-border-color)'}} className="mx-2"></div>
                  <i className={`bi bi-check-circle-fill fs-5 ${checkoutPhase !== 'shipping' ? 'text-body' : 'text-muted opacity-50'}`}></i>
                  <div style={{height: '2px', width: '30px', backgroundColor: 'var(--bs-border-color)'}} className="mx-2"></div>
                  <span className={`fw-bold me-3 ${checkoutPhase === 'delivery' ? 'text-primary' : 'text-muted opacity-75'}`} style={{fontSize: '1.1rem'}}>Delivery</span>
                  <div style={{height: '2px', width: '30px', backgroundColor: 'var(--bs-border-color)'}} className="mx-2"></div>
                  <i className={`bi bi-check-circle-fill fs-5 ${checkoutPhase === 'payment' ? 'text-body' : 'text-muted opacity-50'}`}></i>
                  <div style={{height: '2px', width: '30px', backgroundColor: 'var(--bs-border-color)'}} className="mx-2"></div>
                  <span className={`fw-bold ${checkoutPhase === 'payment' ? 'text-primary' : 'text-muted opacity-75'}`} style={{fontSize: '1.1rem'}}>Payment</span>
                </div>

                {checkoutPhase === 'shipping' && (
                  <div className="animate-view">
                    
                    {userRole && savedAddresses.length > 0 && (
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-muted mb-2">Use a Saved Address</label>
                        <div className="d-flex gap-3 overflow-auto pb-2">
                          {savedAddresses.map(addr => (
                            <div 
                              key={addr.id} 
                              className={`card p-3 shadow-sm ${selectedSavedAddress === addr.id ? 'selected-card' : 'border bg-body'}`} 
                              style={{cursor: 'pointer', minWidth: '220px'}} 
                              onClick={() => setSelectedSavedAddress(prev => prev === addr.id ? null : addr.id)}
                            >
                              <div className="fw-bold text-body small mb-1"><i className="bi bi-geo-alt-fill text-primary me-2"></i>{addr.name}</div>
                              <div className="text-muted small" style={{fontSize: '0.75rem'}}>{addr.address}, {addr.city}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center text-muted small my-3 fw-bold">OR ENTER A NEW ADDRESS</div>
                      </div>
                    )}

                    <div className="bg-body p-4 rounded shadow-sm border-0 mb-4">
                      <h5 className="fw-bold text-body mb-4">Contact Details</h5>
                      <div className="row g-3">
                        <div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">First Name</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" /></div>
                        <div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">Last Name</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" /></div>
                        <div className="col-12"><label className="form-label small fw-semibold text-muted mb-1">Email</label><input type="email" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={userEmail || ''} readOnly={!!userEmail}/></div>
                        <div className="col-12"><label className="form-label small fw-semibold text-muted mb-1">Phone Number</label>
                          <div className="input-group">
                            <select className="form-select bg-body-tertiary border-0 shadow-none text-muted py-2" style={{maxWidth: '100px'}}><option>+ 91</option><option>+ 1</option><option>+ 63</option></select>
                            <input type="tel" className="form-control bg-body-tertiary border-0 shadow-none py-2 ms-2 rounded text-body" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-body p-4 rounded shadow-sm border-0 mb-5">
                      <h5 className="fw-bold text-body mb-4">Shipping Details</h5>
                      <div className="row g-3">
                       <div className="col-12"><label className="form-label small fw-semibold text-muted mb-1">Flat/House no.</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={shipFlat} onChange={(e) => setShipFlat(e.target.value)} onFocus={() => setSelectedSavedAddress(null)} /></div>

<div className="col-12"><label className="form-label small fw-semibold text-muted mb-1">Address</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={shipStreet} onChange={(e) => setShipStreet(e.target.value)} onFocus={() => setSelectedSavedAddress(null)} /></div>

<div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">City</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={shipCity} onChange={(e) => setShipCity(e.target.value)} onFocus={() => setSelectedSavedAddress(null)} /></div>

<div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">State</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={shipState} onChange={(e) => setShipState(e.target.value)} onFocus={() => setSelectedSavedAddress(null)} /></div>

<div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">Postal Code</label><input type="text" className="form-control bg-body-tertiary border-0 shadow-none py-2 text-body" value={shipZip} onChange={(e) => setShipZip(e.target.value)} onFocus={() => setSelectedSavedAddress(null)} /></div>
                        <div className="col-12 mt-4">
                          <div className="form-check d-flex align-items-center">
                            <input className="form-check-input me-2 shadow-none" type="checkbox" id="billingSame" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} style={{width: '18px', height: '18px'}} />
                            <label className="form-check-label small text-muted mt-1 fw-semibold" htmlFor="billingSame">My shipping and Billing address are the same</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-end pb-5">
                      <button className="btn px-5 py-2 fw-semibold text-white rounded btn-primary" onClick={() => setCheckoutPhase('delivery')}>Continue</button>
                    </div>
                  </div>
                )}

                {checkoutPhase === 'delivery' && (
                  <div className="animate-view">
                    <div className="bg-body p-4 rounded shadow-sm border-0 mb-5">
                      <h5 className="fw-bold text-body mb-4">Delivery Options</h5>
                      <div className="list-group list-group-flush">
                        <label className="list-group-item d-flex justify-content-between align-items-center border-0 mb-3 rounded bg-body-tertiary p-3" style={{cursor: 'pointer'}}>
                          <div className="d-flex align-items-center fw-semibold text-body">
                            <input className="form-check-input me-3 shadow-none mt-0" type="radio" name="delivery" style={{width: '20px', height: '20px'}} checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                            Standard 5-7 Business Days
                          </div>
                          <span className="text-success fw-bold small">FREE</span>
                        </label>
                        <label className="list-group-item d-flex justify-content-between align-items-center border-0 mb-3 rounded bg-body-tertiary p-3" style={{cursor: 'pointer'}}>
                          <div className="d-flex align-items-center fw-semibold text-body">
                            <input className="form-check-input me-3 shadow-none mt-0" type="radio" name="delivery" style={{width: '20px', height: '20px'}} checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                            2-4 Business Days
                          </div>
                          <span className="text-muted fw-bold small">+$30.00</span>
                        </label>
                        <label className="list-group-item d-flex justify-content-between align-items-center border-0 rounded bg-body-tertiary p-3" style={{cursor: 'pointer'}}>
                          <div className="d-flex align-items-center fw-semibold text-body">
                            <input className="form-check-input me-3 shadow-none mt-0" type="radio" name="delivery" style={{width: '20px', height: '20px'}} checked={shippingMethod === 'sameday'} onChange={() => setShippingMethod('sameday')} />
                            Same day delivery
                          </div>
                          <span className="text-muted fw-bold small">+$90.00</span>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-5">
                      <button className="btn btn-outline-secondary px-5 py-2 fw-semibold rounded" onClick={() => setCheckoutPhase('shipping')}>Back</button>
                      <button className="btn btn-primary px-5 py-2 fw-semibold text-white rounded" onClick={() => setCheckoutPhase('payment')}>Continue</button>
                    </div>
                  </div>
                )}

                {checkoutPhase === 'payment' && (
                  <div className="animate-view">
                    
                    {/* --- PAYMENT METHODS AT THE TOP --- */}
                    <div className="bg-body p-4 rounded shadow-sm border-0 mb-4">
                      <h5 className="fw-bold text-body mb-4">Payment Methods</h5>
                      
                      <div className="list-group list-group-flush gap-2">
                        {/* Pay on Delivery */}
                        <label className={`list-group-item border rounded p-3 bg-body ${selectedPaymentType === 'delivery' ? 'border-primary' : ''}`} style={{cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <input 
                              className="form-check-input me-3 shadow-none mt-0" 
                              type="radio" 
                              style={{width: '18px', height: '18px'}} 
                              checked={selectedPaymentType === 'delivery'} 
                              onChange={() => {
                                setSelectedPaymentType('delivery'); 
                                setSelectedSavedPayment(null);
                                setPaymentArrangement(100); 
                              }} 
                            />
                            <div><span className="d-block fw-semibold text-body">Pay on Delivery</span><span className="small text-muted">Pay with cash on delivery</span></div>
                          </div>
                        </label>

                        {/* Credit/Debit Cards */}
                        <div className={`list-group-item border rounded p-3 bg-body ${selectedPaymentType === 'credit' ? 'border-primary' : ''}`} style={{cursor: 'pointer'}} onClick={(e) => { if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') { setSelectedPaymentType('credit'); } }}>
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="d-flex align-items-center">
                              <input className="form-check-input me-3 shadow-none mt-0" type="radio" style={{width: '18px', height: '18px'}} checked={selectedPaymentType === 'credit'} onChange={() => setSelectedPaymentType('credit')} />
                              <div><span className="d-block fw-semibold text-body">Credit/Debit Cards</span><span className="small text-muted">Pay with your Credit / Debit Card</span></div>
                            </div>
                            <div><span className="badge bg-body-tertiary text-body border me-1 rounded-1 px-2 py-1"><i className="bi bi-credit-card-2-front-fill text-primary"></i> VISA</span></div>
                          </div>
                          
                          {selectedPaymentType === 'credit' && (
                            <div className="mt-4 pt-3 border-top animate-view">
                               {/* SAVED CARDS OPTION */}
                               {userRole && savedPayments.length > 0 && (
                                 <div className="mb-4 border-bottom pb-4">
                                   <label className="form-label small fw-bold text-muted mb-2">Use a Saved Card</label>
                                   <div className="d-flex gap-3 overflow-auto pb-2">
                                     {savedPayments.map(pay => (
                                       <div 
                                         key={pay.id} 
                                         className={`card p-3 shadow-sm ${selectedSavedPayment === pay.id ? 'selected-card' : 'border bg-body'}`} 
                                         style={{cursor: 'pointer', minWidth: '220px'}} 
                                         onClick={(e) => { e.stopPropagation(); setSelectedSavedPayment(prev => prev === pay.id ? null : pay.id); }}
                                       >
                                         <div className="fw-bold text-body small mb-1"><i className="bi bi-credit-card-fill text-primary me-2"></i>{pay.type} ending in {pay.last4}</div>
                                         <div className="text-muted small" style={{fontSize: '0.75rem'}}>Expires {pay.expiry}</div>
                                       </div>
                                     ))}
                                   </div>
                                   <div className="text-center text-muted small mt-3 fw-bold">OR ENTER A NEW CARD BELOW</div>
                                 </div>
                               )}

                               <div className="mb-3">
                                 <div className="input-group bg-body border rounded">
                                   <input type="text" className="form-control border-0 shadow-none py-2 bg-transparent text-body" placeholder="Card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} onFocus={() => setSelectedSavedPayment(null)} />
                                   <span className="input-group-text bg-transparent border-0 text-muted"><i className="bi bi-credit-card-fill"></i></span>
                                 </div>
                               </div>
                               <div className="row g-3">
                                 <div className="col-6">
                                   <div className="input-group bg-body border rounded">
                                     <input type="text" className="form-control border-0 shadow-none py-2 bg-transparent text-body" placeholder="MM / YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} onFocus={() => setSelectedSavedPayment(null)} />
                                     <span className="input-group-text bg-transparent border-0 text-muted"><i className="bi bi-calendar-event"></i></span>
                                   </div>
                                 </div>
                                 <div className="col-6">
                                   <div className="input-group bg-body border rounded">
                                     <input type="text" className="form-control border-0 shadow-none py-2 bg-transparent text-body" placeholder="CVV" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} onFocus={() => setSelectedSavedPayment(null)} />
                                     <span className="input-group-text bg-transparent border-0 text-muted"><i className="bi bi-lock-fill"></i></span>
                                   </div>
                                 </div>
                               </div>

                               {/* --- CONDITIONAL BILLING ADDRESS (Inside Credit Card View) --- */}
                               {!billingSame && (
                                 <div className="mt-4 pt-4 border-top animate-view">
                                   <h6 className="fw-bold text-body mb-3">Billing Address</h6>
                                   <div className="row g-3">
                                     <div className="col-12"><label className="form-label small fw-semibold text-muted mb-1">Flat/House no.</label><input type="text" className="form-control bg-transparent border shadow-none py-2 text-body" /></div>
                                     <div className="col-12"><label className="form-label small fw-semibold text-muted mb-1">Address</label><input type="text" className="form-control bg-transparent border shadow-none py-2 text-body" /></div>
                                     <div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">City</label><input type="text" className="form-control bg-transparent border shadow-none py-2 text-body" /></div>
                                     <div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">State</label><input type="text" className="form-control bg-transparent border shadow-none py-2 text-body" /></div>
                                     <div className="col-md-6"><label className="form-label small fw-semibold text-muted mb-1">Postal Code</label><input type="text" className="form-control bg-transparent border shadow-none py-2 text-body" /></div>
                                   </div>
                                 </div>
                               )}
                            </div>
                          )}
                        </div>

                        {/* Direct Bank Transfer */}
                        <label className={`list-group-item border rounded p-3 bg-body ${selectedPaymentType === 'bank' ? 'border-primary' : ''}`} style={{cursor: 'pointer'}}>
                          <div className="d-flex align-items-center">
                            <input className="form-check-input me-3 shadow-none mt-0" type="radio" style={{width: '18px', height: '18px'}} checked={selectedPaymentType === 'bank'} onChange={() => {setSelectedPaymentType('bank'); setSelectedSavedPayment(null);}} />
                            <div><span className="d-block fw-semibold text-body">Direct Bank Transfer</span><span className="small text-muted">Make payment directly through bank account.</span></div>
                          </div>
                        </label>

                        {/* Other Payment Methods */}
                        <label className={`list-group-item border rounded p-3 bg-body ${selectedPaymentType === 'other' ? 'border-primary' : ''}`} style={{cursor: 'pointer'}}>
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="d-flex align-items-center">
                              <input className="form-check-input me-3 shadow-none mt-0" type="radio" style={{width: '18px', height: '18px'}} checked={selectedPaymentType === 'other'} onChange={() => setSelectedPaymentType('other')} />
                              <div><span className="d-block fw-semibold text-body">Other Payment Methods</span><span className="small text-muted">Make payment through Gpay, Paypal, Paytm etc</span></div>
                            </div>
                            <div><span className="badge bg-body-tertiary text-body border me-1 rounded-1 px-2 py-1"><i className="bi bi-paypal text-primary"></i></span></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* --- CONDITIONAL PAYMENT ARRANGEMENTS --- */}
                    {selectedPaymentType !== 'delivery' && (
                      <div className="bg-body p-4 rounded shadow-sm border-0 mb-5 animate-view">
                        <h5 className="fw-bold text-body mb-4">Payment Arrangements</h5>
                        <div className="d-flex flex-wrap gap-2">
                          <button className={`btn ${paymentArrangement === 100 ? 'btn-primary' : 'btn-outline-secondary'} px-4 py-2 fw-semibold rounded shadow-none`} onClick={() => setPaymentArrangement(100)}>Pay Full</button>
                          <button className={`btn ${paymentArrangement === 50 ? 'btn-primary' : 'btn-outline-secondary'} px-4 py-2 fw-semibold rounded shadow-none`} onClick={() => setPaymentArrangement(50)}>Pay 50%</button>
                          <button className={`btn ${paymentArrangement === 30 ? 'btn-primary' : 'btn-outline-secondary'} px-4 py-2 fw-semibold rounded shadow-none`} onClick={() => setPaymentArrangement(30)}>Pay 30%</button>
                          <button className={`btn ${paymentArrangement === 20 ? 'btn-primary' : 'btn-outline-secondary'} px-4 py-2 fw-semibold rounded shadow-none`} onClick={() => setPaymentArrangement(20)}>Pay 20%</button>
                        </div>
                        <div className="small text-muted mt-3"><i className="bi bi-info-circle me-1"></i>You are opting to pay <strong>{paymentArrangement}%</strong> of the total today. The remaining balance will be added to your invoice ledger.</div>
                      </div>
                    )}

                    {/* --- ACTIONS --- */}
                    <div className="d-flex justify-content-between align-items-center pb-5">
                      <button className="btn btn-outline-secondary px-5 py-2 fw-semibold rounded" onClick={() => setCheckoutPhase('delivery')}>Back</button>
                      <button className="btn btn-primary px-4 py-2 fw-semibold text-white rounded d-flex align-items-center gap-2" onClick={simulatePayment} disabled={isProcessingPayment || (selectedPaymentType === 'credit' && !cardNumber && !selectedSavedPayment)}>
                        {isProcessingPayment ? (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...</>) : (`Pay $${amountToPayToday.toFixed(2)}`)}
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* --- STANDARD VIEWS CONTAINER --- */}
        {currentView !== 'checkout' && (
          <div className="container-fluid px-4">
            
            {currentView === 'store' && (
              <div className="row">
                <div className="col-md-3 d-none d-md-block">
                  <div className="bg-body p-4 rounded-4 shadow-sm position-sticky border" style={{top: '100px'}}>
                    <h6 className="fw-bold mb-4 text-body"><i className="bi bi-funnel"></i> Filters</h6>
                    <div className="mb-4">
                      <div className="fw-bold mb-3 d-flex justify-content-between text-body">Categories</div>
                      {categoryOptions.map(category => (
                        <div className="form-check text-muted mb-2" key={category}>
                          <input className="form-check-input" type="checkbox" id={`cat-${category}`} checked={selectedCategories.includes(category)} onChange={() => handleCategoryToggle(category)} />
                          <label className="form-check-label w-100 text-body" htmlFor={`cat-${category}`}>{category}</label>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4 border-top pt-4">
                      <div className="fw-bold mb-3 d-flex justify-content-between text-body">Max Price: <span className="text-primary">${maxPrice}</span></div>
                      <input type="range" className="form-range" min="0" max="200" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
                    </div>
                    <button className="btn btn-outline-danger btn-sm w-100 rounded-pill fw-bold" onClick={() => {setSelectedCategories([]); setSearchQuery(''); setMaxPrice(200);}}>Clear Filters</button>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 bg-body p-3 rounded-4 shadow-sm border">
                    <span className="text-muted fw-semibold">Showing {displayProducts.length} Product{displayProducts.length !== 1 ? 's' : ''}</span>
                    <div className="d-flex gap-3 align-items-center align-self-stretch align-self-md-auto justify-content-between">
                      <div className="btn-group shadow-sm">
                        <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('grid')}><i className="bi bi-grid-fill"></i></button>
                        <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('list')}><i className="bi bi-list-ul"></i></button>
                      </div>
                      <select className="form-select form-select-sm fw-semibold bg-body-tertiary text-body border-0" style={{width: 'auto'}} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="relevance">Sort by: Relevance</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Alphabetical (A-Z)</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    {displayProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        viewMode={viewMode} 
                        
                        /* --- FIX: Wrap these two in arrow functions --- */
                        onViewDetails={() => setSelectedProduct(product)} 
                        onToggleLike={() => toggleLike(product)}
                        /* ---------------------------------------------- */
                        
                        isLiked={!!likedItems.find(i => i.id === product.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMER ORDERS VIEW */}
            {currentView === 'customer_orders' && userRole && (
              <div className="row justify-content-center pb-5">
                <div className="col-lg-10 col-xl-8 mt-4">
                  <button className="btn btn-link text-body text-decoration-none px-0 mb-3 fw-semibold" onClick={() => setCurrentView('store')}>
                    <i className="bi bi-arrow-left me-2"></i> Back to Store
                  </button>
                  
                  <h4 className="fw-bold mb-4 text-body">My Orders</h4>
                  
                  <div className="bg-body rounded-4 shadow-sm overflow-hidden mb-4 border">
                    <div className="d-flex overflow-auto border-bottom" style={{ whiteSpace: 'nowrap' }}>
                      {orderTabs.map(tab => (
                        <button 
                          key={tab} 
                          className={`btn rounded-0 px-4 py-3 fw-bold flex-grow-1 ${activeOrderTab === tab ? 'border-bottom border-primary border-3 text-primary' : 'text-muted border-0'}`}
                          onClick={() => setActiveOrderTab(tab)}
                          style={{ boxShadow: 'none' }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {filteredCustomerOrders.length === 0 ? (
                      <div className="text-center py-5 bg-body rounded-4 shadow-sm border">
                        <i className="bi bi-bag-x text-muted mb-3 d-block" style={{ fontSize: '4rem' }}></i>
                        <h5 className="fw-bold text-body">No orders found</h5>
                        <p className="text-muted">You don't have any orders in '{activeOrderTab}' right now.</p>
                        <button className="btn btn-primary rounded-pill px-4 fw-semibold mt-2" onClick={() => setCurrentView('store')}>Continue Shopping</button>
                      </div>
                    ) : (
                      filteredCustomerOrders.map(order => (
                        <div className="card border shadow-sm rounded-4 p-4 bg-body" key={order.id}>
                          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <span className="fw-bold text-muted"><i className="bi bi-shop me-2"></i>BizBuy • Order #{order.id}</span>
                            <span className={`badge ${order.balance_due > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>{order.payment_status}</span>
                          </div>
                          
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-3">
                              <div className="bg-body-tertiary border rounded d-flex align-items-center justify-content-center me-3" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-image text-muted fs-3"></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-body mb-1">{item.name}</h6>
                                <div className="text-muted small mb-2">Variation: Default</div>
                                <span className="fw-semibold px-2 py-1 bg-body-tertiary rounded text-body small">x{item.quantity}</span>
                              </div>
                              <div className="fw-bold text-body">${item.price.toFixed(2)}</div>
                            </div>
                          ))}
                          
                          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
                            <div className="text-muted small">Placed recently</div>
                            <div className="d-flex align-items-center">
                              <span className="text-muted me-3">Order Total:</span>
                              <h4 className="fw-bold mb-0 text-primary">${order.final_total.toFixed(2)}</h4>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end gap-2 mt-4">
                            {order.balance_due > 0 && <button className="btn btn-primary fw-semibold px-4 rounded-pill">Pay Balance</button>}
                            <button className="btn btn-outline-secondary fw-semibold px-4 rounded-pill">View Details</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- WISHLIST VIEW --- */}
            {currentView === 'wishlist' && (
              <div className="row justify-content-center pb-5">
                <div className="col-lg-10 col-xl-8 mt-4">
                  <button className="btn btn-link text-body text-decoration-none px-0 mb-3 fw-semibold" onClick={() => setCurrentView('store')}>
                    <i className="bi bi-arrow-left me-2"></i> Back to Store
                  </button>
                  
                  <h4 className="fw-bold mb-4 text-body"><i className="bi bi-heart-fill text-danger me-2"></i>My Wishlist</h4>
                  
                  <div className="bg-body rounded-4 shadow-sm overflow-hidden mb-4 border p-4">
                    {likedItems.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-heartbreak text-muted mb-3 d-block" style={{ fontSize: '4rem' }}></i>
                        <h5 className="fw-bold text-body">Your wishlist is empty</h5>
                        <button className="btn btn-primary rounded-pill px-4 fw-semibold mt-2" onClick={() => setCurrentView('store')}>Explore Products</button>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {likedItems.map((item) => (
                          <div key={item.id} className="card border shadow-sm rounded-4 p-3 bg-body d-flex flex-row align-items-center">
                            <div className="bg-body-tertiary border rounded d-flex align-items-center justify-content-center me-3" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> : <i className="bi bi-image text-muted fs-3"></i>}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold text-body mb-1">{item.name}</h6>
                              <div className="fw-bold text-primary">${item.basePrice.toFixed(2)}</div>
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-2">
                              <button className="btn btn-sm btn-primary rounded-pill fw-semibold px-3" onClick={() => setSelectedProduct(item)}>View</button>
                              <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => toggleLike(item)}><i className="bi bi-trash3"></i></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- PROFILE VIEW --- */}
            {currentView === 'profile' && userRole && (
               <div className="row justify-content-center pb-5">
                 <div className="col-lg-8 mt-4">
                   <button className="btn btn-link text-body text-decoration-none px-0 mb-3 fw-semibold" onClick={() => setCurrentView('store')}>
                     <i className="bi bi-arrow-left me-2"></i> Back to Store
                   </button>

                   <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body mb-4">
                     <div className="card-header bg-primary text-white fw-bold py-3"><i className="bi bi-person-circle me-2"></i>My Profile</div>
                     <div className="card-body p-5 text-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{width: '100px', height: '100px', fontSize: '3rem'}}>
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="fw-bold text-body">{userName}</h3>
                        <p className="text-muted mb-4">{userEmail}</p>
                        <div className="d-flex justify-content-center gap-3">
                          <button className="btn btn-outline-primary fw-semibold px-4 rounded-pill" onClick={() => setCurrentView('edit_profile')}>Edit Details</button>
                          <button className="btn btn-outline-secondary fw-semibold px-4 rounded-pill" onClick={() => setCurrentView('change_password')}>Change Password</button>
                        </div>
                     </div>
                   </div>

                   {/* Saved Addresses List */}
                   <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body mb-4">
                     <div className="card-header bg-dark text-white fw-bold py-3"><i className="bi bi-geo-alt-fill me-2"></i>Saved Addresses</div>
                     <div className="card-body p-4">
                        {savedAddresses.map(addr => (
                          <div key={addr.id} className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <div>
                              <h6 className="fw-bold text-body mb-1">{addr.name} {addr.isDefault && <span className="badge bg-primary ms-2 small">Default</span>}</h6>
                              <div className="text-muted small">{addr.address}<br/>{addr.city}, {addr.state} {addr.zip}</div>
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setAddressToEdit(addr); setCurrentView('edit_address'); }}><i className="bi bi-pencil"></i></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(addr.id)}><i className="bi bi-trash"></i></button>
                            </div>
                          </div>
                        ))}
                        <button className="btn btn-outline-primary fw-semibold rounded-pill w-100 mt-2" onClick={() => setCurrentView('add_address')}><i className="bi bi-plus-circle me-2"></i> Add New Address</button>
                     </div>
                   </div>

                   {/* Saved Payments List */}
                   <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body">
                     <div className="card-header bg-dark text-white fw-bold py-3"><i className="bi bi-credit-card-2-front-fill me-2"></i>Saved Payment Info</div>
                     <div className="card-body p-4">
                        {savedPayments.map(pay => (
                          <div key={pay.id} className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-credit-card-fill fs-2 text-primary me-3"></i>
                              <div>
                                <h6 className="fw-bold text-body mb-1">{pay.type} ending in {pay.last4} {pay.isDefault && <span className="badge bg-primary ms-2 small">Default</span>}</h6>
                                <div className="text-muted small">Expires {pay.expiry}</div>
                              </div>
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setPaymentToEdit(pay); setCurrentView('edit_payment'); }}><i className="bi bi-pencil"></i></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePayment(pay.id)}><i className="bi bi-trash"></i></button>
                          </div>
                          </div>
                        ))}
                        <button className="btn btn-outline-primary fw-semibold rounded-pill w-100 mt-2" onClick={() => setCurrentView('add_payment')}><i className="bi bi-plus-circle me-2"></i> Add New Payment Method</button>
                     </div>
                   </div>

                 </div>
               </div>
            )}

            {/* --- EDIT PROFILE VIEW --- */}
            {currentView === 'edit_profile' && userRole && (
              <EditProfile 
                initialName={userName} 
                initialEmail={userEmail} 
                onSave={handleProfileUpdate} 
                onCancel={() => setCurrentView('profile')} 
              />
            )}

            {/* --- CHANGE PASSWORD VIEW --- */}
            {currentView === 'change_password' && userRole && (
              <ChangePassword 
                onSave={handlePasswordUpdate} 
                onCancel={() => setCurrentView('profile')} 
              />
            )}

            {/* --- ADD ADDRESS VIEW --- */}
            {currentView === 'add_address' && userRole && (
              <AddAddress 
                onSave={handleSaveNewAddress} 
                onCancel={() => setCurrentView('profile')} 
              />
            )}

            {/* --- ADD PAYMENT VIEW --- */}
            {currentView === 'add_payment' && userRole && (
              <AddPayment 
                onSave={handleSaveNewPayment} 
                onCancel={() => setCurrentView('profile')} 
              />
            )}

            {/* --- EDIT ADDRESS VIEW --- */}
            {currentView === 'edit_address' && userRole && addressToEdit && (
              <EditAddress 
                addressData={addressToEdit} 
                onSave={handleUpdateAddress} 
                onCancel={() => setCurrentView('profile')} 
              />
            )}

            {/* --- EDIT PAYMENT VIEW --- */}
            {currentView === 'edit_payment' && userRole && paymentToEdit && (
              <EditPayment 
                paymentData={paymentToEdit} 
                onSave={handleUpdatePayment} 
                onCancel={() => setCurrentView('profile')} 
              />
            )}

            {/* --- ORDER SUCCESS VIEW --- */}
            {currentView === 'order_success' && successOrderDetails && (
              <OrderSuccess 
                orderDetails={successOrderDetails}
                onContinue={() => {
                  setSuccessOrderDetails(null);
                  setCurrentView('store');
                }}
              />
            )}

            {/* --- SUPPORT VIEW --- */}
            {currentView === 'support' && (
              <div className="row justify-content-center pb-5">
                <div className="col-lg-8 mt-4">
                  <button className="btn btn-link text-body text-decoration-none px-0 mb-3 fw-semibold" onClick={() => setCurrentView('store')}>
                    <i className="bi bi-arrow-left me-2"></i> Back to Store
                  </button>

                  <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body">
                    <div className="card-header bg-dark text-white fw-bold py-3"><i className="bi bi-question-circle me-2"></i>Help & Support</div>
                    <div className="card-body p-5">
                        <h4 className="fw-bold text-body mb-3">How can we help you today?</h4>
                        <p className="text-muted mb-4">Search our knowledge base or send us a message below.</p>
                        <input type="text" className="form-control bg-body-tertiary border-0 shadow-none mb-4 py-3 text-body" placeholder="Search for answers..." />
                        
                        <h6 className="fw-bold text-body mt-4">Frequently Asked Questions</h6>
                        <div className="accordion mt-3" id="faqAccordion">
                          <div className="accordion-item border-0 border-bottom bg-transparent">
                            <h2 className="accordion-header"><button className="accordion-button collapsed bg-transparent shadow-none fw-semibold text-body" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">What is the Minimum Order Quantity (MOQ)?</button></h2>
                            <div id="collapseOne" className="accordion-collapse collapse"><div className="accordion-body text-muted small">Our standard B2B MOQ is 20 items per order to qualify for wholesale pricing.</div></div>
                          </div>
                          <div className="accordion-item border-0 border-bottom bg-transparent">
                            <h2 className="accordion-header"><button className="accordion-button collapsed bg-transparent shadow-none fw-semibold text-body" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">How do payment terms work?</button></h2>
                            <div id="collapseTwo" className="accordion-collapse collapse"><div className="accordion-body text-muted small">We offer Net 30 terms allowing you to pay 20%, 30%, or 50% upfront, with the balance due later.</div></div>
                          </div>
                        </div>

                        <button className="btn btn-primary fw-bold px-4 rounded-pill mt-5 w-100 py-3"><i className="bi bi-envelope-fill me-2"></i> Contact Support Team</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ADMIN LAYOUT W/ SIDEBAR --- */}
{currentView.startsWith('admin_') && userRole === 'admin' && (
  // Swapped the calc() math back to a clean vh-100
  <div className="container-fluid p-0 vh-100 d-flex overflow-hidden bg-body">
    
    {/* Left Sidebar Navigation (Frozen) */}
    <div className="bg-dark text-white d-flex flex-column h-100" style={{width: '260px', flexShrink: 0}}>
      <div className="p-4 border-bottom border-secondary d-flex align-items-center gap-3">
        <div className="bg-primary text-white rounded text-center fw-bold" style={{width: '35px', height: '35px', lineHeight: '35px'}}>B</div>
        <h5 className="mb-0 fw-bold">Admin Panel</h5>
      </div>
      
      {/* 2. Added overflow-y-auto here just in case you add more nav buttons later */}
      <div className="p-3 d-flex flex-column gap-2 flex-grow-1 overflow-y-auto">
        <button className={`btn text-start fw-semibold py-3 ${currentView === 'admin_dashboard' ? 'btn-primary' : 'btn-dark text-white-50'}`} onClick={() => setCurrentView('admin_dashboard')}>
          <i className="bi bi-speedometer2 me-3"></i> Dashboard Overview
        </button>
        <button className={`btn text-start fw-semibold py-3 ${currentView === 'admin_catalog' ? 'btn-primary' : 'btn-dark text-white-50'}`} onClick={() => setCurrentView('admin_catalog')}>
          <i className="bi bi-tags-fill me-3"></i> Manage Catalog
        </button>
        <button className={`btn text-start fw-semibold py-3 ${currentView === 'admin_ledger' ? 'btn-primary' : 'btn-dark text-white-50'}`} onClick={() => setCurrentView('admin_ledger')}>
          <i className="bi bi-receipt me-3"></i> Internal Ledger
        </button>
      </div>

      {/* 3. Added mt-auto to strictly anchor this to the bottom of the sidebar */}
      <div className="p-3 border-top border-secondary mt-auto">
        <button className="btn btn-outline-light w-100 fw-bold" onClick={() => setCurrentView('store')}>
          <i className="bi bi-shop me-2"></i> Exit to Storefront
        </button>
      </div>
    </div>

    {/* Main Content Area (Scrollable) */}
    {/* 4. Added h-100 here to ensure it respects the wrapper height */}
    <div className="flex-grow-1 overflow-auto bg-body-tertiary p-4 p-md-5 h-100">
      
      {/* 1. DASHBOARD VIEW */}
      {currentView === 'admin_dashboard' && (
        <div className="animate-view">
          <h3 className="fw-bold text-body mb-4">Analytics Overview</h3>
          
          {/* Top KPI Metric Cards */}
          {(() => {
            const totalOrdersCount = orderHistory.length;
            const netSales = orderHistory.reduce((sum, order) => sum + (order.final_total || 0), 0);
            const unitsSold = orderHistory.reduce((sum, order) => sum + (order.total_items || 0), 0);
            const averageOrderValue = totalOrdersCount > 0 ? netSales / totalOrdersCount : 0;
            
            // Assuming an arbitrary 45% Cost of Goods Sold for margin calculations
            const estimatedCOGS = netSales * 0.45; 
            const grossMarginPercent = netSales > 0 ? ((netSales - estimatedCOGS) / netSales) * 100 : 0;

            return (
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-body">
                    <div className="text-muted small fw-bold mb-2 text-uppercase tracking-wider">Net Sales</div>
                    <h2 className="fw-bold text-primary mb-0">${netSales.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-body">
                    <div className="text-muted small fw-bold mb-2 text-uppercase tracking-wider">Total Orders</div>
                    <h2 className="fw-bold text-body mb-0">{totalOrdersCount}</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-body">
                    <div className="text-muted small fw-bold mb-2 text-uppercase tracking-wider">Units Sold</div>
                    <h2 className="fw-bold text-body mb-0">{unitsSold}</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-body">
                    <div className="text-muted small fw-bold mb-2 text-uppercase tracking-wider">Est. Gross Margin</div>
                    <h2 className="fw-bold text-success mb-0">{grossMarginPercent.toFixed(1)}%</h2>
                    <div className="small text-muted mt-1">AOV: ${averageOrderValue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Line Chart Section */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-body">
            <h5 className="fw-bold text-body mb-4">Performance Trends (Last 6 Months)</h5>
            <div style={{ width: '100%', height: '350px' }}>
              {/* Note: Mapped to mock monthly data. Update the data prop to dynamically group orderHistory by month when you have timestamps! */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                    { name: 'Jan', sales: 4000, orders: 24, units: 150 },
                    { name: 'Feb', sales: 3000, orders: 18, units: 110 },
                    { name: 'Mar', sales: 5200, orders: 35, units: 280 },
                    { name: 'Apr', sales: 4800, orders: 29, units: 210 },
                    { name: 'May', sales: 6100, orders: 42, units: 350 },
                    { name: 'Jun', sales: 7400, orders: 55, units: 420 },
                  ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bs-border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--bs-secondary-color)'}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: 'var(--bs-secondary-color)'}} tickFormatter={(value) => `$${value}`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'var(--bs-secondary-color)'}} />
                  <Tooltip contentStyle={{backgroundColor: 'var(--bs-body-bg)', borderColor: 'var(--bs-border-color)', borderRadius: '8px', color: 'var(--bs-body-color)'}} />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="Net Sales ($)" stroke="#274c77" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Total Orders" stroke="#2a9d8f" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="units" name="Units Sold" stroke="#e76f51" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Order Status Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-body">
            <div className="card-header bg-body border-bottom p-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Recent Order Activity</h5>
              <button className="btn btn-sm btn-outline-primary fw-bold" onClick={() => setCurrentView('admin_ledger')}>View All</button>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0 align-middle text-body">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4">Order ID</th>
                    <th>Customer</th>
                    <th>Fulfillment Status</th>
                    <th>Payment Status</th>
                    <th className="text-end pe-4">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-bold">#{order.id}</td>
                      <td>{order.customer_email || 'Guest User'}</td>
                      <td>
                        <span className={`badge ${order.status === 'Shipped' ? 'bg-success' : 'bg-secondary'}`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${order.balance_due > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="text-end pe-4 fw-semibold">${(order.final_total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {orderHistory.length === 0 && <tr><td colSpan="5" className="text-center text-muted p-4">No recent orders.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE CATALOG VIEW (Your existing code wrapped) */}
      {currentView === 'admin_catalog' && (
         <div className="row">
                 <div className="col-md-12 mb-4 mt-4">
                   <button className="btn btn-link text-body text-decoration-none px-0 mb-3 fw-semibold" onClick={() => setCurrentView('store')}>
                     <i className="bi bi-arrow-left me-2"></i> Back to Store
                   </button>
                   <div className="card shadow-sm border-0 rounded-4 bg-body border">
                     <div className="card-header bg-dark text-white fw-bold rounded-top-4 py-3">Add New Product to Inventory</div>
                     <div className="card-body p-4">
                       <form onSubmit={handleAddProduct}>
                         <div className="row mb-3">
                           <div className="col-md-4"><label className="form-label fw-bold small text-muted">Product Name</label><input type="text" className="form-control bg-body-tertiary border-0 text-body" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required/></div>
                           <div className="col-md-4"><label className="form-label fw-bold small text-muted">Category</label><select className="form-select bg-body-tertiary border-0 text-body" value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}>{categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                           <div className="col-md-4"><label className="form-label fw-bold small text-muted">Base Price (USD)</label><input type="number" step="0.01" className="form-control bg-body-tertiary border-0 text-body" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} required/></div>
                         </div>
                         <div className="row mb-4">
                           <div className="col-md-4"><label className="form-label fw-bold small text-muted">Initial Stock</label><input type="number" className="form-control bg-body-tertiary border-0 text-body" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)}/></div>
                           <div className="col-md-8">
                             <label className="form-label fw-bold small text-muted">Product Image</label>
                             <div className="d-flex gap-3 align-items-center">
                               {newProductImage && <img src={newProductImage} alt="Preview" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />}
                               <input type="file" id="imageUploadInput" className="form-control bg-body-tertiary border-0 text-body" accept="image/*" onChange={handleImageUpload} />
                             </div>
                           </div>
                         </div>
                         <div className="row mb-4">
                           <div className="col-md-6">
                             <label className="form-label fw-bold small text-muted">Sizes</label>
                             <div className="d-flex flex-wrap gap-3 bg-body-tertiary p-3 border-0 rounded">
                               {sizeOptions.map(size => (<div className="form-check" key={size}><input className="form-check-input" type="checkbox" id={`size-${size}`} checked={selectedFormSizes.includes(size)} onChange={() => toggleFormCheckbox(size, selectedFormSizes, setSelectedFormSizes)}/><label className="form-check-label fw-semibold text-body" htmlFor={`size-${size}`}>{size}</label></div>))}
                             </div>
                           </div>
                           <div className="col-md-6">
                             <label className="form-label fw-bold small text-muted">Colors</label>
                             <div className="d-flex flex-wrap gap-3 bg-body-tertiary p-3 border-0 rounded">
                                {colorOptions.map(color => (<div className="form-check" key={color}><input className="form-check-input" type="checkbox" id={`color-${color}`} checked={selectedFormColors.includes(color)} onChange={() => toggleFormCheckbox(color, selectedFormColors, setSelectedFormColors)}/><label className="form-check-label fw-semibold text-body" htmlFor={`color-${color}`}>{color}</label></div>))}
                             </div>
                           </div>
                         </div>
                         <div className="mb-4"><label className="form-label fw-bold small text-muted">Description</label><textarea className="form-control bg-body-tertiary border-0 text-body" rows="3" value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)}></textarea></div>
                         <div className="text-end"><button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill">Save Product</button></div>
                       </form>
                     </div>
                   </div>
                 </div>
                 <div className="col-md-12">
                   <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body border">
                     <div className="card-header bg-secondary text-white fw-bold">Inventory Database</div>
                     <div className="card-body p-0">
                        <table className="table table-hover mb-0 text-body">
                            <thead className="table-light text-body"><tr><th>ID</th><th>Image</th><th>Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Actions</th></tr></thead>
                            <tbody>
                                {products.map((product) => (
                                <tr key={product.id} className="align-middle">
                                    <td className="text-body">#{product.id}</td>
                                    <td>{product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /> : <div className="bg-body-tertiary text-muted d-flex align-items-center justify-content-center rounded" style={{width: '40px', height: '40px'}}><i className="bi bi-image"></i></div>}</td>
                                    <td><span className="fw-bold text-body">{product.name}</span></td>
                                    <td><span className="badge bg-body-tertiary text-body border">{product.category}</span></td>
                                    <td className="text-body">{product.stock} units</td>
                                    <td className="text-body">${product.basePrice.toFixed(2)}</td>
                                    <td><button className="btn btn-outline-secondary border btn-sm fw-bold" onClick={() => setProductToEdit(product)}><i className="bi bi-pencil-square"></i> Edit</button></td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                   </div>
                 </div>
               </div>
            )}

      {/* 3. INTERNAL LEDGER VIEW */}
      {currentView === 'admin_ledger' && (
         <div className="animate-view h-100 d-flex flex-column">
           <h3 className="fw-bold text-body mb-4">Internal Financial Ledger</h3>
           
           <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body flex-grow-1 d-flex flex-column">
             <div className="card-header bg-dark text-white fw-bold py-3">
               Order Database
             </div>
             
             {/* SCROLLABLE TABLE CONTAINER */}
             <div className="card-body p-0 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
               <table className="table table-hover mb-0 align-middle text-body" style={{ minWidth: '1300px' }}>
                 
                 {/* STICKY HEADER */}
                 <thead className={`${isDarkMode ? 'card-header bg-dark text-white' : 'table-light text-body'} sticky-top`} style={{ zIndex: 1 }}>
  <tr>
    <th className="ps-4 py-3">Order ID</th>
    <th className="py-3">Customer</th>
    <th className="py-3">Fulfillment</th>
    <th className="py-3" style={{minWidth: '250px'}}>Order Breakdown (Line Items)</th>
    <th className="py-3">Total Items</th>
    <th className="py-3">Total Value</th>
    <th className="py-3">Amount Paid</th>
    <th className="py-3">Balance Due</th>
    <th className="pe-4 py-3">Payment Status</th>
  </tr>
</thead>
                 
                 <tbody>
                   {orderHistory.map((order) => {
                     // Safety checks
                     const currentFulfillmentStatus = order.fulfillment_status || (order.status === 'Shipped' ? 'Fulfilled' : 'Unfulfilled');
                     
                     return (
                       <tr 
                         key={order.id} 
                         onClick={() => setSelectedAdminOrder(order)} 
                         style={{cursor: 'pointer'}} 
                         className="position-relative"
                       >
                         <td className="ps-4 fw-bold text-muted">#{order.id}</td>
                         
                         <td><span className="badge bg-body-tertiary text-body border">{order.customer_email || 'Guest'}</span></td>
                         
                         {/* NEW FULFILLMENT COLUMN */}
                         <td>
                           <span className={`badge ${currentFulfillmentStatus === 'Fulfilled' ? 'bg-success' : currentFulfillmentStatus === 'Partially Fulfilled' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                             {currentFulfillmentStatus}
                           </span>
                         </td>

                         <td>
                           <ul className="list-unstyled mb-0 small text-body">
                             {order.items && order.items.map((item, idx) => (
                               <li key={idx} className="mb-1 border-bottom pb-1 border-light">
                                 <span className="fw-bold text-body">{item.quantity}x</span> {item.name} 
                                 <span className="text-muted ms-1">(${item.price?.toFixed(2)} ea)</span>
                               </li>
                             ))}
                           </ul>
                         </td>
                         
                         <td className="text-body">{order.total_items}</td>
                         <td className="fw-semibold text-body">${(order.final_total || 0).toFixed(2)}</td>
                         <td className="text-body">${(order.amount_paid || 0).toFixed(2)}</td>
                         
                         <td className={order.balance_due > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                           ${(order.balance_due || 0).toFixed(2)}
                         </td>
                         
                         <td className="pe-4">
                           <span className={`badge ${order.balance_due > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                             {order.payment_status}
                           </span>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
               
               {orderHistory.length === 0 && (
                 <div className="text-center p-5 text-muted bg-body">
                   <i className="bi bi-receipt fs-1 d-block mb-3"></i>
                   No purchase orders have been processed yet.
                 </div>
               )}
             </div>
           </div>
         </div>
      )}

    </div>
  </div>
)}

            {currentView === 'admin' && userRole === 'admin' && (
               <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-body border mt-4">
                 <div className="card-header bg-dark text-white fw-bold">
                   <button className="btn btn-link text-white text-decoration-none px-0 fw-semibold me-3" onClick={() => setCurrentView('store')}>
                     <i className="bi bi-arrow-left"></i>
                   </button>
                   Internal Order Ledger
                 </div>
                 <div className="card-body p-0">
                   <table className="table table-hover mb-0 align-middle text-body">
                     <thead className="table-light text-body">
                       <tr>
                         <th>Order ID</th>
                         <th>Customer</th>
                         <th style={{minWidth: '250px'}}>Order Breakdown (Line Items)</th>
                         <th>Total Items</th>
                         <th>Total Value</th>
                         <th>Amount Paid</th>
                         <th>Balance Due</th>
                         <th>Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {orderHistory.map((order) => (
                         <tr key={order.id}>
                           <td className="fw-bold text-muted">#{order.id}</td>
                           
                           <td><span className="badge bg-body-tertiary text-body border">{order.customer_email || 'Guest'}</span></td>

                           <td>
                             <ul className="list-unstyled mb-0 small text-body">
                               {order.items && order.items.map((item, idx) => (
                                 <li key={idx} className="mb-1 border-bottom pb-1 border-light">
                                   <span className="fw-bold text-body">{item.quantity}x</span> {item.name} 
                                   <span className="text-muted ms-1">(${item.price.toFixed(2)} ea)</span>
                                 </li>
                               ))}
                             </ul>
                           </td>
                           <td className="text-body">{order.total_items}</td>
                           <td className="fw-semibold text-body">${order.final_total.toFixed(2)}</td>
                           <td className="text-body">${order.amount_paid.toFixed(2)}</td>
                           <td className={order.balance_due > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                             ${order.balance_due.toFixed(2)}
                           </td>
                           <td>
                             <span className={`badge ${order.balance_due > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                               {order.payment_status}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                   {orderHistory.length === 0 && (
                     <div className="text-center p-5 text-muted bg-body">
                       <i className="bi bi-receipt fs-1 d-block mb-3"></i>
                       No purchase orders have been processed yet.
                     </div>
                   )}
                 </div>
               </div>
            )}

          </div>
        )}
      </div>

      {/* --- BOTTOM MOBILE NAVIGATION BAR --- */}
      {currentView !== 'checkout' && (
        <div className="position-fixed bottom-0 start-0 w-100 bg-body shadow-lg border-top d-flex justify-content-around align-items-center py-2 d-md-none" style={{zIndex: 1030}}>
          <button className={`btn border-0 d-flex flex-column align-items-center p-1 ${currentView === 'store' ? 'text-primary' : 'text-muted'}`} onClick={() => setCurrentView('store')}>
            <i className={`bi ${currentView === 'store' ? 'bi-house-fill' : 'bi-house'} fs-5 mb-1`}></i>
            <span style={{fontSize: '0.65rem', fontWeight: '600'}}>Home</span>
          </button>
          
          <button className={`btn border-0 d-flex flex-column align-items-center p-1 ${currentView === 'wishlist' ? 'text-primary' : 'text-muted'} position-relative`} onClick={() => setCurrentView('wishlist')}>
            <i className={`bi ${currentView === 'wishlist' ? 'bi-heart-fill' : 'bi-heart'} fs-5 mb-1`}></i>
            <span style={{fontSize: '0.65rem', fontWeight: '600'}}>Liked</span>
            {likedItems.length > 0 && <span className="position-absolute badge rounded-pill bg-danger" style={{top: '0', right: '10px', fontSize: '0.55rem'}}>{likedItems.length}</span>}
          </button>

          <button className={`btn border-0 d-flex flex-column align-items-center p-1 ${currentView === 'customer_orders' ? 'text-primary' : 'text-muted'}`} onClick={() => {
              if (!userRole) {
                setIsSignUpMode(false);
                setShowLoginModal(true);
              } else {
                fetchOrders();
                setCurrentView('customer_orders');
              }
            }}>
            <i className={`bi ${currentView === 'customer_orders' ? 'bi-bag-fill' : 'bi-bag'} fs-5 mb-1`}></i>
            <span style={{fontSize: '0.65rem', fontWeight: '600'}}>Orders</span>
          </button>
        </div>
      )}

      {/* --- MOQ WARNING MODAL --- */}
      {moqWarning && (
        <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1200, width: '90%', maxWidth: '400px' }}>
          <div className="alert alert-danger shadow-lg border-0 rounded-4 animate-dropdown">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="alert-heading fw-bold mb-0"><i className="bi bi-exclamation-octagon-fill me-2"></i> MOQ Warning</h6>
              <button className="btn-close" onClick={() => setMoqWarning('')}></button>
            </div>
            <p className="mb-0 small">{moqWarning}</p>
          </div>
        </div>
      )}

      {/* --- SLEEK TOAST NOTIFICATION --- */}
      {notification && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4 animate-dropdown" style={{ zIndex: 1200 }}>
          <div className="bg-dark text-white px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-3 fw-semibold border border-secondary">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            {notification}
          </div>
        </div>
      )}

      {/* --- REFACTORED LOGIN / SIGNUP MODAL --- */}
      {showLoginModal && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1060 }} onClick={() => setShowLoginModal(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle animate-dropdown" style={{ zIndex: 1070, width: '100%', maxWidth: '400px' }}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-body">
              
              <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center py-3">
                <span><i className="bi bi-shield-lock-fill me-2"></i>Account Authentication</span>
                <button className="btn-close btn-close-white" onClick={() => setShowLoginModal(false)}></button>
              </div>

              <div className="card-body p-4 pt-4">
                <form onSubmit={handleAuth}>
                  {loginError && <div className={`alert ${loginError.includes('Success') ? 'alert-success' : 'alert-danger'} py-2 small fw-bold text-center`}><i className="bi bi-exclamation-circle-fill me-1"></i>{loginError}</div>}
                  
                  {isSignUpMode && (
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">Full Name</label>
                      <input type="text" className="form-control bg-body-tertiary border-0 shadow-none text-body" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Jane Doe" required={isSignUpMode} />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">Email Address</label>
                    <input type="email" className="form-control bg-body-tertiary border-0 shadow-none text-body" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="name@company.com" required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">Password</label>
                    <div className="input-group bg-body-tertiary rounded">
                      <input type={showPassword ? "text" : "password"} className="form-control bg-transparent border-0 shadow-none text-body" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" required />
                      <button type="button" className="btn text-muted shadow-none border-0" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                      </button>
                    </div>
                  </div>

                  {isSignUpMode && (
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted">Confirm Password</label>
                      <div className="input-group bg-body-tertiary rounded">
                        <input type={showConfirmPassword ? "text" : "password"} className="form-control bg-transparent border-0 shadow-none text-body" value={signupConfirmPass} onChange={(e) => setSignupConfirmPass(e.target.value)} placeholder="••••••••" required={isSignUpMode} />
                        <button type="button" className="btn text-muted shadow-none border-0" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {!isSignUpMode && (
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input className="form-check-input shadow-none" type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        <label className="form-check-label small text-muted fw-semibold" htmlFor="rememberMe">Remember me</label>
                      </div>
                    </div>
                  )}
                  
                  {!isSignUpMode ? (
                    <div className="text-center mb-3 mt-4">
                      <span className="small text-muted fw-semibold">Don't have an account? </span>
                      <button type="button" className="btn btn-link p-0 small fw-bold text-primary text-decoration-none" onClick={() => {setIsSignUpMode(true); setLoginError('');}}>Sign up here.</button>
                    </div>
                  ) : (
                    <div className="text-center mb-3 mt-4">
                      <span className="small text-muted fw-semibold">Already have an account? </span>
                      <button type="button" className="btn btn-link p-0 small fw-bold text-primary text-decoration-none" onClick={() => {setIsSignUpMode(false); setLoginError('');}}>Log in here.</button>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100 fw-bold rounded-pill py-2 mt-2">
                    {isSignUpMode ? 'Create Account' : 'Secure Log In'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      {/* --- CUSTOM LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutConfirm && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1060 }} onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="position-fixed top-50 start-50 translate-middle animate-dropdown" style={{ zIndex: 1070, width: '100%', maxWidth: '350px' }}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-body">
              <div className="card-body p-4 text-center">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-box-arrow-right fs-2"></i>
                </div>
                <h5 className="fw-bold text-body mb-2">Sign Out</h5>
                <p className="text-muted small mb-4">Are you sure you want to sign out of your account?</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-outline-secondary fw-semibold flex-grow-1 rounded-pill shadow-none" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                  <button className="btn btn-danger fw-semibold flex-grow-1 rounded-pill shadow-none" onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {productToEdit && <EditProductModal product={productToEdit} categoryOptions={categoryOptions} sizeOptions={sizeOptions} colorOptions={colorOptions} onClose={() => setProductToEdit(null)} onSave={handleSaveEdit} />}
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          userRole={userRole} 
          onRequestLogin={() => {
            setIsSignUpMode(false); 
            setShowLoginModal(true);
          }} 
        />
      )}

      {selectedAdminOrder && (
        <AdminOrderModal 
          order={selectedAdminOrder} 
          onClose={() => setSelectedAdminOrder(null)} 
          onUpdateFulfillment={handleUpdateFulfillment}
          showNotification={showNotification}
        />
      )}

      {/* --- CSS Slide Out Cart --- */}
      <>
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ zIndex: 1040, opacity: isCartOpen ? 0.5 : 0, visibility: isCartOpen ? 'visible' : 'hidden', transition: 'opacity 0.3s ease, visibility 0.3s ease' }} onClick={() => setIsCartOpen(false)}></div>
        <div className="position-fixed top-0 end-0 h-100 bg-body shadow-lg d-flex flex-column" style={{ width: '400px', zIndex: 1050, transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
            <h5 className="mb-0 fw-bold text-body">Your Order</h5>
            <button className="btn-close" onClick={() => setIsCartOpen(false)}></button>
          </div>

          <div className="p-4 flex-grow-1 overflow-auto checkout-scroll">
            {cart.length === 0 ? <div className="text-center text-muted mt-5">Your cart is empty.</div> : (
              <ul className="list-group list-group-flush mb-4">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent text-body">
                    <div><div className="fw-bold">{item.name}</div><small className="text-muted">Qty: {item.quantity}</small></div>
                    <span>${(item.basePrice * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-4 bg-body-tertiary border-top">
            <div className="d-flex justify-content-between mb-3"><span className="text-muted">Total Items</span><span className="fw-bold text-body">{totalQuantity}</span></div>
            <div className="d-flex justify-content-between mb-4 fs-5"><span className="fw-bold text-body">Total Price</span><span className="fw-bold text-primary">${totalPrice.toFixed(2)}</span></div>
            {!moqMet && <div className="alert alert-danger py-2 small mb-3"><i className="bi bi-exclamation-triangle-fill"></i> Add {20 - totalQuantity} more items to meet B2B minimums.</div>}
            
            <button 
              className="btn btn-primary w-100 py-3 fw-bold rounded-pill" 
              disabled={!moqMet || cart.length === 0} 
              onClick={() => {
                setIsCartOpen(false);
                setCurrentView('checkout');
                setCheckoutPhase('shipping');
              }}
            >
              Proceed to Checkout
            </button>
          </div>
          
        </div>
      </>

      {/* --- Mobile Bottom Spacer --- */}
      <div className="d-block d-md-none" style={{height: '80px'}}></div>

    </div>
  );
}

export default App;