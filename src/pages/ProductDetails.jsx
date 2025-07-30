import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ProductDetails = () => {
  const { id } = useParams(); // Add this line to get product ID from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          setError("المنتج غير موجود");
        }
      } catch (err) {
        setError("حدث خطأ في تحميل المنتج");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(item => item.product_id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity = String(
          parseInt(cart[existingItemIndex].quantity) + quantity
        );
      } else {
        // Add new item
        const item = {
          product_id: product.id,
          name: product.name,
          quantity: String(quantity),
          price_per_one: product.price,
          image: product.images?.[0] || null
        };
        cart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Show success feedback
      const button = document.querySelector('.add-to-cart-btn');
      button.style.backgroundColor = '#4CAF50';
      button.textContent = 'تمت الإضافة ✓';
      
      setTimeout(() => {
        button.style.backgroundColor = '#8B4513';
        button.textContent = 'أضف إلى السلة';
      }, 2000);
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("حدث خطأ في إضافة المنتج إلى السلة");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <p style={loadingTextStyle}>جارٍ التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <p style={errorTextStyle}>{error}</p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];

  return (
    <>
      <style>{responsiveStyles}</style>
      <div className="product-details-container">
        <div className="product-content">
          {/* Image Section */}
          <div className="image-section">
            <div className="main-image-container">
              <img
                src={images[selectedImageIndex] || 'https://via.placeholder.com/400x400?text=منتج'}
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=منتج';
                }}
              />
              {images.length > 1 && (
                <div className="image-navigation">
                  <button 
                    className="nav-btn prev"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev > 0 ? prev - 1 : images.length - 1
                    )}
                  >
                    ❮
                  </button>
                  <button 
                    className="nav-btn next"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev < images.length - 1 ? prev + 1 : 0
                    )}
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=صورة';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="price-container">
                <span className="price">{product.price} ₪</span>
                {product.originalPrice && (
                  <span className="original-price">{product.originalPrice} ₪</span>
                )}
              </div>
            </div>

            <div className="product-description">
              <p>{product.description || "لا يوجد وصف متاح."}</p>
            </div>

            {/* Product Features */}
            {product.features && (
              <div className="features-section">
                <h3>المميزات:</h3>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="purchase-section">
              <div className="quantity-section">
                <label className="quantity-label">الكمية:</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={decrement}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={increment}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <span className="spinner"></span>
                    جارٍ الإضافة...
                  </>
                ) : (
                  <>
                    🛒 أضف إلى السلة
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Responsive styles
const responsiveStyles = `
  .product-details-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .product-content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }

  /* Large Screens */
  @media (min-width: 1200px) {
    .product-content {
      gap: 3rem;
      padding: 3rem;
    }
  }

  /* Medium Screens */
  @media (max-width: 1024px) {
    .product-content {
      gap: 1.5rem;
      padding: 1.5rem;
    }
  }

  /* Tablets and Mobile */
  @media (max-width: 768px) {
    .product-details-container {
      padding: 0.5rem;
      margin: 0;
      min-height: auto;
    }

    .product-content {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1rem;
    }

    .image-section, .info-section {
      min-height: auto;
      height: auto;
    }

    .main-image-container {
      margin-bottom: 0.5rem;
    }

    .thumbnail-gallery {
      margin-bottom: 1rem;
    }

    .info-section {
      gap: 1rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .product-details-container {
      padding: 0;
    }

    .product-content {
      border-radius: 0;
      box-shadow: none;
    }

    .main-image {
      height: 250px;
      border-radius: 0;
    }
  }

  /* Extra Small Mobile */
  @media (max-width: 320px) {
    .product-content {
      padding: 0.8rem;
    }

    .main-image {
      height: 200px;
    }

    .thumbnail {
      width: 40px;
      height: 40px;
    }

    .price {
      font-size: 1.1rem;
    }

    .quantity-btn {
      width: 28px;
      height: 28px;
    }
  }

  /* Accessibility - Touch Targets */
  @media (hover: none) and (pointer: coarse) {
    .quantity-btn,
    .nav-btn,
    .add-to-cart-btn {
      min-height: 44px;
      min-width: 44px;
    }

    .thumbnail {
      min-width: 48px;
      min-height: 48px;
    }
  }

  /* High Resolution Screens */
  @media (min-width: 1400px) {
    .product-content {
      max-width: 1400px;
    }

    .main-image {
      height: 500px;
    }
  }

  .product-details-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}


  .product-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 2rem;
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    align-items: start;
  }

  .image-section, .info-section {
    height: 100%;
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }

  .image-section {
    position: relative;
  }

  .main-image-container {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    margin-bottom: 1rem;
  }

  .main-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .main-image:hover {
    transform: scale(1.05);
  }

  .image-navigation {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  .nav-btn {
    background: rgba(255,255,255,0.9);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
    pointer-events: all;
    transition: all 0.2s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .nav-btn:hover {
    background: white;
    transform: scale(1.1);
  }

  .thumbnail-gallery {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  .thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .thumbnail:hover {
    border-color: #8B4513;
    transform: scale(1.05);
  }

  .thumbnail.active {
    border-color: #8B4513;
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.3);
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .product-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }

  .product-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .price-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .price {
    font-size: 1.8rem;
    font-weight: 700;
    color: #8B4513;
  }

  .original-price {
    font-size: 1.2rem;
    color: #999;
    text-decoration: line-through;
  }

  .product-description {
    color: #666;
    line-height: 1.6;
    font-size: 1rem;
  }

  .features-section h3 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .features-list {
    list-style: none;
    padding: 0;
  }

  .features-list li {
    padding: 0.3rem 0;
    color: #666;
    position: relative;
    padding-right: 1.5rem;
  }

  .features-list li:before {
    content: '✓';
    position: absolute;
    right: 0;
    color: #4CAF50;
    font-weight: bold;
  }

  .purchase-section {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e9ecef;
  }

  .quantity-section {
    margin-bottom: 1.5rem;
  }

  .quantity-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    width: fit-content;
  }

  .quantity-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: #f0f0f0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .quantity-btn:hover:not(:disabled) {
    background: #8B4513;
    color: white;
    transform: scale(1.05);
  }

  .quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quantity-display {
    font-size: 1.2rem;
    font-weight: bold;
    min-width: 2rem;
    text-align: center;
  }

  .add-to-cart-btn {
    width: 100%;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  }

  .add-to-cart-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
  }

  .add-to-cart-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .additional-info {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #8B4513;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .info-icon {
    font-size: 1rem;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .product-details-container {
      padding: 0.5rem;
      margin: 0;
      min-height: auto;
    }

    .product-content {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1rem;
    }

    .image-section, .info-section {
      min-height: auto;
      height: auto;
    }

    .main-image-container {
      margin-bottom: 0.5rem;
    }

    .thumbnail-gallery {
      margin-bottom: 1rem;
    }

    .info-section {
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .product-content {
      padding: 0.5rem;
    }

    .main-image {
      height: 250px;
    }

    .product-title {
      font-size: 1.3rem;
    }

    .price {
      font-size: 1.3rem;
    }

    .add-to-cart-btn {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }

    .thumbnail {
      width: 50px;
      height: 50px;
    }
  }
`;

// Loading styles
const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  gap: '1rem'
};

const loadingSpinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #8B4513',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
  fontSize: '1.1rem',
  color: '#666'
};

const errorContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  padding: '2rem'
};

const errorTextStyle = {
  fontSize: '1.2rem',
  color: '#d32f2f',
  textAlign: 'center'
};

export default ProductDetails;