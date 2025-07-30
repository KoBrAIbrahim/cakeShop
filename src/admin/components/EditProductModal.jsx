// admin/components/EditProductModal.jsx
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const EditProductModal = ({ product, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || "",
    type: product.type || "",
    description: product.description || "",
    image: product.images?.[0] || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.type || !form.description) {
      return alert("يرجى تعبئة جميع الحقول المطلوبة");
    }

    setLoading(true);
    try {
      const updated = {
        name: form.name,
        price: Number(form.price),
        type: form.type,
        description: form.description,
        images: form.image ? [form.image] : []
      };
      const ref = doc(db, "products", product.id);
      await updateDoc(ref, updated);
      onUpdated();
      onClose();
    } catch (error) {
      console.error("فشل في التحديث:", error);
      alert("حدث خطأ أثناء تحديث المنتج.");
    }
    setLoading(false);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
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
            📝 تعديل المنتج
          </h3>
          <p style={{
            margin: "0.5rem 0 0",
            opacity: "0.9",
            fontSize: "clamp(0.9rem, 3vw, 1rem)"
          }}>
            {product.name}
          </p>
        </div>

        {/* Form Content */}
        <div style={{ 
          maxHeight: "70vh", 
          overflowY: "auto",
          padding: "0 0.5rem"
        }}>
          {/* Product Name */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "600",
              color: "#8B4513"
            }}>
              🧁 اسم المنتج
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="اسم المنتج" 
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Price */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "600",
              color: "#8B4513"
            }}>
              💰 السعر (بالشيكل)
            </label>
            <input 
              name="price" 
              type="number"
              value={form.price} 
              onChange={handleChange} 
              placeholder="السعر" 
              style={inputStyle}
              min="0"
              step="0.01"
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Type */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "600",
              color: "#8B4513"
            }}>
              📦 نوع المنتج
            </label>
            <input 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              placeholder="النوع" 
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "600",
              color: "#8B4513"
            }}>
              📝 وصف المنتج
            </label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="وصف المنتج" 
              style={textareaStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Current Image Preview */}
          {form.image && (
            <div style={{
              background: "rgba(250, 247, 243, 0.7)",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid rgba(240, 228, 211, 0.5)",
              marginBottom: "1.5rem"
            }}>
              <label style={{
                display: "block",
                marginBottom: "0.8rem",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                fontWeight: "600",
                color: "#8B4513",
                textAlign: "center"
              }}>
                👁️ الصورة الحالية
              </label>
              <div style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(217, 162, 153, 0.2)",
                position: "relative"
              }}>
                <img
                  src={form.image}
                  alt="صورة المنتج"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                    display: "block"
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                  onLoad={(e) => {
                    e.target.style.display = "block";
                    e.target.nextSibling.style.display = "none";
                  }}
                />
                <div style={{
                  display: "none",
                  height: "200px",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
                  color: "#8B4513",
                  fontSize: "1rem",
                  textAlign: "center"
                }}>
                  ❌ فشل في تحميل الصورة<br/>
                  <span style={{ fontSize: "0.8rem", opacity: "0.7" }}>
                    تأكد من صحة الرابط
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Image URL */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "600",
              color: "#8B4513"
            }}>
              🖼️ رابط الصورة الجديد (اختياري)
            </label>
            <input 
              name="image" 
              type="url"
              value={form.image} 
              onChange={handleChange} 
              placeholder="رابط الصورة الجديد" 
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.boxShadow = "none";
              }}
            />
            <div style={{
              fontSize: "0.8rem",
              color: "#8B4513",
              opacity: "0.7",
              marginTop: "0.3rem",
              textAlign: "center"
            }}>
              💡 اتركه فارغاً للاحتفاظ بالصورة الحالية
            </div>
          </div>

          {/* Product Info Summary */}
          <div style={{
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            padding: "1rem",
            borderRadius: "12px",
            marginBottom: "1rem",
            color: "#FAF7F3"
          }}>
            <div style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              marginBottom: "0.5rem",
              textAlign: "center",
              fontWeight: "600"
            }}>
              📊 ملخص المنتج
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              fontSize: "clamp(0.8rem, 2vw, 0.9rem)"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ opacity: "0.8" }}>السعر</div>
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  ₪{form.price || "0"}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ opacity: "0.8" }}>النوع</div>
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  {form.type || "غير محدد"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
          flexWrap: "wrap"
        }}>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: "1rem 2rem",
              background: loading 
                ? "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)"
                : "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              color: loading ? "#8B4513" : "#FAF7F3",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "clamp(1rem, 3vw, 1.1rem)",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: loading 
                ? "none"
                : "0 6px 20px rgba(217, 162, 153, 0.3)",
              minWidth: "140px",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 8px 25px rgba(217, 162, 153, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 6px 20px rgba(217, 162, 153, 0.3)";
              }
            }}
          >
            {loading ? (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.5rem" 
              }}>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(139, 69, 19, 0.3)",
                  borderTop: "2px solid #8B4513",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                جاري التحديث...
              </div>
            ) : (
              "💾 حفظ التغييرات"
            )}
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
              minWidth: "140px"
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

      {/* CSS for animations and responsive design */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          input, textarea, select {
            font-size: 16px !important; /* Prevent zoom on mobile */
          }
          
          .form-content {
            padding: 0 0.5rem;
            max-height: 65vh;
          }
          
          .image-preview img {
            max-height: 200px;
          }
        }
        
        @media (max-width: 480px) {
          .form-content {
            padding: 0;
            max-height: 60vh;
          }
          
          .button-group {
            flex-direction: column;
          }
        }
        
        @media (orientation: landscape) and (max-height: 600px) {
          .form-content {
            max-height: 50vh;
          }
        }
        
        @supports (-webkit-touch-callout: none) {
          /* iOS specific styles */
          .modal {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

const overlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Safari support
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
  padding: window.innerWidth > 768 ? "2rem" : "1rem",
  overscrollBehavior: "contain", // Prevent body scroll
};

const modal = {
  background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 100%)",
  padding: window.innerWidth > 768 ? "2rem" : "1rem",
  borderRadius: window.innerWidth > 768 ? "20px" : "16px",
  width: "95%",
  maxWidth: "600px",
  minWidth: "280px",
  maxHeight: window.innerWidth > 768 ? "90vh" : "95vh",
  overflowY: "auto",
  overflowX: "hidden",
  boxShadow: "0 20px 40px rgba(217, 162, 153, 0.25)",
  border: "1px solid rgba(240, 228, 211, 0.5)",
  fontFamily: "Arial, sans-serif",
  direction: "rtl",
  WebkitOverflowScrolling: "touch", // iOS smooth scroll
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(217, 162, 153, 0.5) transparent",
  margin: "auto",
  transform: "translateZ(0)", // Hardware acceleration
};

const inputStyle = {
  width: "100%",
  padding: "1rem",
  border: "2px solid #F0E4D3",
  borderRadius: "12px",
  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
  background: "#FAF7F3",
  color: "#8B4513",
  outline: "none",
  transition: "all 0.3s ease",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box"
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical",
  lineHeight: "1.5",
  fontFamily: "Arial, sans-serif"
};

export default EditProductModal;