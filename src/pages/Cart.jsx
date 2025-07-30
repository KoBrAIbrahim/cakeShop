import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [customerName, setCustomerName] = useState(""); // Name field state
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deletedItem, setDeletedItem] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cartItems];
    const newQty = parseInt(updatedCart[index].quantity) + delta;
    if (newQty >= 1) {
      updatedCart[index].quantity = newQty.toString();
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const deleteItem = (index) => {
    const updatedCart = [...cartItems];
    const itemToDelete = updatedCart[index];
    
    // Store deleted item info for undo
    setDeletedItem({
      item: itemToDelete,
      index: index
    });
    
    // Remove item from cart
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Show undo option
    setShowUndo(true);
    
    // Hide undo after 5 seconds
    setTimeout(() => {
      setShowUndo(false);
      setDeletedItem(null);
    }, 5000);
  };

  const undoDelete = () => {
    if (deletedItem) {
      const updatedCart = [...cartItems];
      updatedCart.splice(deletedItem.index, 0, deletedItem.item);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setShowUndo(false);
      setDeletedItem(null);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseInt(item.quantity) * parseFloat(item.price_per_one),
    0
  );

  const confirmOrder = () => {
    setShowAddressForm(true);
  };

  const submitOrder = async () => {
    try {
      const orderData = {
        customer_name: customerName,
        phone: phoneNumber,
        status: "pending",
        total_price: totalPrice.toString(),
        address: {
          city: city,
          full_address: fullAddress
        },
        items: cartItems.map((item) => ({
          name: item.name,
          product_id: item.product_id,
          quantity: item.quantity,
          price_per_one: item.price_per_one,
        })),
        created_at: new Date()
      };

      await addDoc(collection(db, "orders"), orderData);
      
      // First hide the form
      setShowAddressForm(false);
      
      // Then show success message
      setShowSuccessMessage(true);
      
      // Clear cart and form data
      localStorage.removeItem("cart");
      setCartItems([]);
      setCity("");
      setFullAddress("");
      setPhoneNumber("");
      setCustomerName("");
      
      // Keep success message visible for 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error("فشل في إرسال الطلب:", error);
      alert("حدث خطأ أثناء إرسال الطلب");
    }
  };

  return (
    <>
      <style>{advancedStyles}</style>
      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-header">
            <h1 className="cart-title">
              🛒 سلة الشراء
              {cartItems.length > 0 && (
                <span className="item-count">{cartItems.length}</span>
              )}
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>سلة التسوق فارغة</h2>
              <p>لم تقم بإضافة أي منتجات بعد</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-info">
                      <div className="item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="placeholder-image">📦</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">السعر: {item.price_per_one} ₪</p>
                        <p className="item-subtotal">
                          الإجمالي: {(parseInt(item.quantity) * parseFloat(item.price_per_one)).toFixed(2)} ₪
                        </p>
                      </div>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn decrease"
                          onClick={() => updateQuantity(index, -1)}
                          disabled={parseInt(item.quantity) <= 1}
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn increase"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        className="delete-btn"
                        onClick={() => deleteItem(index)}
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Undo Delete Notification */}
              {showUndo && deletedItem && (
                <div className="undo-notification">
                  <div className="undo-content">
                    <span className="undo-text">تم حذف "{deletedItem.item.name}"</span>
                    <button className="undo-btn" onClick={undoDelete}>
                      ↩️ تراجع
                    </button>
                  </div>
                </div>
              )}

              <div className="cart-summary">
                <div className="summary-content">
                  <div className="total-section">
                    <div className="total-label">المجموع الكلي:</div>
                    <div className="total-price">{totalPrice.toFixed(2)} ₪</div>
                  </div>
                  
                  <button
                    className="confirm-order-btn"
                    onClick={confirmOrder}
                  >
                    ✅ تأكيد الطلبية
                  </button>
                </div>
              </div>

              {showAddressForm && (
                <div className="address-form-overlay">
                  <div className="address-form">
                    <div className="form-header">
                      <h3>📍 معلومات العنوان</h3>
                      <p>يرجى إدخال عنوان التوصيل والمعلومات الشخصية</p>
                    </div>
                    
                    <div className="form-content">
                      {/* NAME FIELD - FIRST */}
                      <div className="input-group">
                        <label>الاسم الكامل</label>
                        <input
                          type="text"
                          placeholder="أدخل اسمك الكامل"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      {/* CITY FIELD */}
                      <div className="input-group">
                        <label>المدينة</label>
                        <input
                          type="text"
                          placeholder="أدخل اسم المدينة"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      {/* PHONE FIELD */}
                      <div className="input-group">
                        <label>رقم الهاتف</label>
                        <input
                          type="tel"
                          placeholder="أدخل رقم الهاتف"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      
                      {/* ADDRESS FIELD */}
                      <div className="input-group">
                        <label>العنوان الكامل</label>
                        <textarea
                          placeholder="أدخل العنوان الكامل مع التفاصيل"
                          value={fullAddress}
                          onChange={(e) => setFullAddress(e.target.value)}
                          className="form-textarea"
                          rows="4"
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button
                          className="cancel-btn"
                          onClick={() => setShowAddressForm(false)}
                        >
                          إلغاء
                        </button>
                        <button
                          className="submit-btn"
                          onClick={submitOrder}
                          disabled={!customerName || !city || !fullAddress || !phoneNumber}
                        >
                          🚀 تأكيد الطلب
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              
            </>
          )}
        </div>
      </div>
      
      {/* Success Message - Move it here */}
      {showSuccessMessage && (
        <div className="success-message-overlay">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>تم ارسال طلبك بنجاح</h3>
            <p>سيتم التواصل معك بأقرب وقت ممكن لتأكيد الطلبية</p>
          </div>
        </div>
      )}
    </>
  );
};

const advancedStyles = `
  * {
    box-sizing: border-box;
  }

  .cart-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .cart-content {
    max-width: 900px;
    margin: 0 auto;
  }

  .cart-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .cart-title {
    color: #000;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(182, 176, 159, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .item-count {
    background: #B6B09F;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: bold;
    animation: bounce 0.5s ease;
  }

  @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    80% { transform: translateY(-5px); }
  }

  .empty-cart {
    background: white;
    border-radius: 20px;
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    margin: 2rem 0;
  }

  .empty-cart-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-cart h2 {
    color: #000;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .empty-cart p {
    color: #666;
    font-size: 1rem;
  }

  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .cart-item {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border-left: 5px solid #B6B09F;
  }

  .cart-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }

  .item-info {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-image {
    font-size: 2rem;
    color: #ccc;
  }

  .item-details {
    flex: 1;
  }

  .item-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #000;
    margin: 0 0 0.5rem 0;
  }

  .item-price {
    color: #B6B09F;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }

  .item-subtotal {
    color: #000;
    font-size: 0.9rem;
    margin: 0;
  }

  .item-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 25px;
    padding: 0.25rem;
    border: 2px solid #e9ecef;
  }

  .qty-btn {
    width: 35px;
    height: 35px;
    border: none;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .qty-btn:hover:not(:disabled) {
    background: #B6B09F;
    color: white;
    transform: scale(1.1);
  }

  .qty-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .qty-btn.decrease:hover:not(:disabled) {
    background: #A09B89;
  }

  .qty-btn.increase:hover:not(:disabled) {
    background: #B6B09F;
  }

  .quantity {
    margin: 0 1rem;
    font-weight: bold;
    font-size: 1.1rem;
    min-width: 2rem;
    text-align: center;
  }

  .delete-btn {
    background: linear-gradient(135deg, #B6B09F 0%, #A09B89 100%);
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .delete-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(182, 176, 159, 0.4);
  }

  .undo-notification {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 25px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1000;
    animation: slideInUp 0.3s ease;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .undo-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .undo-text {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .undo-btn {
    background: #B6B09F;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .undo-btn:hover {
    background: #A09B89;
    transform: scale(1.05);
  }

  .cart-summary {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    border-top: 5px solid #B6B09F;
  }

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    border: 2px solid #B6B09F;
  }

  .total-label {
    font-size: 1.3rem;
    font-weight: 600;
    color: #000;
  }

  .total-price {
    font-size: 2rem;
    font-weight: 700;
    color: #B6B09F;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .confirm-order-btn {
    background: linear-gradient(135deg, #B6B09F 0%, #A09B89 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(182, 176, 159, 0.3);
  }

  .confirm-order-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(182, 176, 159, 0.4);
  }

  .address-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .address-form {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(50px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form-header {
    background: linear-gradient(135deg, #B6B09F 0%, #A09B89 100%);
    color: white;
    padding: 2rem;
    border-radius: 20px 20px 0 0;
    text-align: center;
  }

  .form-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }

  .form-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .form-content {
    padding: 2rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #000;
    font-size: 1rem;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #B6B09F;
    background: white;
    box-shadow: 0 0 0 3px rgba(182, 176, 159, 0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .cancel-btn {
    flex: 1;
    background: #6c757d;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cancel-btn:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }

  .submit-btn {
    flex: 2;
    background: linear-gradient(135deg, #B6B09F 0%, #A09B89 100%);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(182, 176, 159, 0.4);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .success-message-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    animation: fadeIn 0.3s ease;
  }

  .success-message {
    background: white;
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
    max-width: 400px;
    width: 90%;
  }

  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 0.5s ease;
  }

  .success-message h3 {
    color: #B6B09F;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .success-message p {
    color: #000;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .cart-container {
      padding: 0.5rem;
    }

    .cart-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-info {
      flex-direction: column;
      text-align: center;
    }

    .item-image {
      width: 60px;
      height: 60px;
      margin: 0 auto;
    }

    .item-controls {
      flex-direction: column;
      gap: 1rem;
    }

    .total-section {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .form-actions {
      flex-direction: column;
    }

    .address-form {
      width: 95%;
      margin: 1rem;
    }

    .form-content {
      padding: 1rem;
    }

    .form-header {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .cart-item {
      padding: 1rem;
    }

    .cart-summary {
      padding: 1rem;
    }

    .total-price {
      font-size: 1.5rem;
    }

    .confirm-order-btn {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }
  }
`;

export default Cart;