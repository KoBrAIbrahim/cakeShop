// admin/components/AddProductModal.jsx
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const AddProductModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !price || !type || !description || !imageUrl) {
      return alert("يرجى تعبئة جميع الحقول بما فيها رابط الصورة");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        type,
        description,
        images: [imageUrl],
        created_at: Timestamp.now(),
      });
      onAdd();
      onClose();
    } catch (error) {
      console.error("فشل الإضافة:", error);
      alert("حدث خطأ أثناء حفظ المنتج.");
    }
    setLoading(false);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
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
            ➕ إضافة منتج جديد
          </h3>
          <p style={{
            margin: "0.5rem 0 0",
            opacity: "0.9",
            fontSize: "clamp(0.9rem, 3vw, 1rem)"
          }}>
            أضف منتجاً جديداً إلى متجرك
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
              type="text" 
              placeholder="مثال: كيك الشوكولاتة الفاخر" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
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
              type="number" 
              placeholder="مثال: 150" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
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
              type="text" 
              placeholder="مثال: كيك، حلويات، معجنات" 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
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
              placeholder="اكتب وصفاً مفصلاً عن المنتج..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
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

          {/* Image URL */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              fontWeight: "600",
              color: "#8B4513"
            }}>
              🖼️ رابط الصورة
            </label>
            <input 
              type="url" 
              placeholder="https://example.com/image.jpg" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
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

          {/* Image Preview */}
          {imageUrl && (
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
                👁️ معاينة الصورة
              </label>
              <div style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(217, 162, 153, 0.2)"
              }}>
                <img 
                  src={imageUrl} 
                  alt="معاينة المنتج" 
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
            onClick={handleAdd} 
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
                جاري الإضافة...
              </div>
            ) : (
              "💾 حفظ المنتج"
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
          .modal-content {
            padding: 1rem;
            margin: 1rem;
            max-height: 85vh;
          }
          
          .form-group {
            margin-bottom: 1rem;
          }
          
          .button-group {
            flex-direction: column;
            gap: 0.8rem;
          }
          
          input, textarea {
            font-size: 16px !important; /* Prevent zoom on mobile */
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 0.8rem;
            margin: 0.5rem;
            border-radius: 12px;
          }
          
          .header {
            padding: 1rem !important;
          }
          
          .preview-image {
            max-height: 200px !important;
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) {
          .modal-content {
            -webkit-overflow-scrolling: touch;
          }
          
          input, textarea, button {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Custom Scrollbar */
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

        /* High DPI Screen Optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .modal-content {
            border: 0.5px solid rgba(240, 228, 211, 0.5);
          }
        }

        /* Landscape Mode */
        @media (max-height: 600px) and (orientation: landscape) {
          .modal-content {
            max-height: 95vh;
            margin: 0.5rem;
          }
          
          .form-group {
            margin-bottom: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)", // Safari support
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  padding: window.innerWidth > 768 ? "2rem" : "1rem",
  overscrollBehavior: "contain"
};

const modalStyle = {
  background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 100%)",
  padding: window.innerWidth > 768 ? "2rem" : "1rem",
  borderRadius: window.innerWidth > 768 ? "20px" : "16px",
  width: "95%",
  maxWidth: "480px",
  minWidth: "280px",
  maxHeight: "90vh",
  overflowY: "auto",
  overflowX: "hidden",
  boxShadow: "0 20px 40px rgba(217, 162, 153, 0.25)",
  border: "1px solid rgba(240, 228, 211, 0.5)",
  fontFamily: "Arial, sans-serif",
  direction: "rtl",
  WebkitOverflowScrolling: "touch", // Smooth scroll on iOS
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(217, 162, 153, 0.5) transparent",
  margin: "auto"
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

export default AddProductModal;