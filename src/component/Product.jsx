import React from 'react';

const Product = ({product}) => {
  return (
    <div className="product-container">
      <h1 className="page-title">Our Products</h1>

      <div className="product-card">
        <div className="product-image">
          <span className="product-badge">{product.name}</span>
          <img
            src={product.img}
            alt="Dell Computer"
          />
        </div>

        <div className="product-info">
          <p className="product-category">{product.category}</p>

          <h2 className="product-name">{product.name}</h2>

          <p className="product-description">
            {product.dis}
          </p>

          <div className="product-footer">
            <div>
              <span className="price-label">Price</span>
              <h3 className="product-price">${product.price}</h3>
            </div>

            <button className="buy-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
