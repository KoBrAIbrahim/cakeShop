// admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import EditProductModal from "./components/EditProductModal";
import AddProductModal from "./components/AddProductModal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [deletedProduct, setDeletedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(list);
  };

  const handleDelete = async (product) => {
    setDeletedProduct(product);
    setProducts(prev => prev.filter(p => p.id !== product.id));

    const productIdToDelete = product.id;

    setTimeout(async () => {
      // هون بنفحص إذا لم يتم عمل undo خلال 5 ثواني
      setDeletedProduct(current => {
        if (current && current.id === productIdToDelete) {
          deleteDoc(doc(db, "products", productIdToDelete));
          return null; // امسح الرسالة
        }
        return current; // ما تغير إذا المستخدم عمل undo
      });
    }, 5000);
  };

  const undoDelete = () => {
    if (deletedProduct) {
      setProducts(prev => [...prev, deletedProduct]);
      setDeletedProduct(null);
    }
  };

  return (
    <div style={{ 
      padding: "1rem", 
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 100%)",
      minHeight: "100vh",
      direction: "rtl"
    }}>
      <div style={{
        background: "rgba(250, 247, 243, 0.9)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "1.5rem",
        boxShadow: "0 20px 40px rgba(217, 162, 153, 0.15)",
        border: "1px solid rgba(240, 228, 211, 0.3)",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <h2 style={{ 
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
            margin: 0,
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700",
            letterSpacing: "1px"
          }}>
            🧁 قائمة المنتجات
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
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
              whiteSpace: "nowrap"
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
            ➕ إضافة منتج جديد
          </button>
        </div>

        {/* Statistics */}
        <div style={{
          background: "rgba(250, 247, 243, 0.7)",
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "2rem",
          border: "1px solid rgba(240, 228, 211, 0.5)",
          textAlign: "center"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              padding: "1rem",
              borderRadius: "12px",
              color: "#FAF7F3"
            }}>
              <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: "bold" }}>{products.length}</div>
              <div style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", opacity: "0.9" }}>إجمالي المنتجات</div>
            </div>
          </div>
        </div>

        {/* Undo Delete Notification */}
        {deletedProduct && (
          <div style={{
            background: "linear-gradient(135deg, #D9A299 0%, #DCC5B2 100%)",
            color: "#FAF7F3",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 20px rgba(217, 162, 153, 0.3)",
            animation: "slideIn 0.3s ease-out",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
            }}>
              <span>🗑️</span>
              <span>تم حذف المنتج "{deletedProduct.name}" مؤقتاً</span>
            </div>
            <button 
              onClick={undoDelete}
              style={{
                padding: "0.6rem 1.2rem",
                background: "rgba(250, 247, 243, 0.9)",
                color: "#8B4513",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                fontWeight: "600",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#FAF7F3";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(250, 247, 243, 0.9)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ↩️ تراجع
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          padding: "1rem"
        }}>
          {products.map(product => (
            <div key={product.id} style={{
              background: "rgba(250, 247, 243, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(240, 228, 211, 0.5)",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow: "0 10px 25px rgba(217, 162, 153, 0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              overflow: "hidden",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 162, 153, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(217, 162, 153, 0.1)";
            }}>
              
              {/* Product Image */}
              <div style={{
                width: "100%",
                height: "200px",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "1rem",
                position: "relative",
                background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)"
              }}>
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    color: "#D9A299"
                  }}>
                    🧁
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{
                  margin: "0 0 0.8rem 0",
                  fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
                  fontWeight: "700",
                  color: "#8B4513",
                  lineHeight: "1.3"
                }}>
                  {product.name}
                </h4>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>💰</span>
                  <span style={{
                    fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
                    fontWeight: "bold",
                    color: "#D9A299"
                  }}>
                    {product.price} ₪
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1rem" }}>📦</span>
                  <span style={{
                    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                    color: "#8B4513",
                    background: "rgba(240, 228, 211, 0.6)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "8px",
                    fontWeight: "500"
                  }}>
                    النوع: {product.type}
                  </span>
                </div>

                <p style={{
                  margin: "0.8rem 0 0",
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                  color: "#8B4513",
                  lineHeight: "1.4",
                  opacity: "0.8"
                }}>
                  📝 {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                gap: "0.8rem",
                marginTop: "1.5rem"
              }}>
                <button 
                  onClick={() => setShowEditModal(product)}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
                    color: "#FAF7F3",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
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
                  📝 تعديل
                </button>
                
                <button 
                  onClick={() => handleDelete(product)}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
                    color: "#8B4513",
                    border: "2px solid rgba(217, 162, 153, 0.3)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #D9A299 0%, #DCC5B2 100%)";
                    e.target.style.color = "#FAF7F3";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)";
                    e.target.style.color = "#8B4513";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "#8B4513"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🧁</div>
            <h3 style={{
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              margin: "0 0 0.5rem 0",
              color: "#D9A299"
            }}>
              لا توجد منتجات حالياً
            </h3>
            <p style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              opacity: "0.8",
              margin: 0
            }}>
              ابدأ بإضافة منتجات جديدة لمتجرك
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProductModal 
          product={showEditModal} 
          onClose={() => setShowEditModal(null)}
          onUpdated={fetchProducts}
        />
      )}

      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)}
          onAdd={fetchProducts}
        />
      )}

      {/* CSS for responsive design and animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .header-section {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 1.5rem !important;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 1rem !important;
            padding: 0.5rem !important;
          }
          
          .product-card {
            padding: 1rem !important;
          }
          
          .stats-section {
            padding: 1rem !important;
          }
          
          .undo-notification {
            flex-direction: column !important;
            text-align: center !important;
            gap: 0.8rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .main-container {
            padding: 0.5rem !important;
          }
          
          .content-card {
            padding: 1rem !important;
            border-radius: 16px !important;
          }
          
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .product-card {
            padding: 1rem !important;
            border-radius: 16px !important;
          }
          
          .product-image {
            height: 180px !important;
          }
          
          .action-buttons {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
        }
        
        @media (max-width: 360px) {
          .products-grid {
            padding: 0 !important;
          }
          
          .product-card {
            margin: 0 !important;
          }
        }
        
        /* Custom animations for better UX */
        .product-card {
          animation: fadeInUp 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProducts;