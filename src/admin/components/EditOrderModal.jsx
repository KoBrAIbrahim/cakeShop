// admin/components/EditOrderModal.jsx
import { useState, useEffect } from "react";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const EditOrderModal = ({ order, onClose, onSave }) => {
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(order.items || []);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const handleItemChange = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const handleDeleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleAddProduct = (product) => {
    const exists = items.find(item => item.product_id === product.id);
    if (!exists) {
      setItems(prev => [...prev, {
        product_id: product.id,
        name: product.name,
        price_per_one: product.price,
        quantity: 1
      }]);
    }
    setShowAddProductModal(false);
  };

  const handleSave = async () => {
    // Calculate total price
    const total_price = items.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parseFloat(item.price_per_one) || 0;
      return sum + quantity * price;
    }, 0);

    const ref = doc(db, "orders", order.id);
    await updateDoc(ref, { status, items, total_price });
    onSave();
    onClose();
  };


  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parseFloat(item.price_per_one) || 0;
      return sum + quantity * price;
    }, 0);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
          margin: "-2rem -2rem 2rem -2rem",
          padding: "1.5rem 2rem",
          borderRadius: "20px 20px 0 0",
          color: "#FAF7F3",
          textAlign: "center"
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "clamp(1.3rem, 4vw, 1.6rem)",
            fontWeight: "700"
          }}>
            ✏️ تعديل الطلب
          </h3>
          <p style={{
            margin: "0.5rem 0 0",
            opacity: "0.9",
            fontSize: "clamp(0.9rem, 3vw, 1rem)"
          }}>
            {order.customer_name}
          </p>
        </div>

        {/* Status Section */}
        <div style={{
          background: "rgba(250, 247, 243, 0.7)",
          padding: "1.5rem",
          borderRadius: "16px",
          marginBottom: "1.5rem",
          border: "1px solid rgba(240, 228, 211, 0.5)"
        }}>
          <label style={{
            display: "block",
            marginBottom: "0.8rem",
            fontSize: "clamp(1rem, 3vw, 1.1rem)",
            fontWeight: "600",
            color: "#8B4513"
          }}>
            📊 حالة الطلب:
          </label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "2px solid #F0E4D3",
              background: "#FAF7F3",
              fontSize: "clamp(0.9rem, 3vw, 1rem)",
              color: "#8B4513",
              fontWeight: "500",
              outline: "none",
              transition: "all 0.3s ease",
              direction: "rtl"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#DCC5B2";
              e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#F0E4D3";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="pending">⏳ قيد الانتظار</option>
            <option value="in-progress">🔄 قيد التنفيذ</option>
            <option value="done">✅ مكتمل</option>
            <option value="reject">❌ مرفوض</option>
          </select>
        </div>

        {/* Products Section */}
        <div style={{
          background: "rgba(250, 247, 243, 0.7)",
          padding: "1.5rem",
          borderRadius: "16px",
          marginBottom: "1.5rem",
          border: "1px solid rgba(240, 228, 211, 0.5)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h4 style={{
              margin: 0,
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              color: "#8B4513",
              fontWeight: "600"
            }}>
              🧁 المنتجات:
            </h4>
            <button 
              onClick={() => setShowAddProductModal(true)}
              style={{
                padding: "0.6rem 1.2rem",
                background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
                color: "#FAF7F3",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(217, 162, 153, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(217, 162, 153, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(217, 162, 153, 0.3)";
              }}
            >
              ➕ إضافة منتج
            </button>
          </div>

          {items.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "2rem",
              color: "#8B4513",
              opacity: "0.7"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
              <div>لا توجد منتجات في هذا الطلب</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  background: "#FAF7F3",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(240, 228, 211, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}>
                  <div style={{
                    flex: "1",
                    minWidth: "150px",
                    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                    fontWeight: "500",
                    color: "#8B4513"
                  }}>
                    {item.name}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <label style={{
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      color: "#8B4513"
                    }}>
                      الكمية:
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
                      style={{
                        width: "80px",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid #F0E4D3",
                        background: "#FAF7F3",
                        fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                        textAlign: "center",
                        outline: "none"
                      }}
                      min="1"
                    />
                  </div>

                  <div style={{
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    fontWeight: "600",
                    color: "#D9A299"
                  }}>
                    ₪{(item.quantity * item.price_per_one).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => handleDeleteItem(i)}
                    style={{
                      padding: "0.5rem",
                      background: "linear-gradient(135deg, #D9A299 0%, #F0E4D3 100%)",
                      color: "#8B4513",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #F0E4D3 0%, #D9A299 100%)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #D9A299 0%, #F0E4D3 100%)";
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total Price */}
          {items.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              padding: "1rem",
              borderRadius: "12px",
              marginTop: "1rem",
              textAlign: "center",
              color: "#FAF7F3"
            }}>
              <div style={{
                fontSize: "clamp(0.9rem, 3vw, 1rem)",
                marginBottom: "0.3rem"
              }}>
                💰 الإجمالي
              </div>
              <div style={{
                fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
                fontWeight: "bold"
              }}>
                ₪{calculateTotal().toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button 
            onClick={handleSave}
            style={{
              padding: "1rem 2rem",
              background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              color: "#FAF7F3",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "clamp(1rem, 3vw, 1.1rem)",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 6px 20px rgba(217, 162, 153, 0.3)",
              minWidth: "120px"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 8px 25px rgba(217, 162, 153, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 6px 20px rgba(217, 162, 153, 0.3)";
            }}
          >
            💾 حفظ التغييرات
          </button>
          
          <button 
            onClick={onClose}
            style={{
              padding: "1rem 2rem",
              background: "rgba(240, 228, 211, 0.8)",
              color: "#8B4513",
              border: "2px solid rgba(217, 162, 153, 0.3)",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "clamp(1rem, 3vw, 1.1rem)",
              fontWeight: "600",
              transition: "all 0.3s ease",
              minWidth: "120px"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(217, 162, 153, 0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(240, 228, 211, 0.8)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ❌ إلغاء
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={addProductModalOverlay}>
          <div style={addProductModalContent}>
            <div style={{
              background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              margin: "-1.5rem -1.5rem 1.5rem -1.5rem",
              padding: "1.5rem",
              borderRadius: "16px 16px 0 0",
              color: "#FAF7F3",
              textAlign: "center"
            }}>
              <h4 style={{
                margin: 0,
                fontSize: "clamp(1.2rem, 4vw, 1.4rem)",
                fontWeight: "700"
              }}>
                🧁 اختر منتج لإضافته
              </h4>
            </div>

            <div style={{
              maxHeight: "300px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem"
            }}>
              {products.map((product) => (
                <div key={product.id} style={{
                  background: "#FAF7F3",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(240, 228, 211, 0.5)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{
                    flex: 1,
                    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                    color: "#8B4513"
                  }}>
                    <div style={{ fontWeight: "600", marginBottom: "0.2rem" }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      color: "#D9A299",
                      fontWeight: "600"
                    }}>
                      ₪{product.price}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddProduct(product)}
                    style={{
                      padding: "0.6rem 1rem",
                      background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
                      color: "#FAF7F3",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    ➕ إضافة
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowAddProductModal(false)}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(240, 228, 211, 0.8)",
                color: "#8B4513",
                border: "2px solid rgba(217, 162, 153, 0.3)",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "clamp(1rem, 3vw, 1.1rem)",
                fontWeight: "600",
                marginTop: "1rem",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(217, 162, 153, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(240, 228, 211, 0.8)";
              }}
            >
              ❌ إغلاق
            </button>
          </div>
        </div>
      )}

      {/* CSS for responsive design */}
      <style jsx>{`
        @media (max-width: 768px) {
          .modal-content {
            border-radius: 16px;
          }
          
          .modal-header {
            padding: 1rem;
          }
          
          .modal-body {
            padding: 1rem;
          }
          
          .item-controls {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .modal-content {
            border-radius: 12px;
            margin: 0.5rem;
          }
          
          .button-group {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .product-item {
            flex-wrap: wrap;
          }
        }

        @supports (-webkit-touch-callout: none) {
          /* CSS specific to iOS devices */
          .modal-content {
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Custom scrollbar styles */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(240, 228, 211, 0.3);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(217, 162, 153, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)", // For Safari support
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
  padding: window.innerWidth > 768 ? "2rem" : "1rem",
  overflowY: "auto",
  overscrollBehavior: "contain" // Prevent body scroll on mobile
};

const modalContent = {
  background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 100%)",
  padding: window.innerWidth > 768 ? "2rem" : "1rem",
  borderRadius: window.innerWidth > 768 ? "20px" : "16px",
  width: "100%",
  maxWidth: "600px",
  minWidth: "280px",
  maxHeight: "calc(100vh - 4rem)",
  height: "auto",
  overflowY: "auto",
  overflowX: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  border: "1px solid rgba(240, 228, 211, 0.5)",
  fontFamily: "Arial, sans-serif",
  direction: "rtl",
  margin: "auto",
  transform: "translateY(0)",
  transition: "transform 0.3s ease, opacity 0.3s ease",
  WebkitOverflowScrolling: "touch", // Smooth scroll on iOS
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(217, 162, 153, 0.5) transparent"
};

const addProductModalOverlay = {
  ...modalOverlay,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)"
};

const addProductModalContent = {
  ...modalContent,
  maxWidth: "500px",
  maxHeight: "80vh",
  width: window.innerWidth > 768 ? "90%" : "95%",
  padding: window.innerWidth > 768 ? "1.5rem" : "1rem"
};

export default EditOrderModal;