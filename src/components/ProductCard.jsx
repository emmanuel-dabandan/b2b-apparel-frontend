// src/components/ProductCard.jsx

export default function ProductCard({ product, viewMode, onViewDetails, isLiked, onToggleLike }) {
  const colClass = viewMode === 'grid' ? "col-md-4 mb-4" : "col-12 mb-4";
  const cardLayout = viewMode === 'list' ? "flex-row" : "flex-column";

  return (
    <div className={colClass}>
      <div className={`card h-100 shadow-sm border-0 rounded-4 overflow-hidden d-flex ${cardLayout} bg-body`}>
        <div className={`position-relative bg-body-tertiary flex-shrink-0 ${viewMode === 'list' ? 'list-view-img' : 'grid-view-img'}`} style={{cursor: 'pointer', backgroundImage: `url(${product.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center'}} onClick={() => onViewDetails(product)}>
          <span className="badge bg-success position-absolute top-0 start-0 m-3">NEW</span>
          
          <button 
            className="btn bg-body rounded-circle shadow-sm p-0 position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center border" 
            style={{width: '35px', height: '35px', zIndex: 5, transition: 'transform 0.2s ease'}} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={(e) => { 
              e.stopPropagation();
              onToggleLike(product); 
            }}
          >
            <i className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-muted'}`}></i>
          </button>

          {!product.imageUrl && <div className="d-flex align-items-center justify-content-center h-100 text-muted"><i className="bi bi-image fs-1"></i></div>}
        </div>
        <div className="card-body d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div><small className="text-muted text-uppercase fw-bold">{product.category}</small><h5 className="card-title fw-bold mb-1 mt-1" style={{cursor: 'pointer'}} onClick={() => onViewDetails(product)}>{product.name}</h5></div>
          </div>
          <div className="mb-3"><span className="fw-bold fs-4">${product.basePrice.toFixed(2)}</span><span className="text-muted text-decoration-line-through ms-2 small">${(product.basePrice * 1.3).toFixed(2)}</span></div>
          <div className={`mt-auto ${viewMode === 'list' ? 'w-50 ms-auto' : ''}`}><button className="btn btn-primary btn-sm fw-bold w-100 rounded-pill py-2" onClick={() => onViewDetails(product)}>Buy</button></div>
        </div>
      </div>
    </div>
  );
}