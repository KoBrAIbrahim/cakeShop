import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save login state
      localStorage.setItem("admin", "true");

      navigate("/admin/dashboard");
    } catch  {
      setError("خطأ في تسجيل الدخول، تأكد من البريد وكلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Background Animation Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "100px",
        height: "100px",
        background: "rgba(217, 162, 153, 0.2)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        top: "70%",
        right: "15%",
        width: "150px",
        height: "150px",
        background: "rgba(220, 197, 178, 0.15)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite reverse"
      }} />
      
      <div style={{
        maxWidth: "450px",
        width: "100%",
        background: "rgba(250, 247, 243, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "3rem 2.5rem",
        boxShadow: "0 25px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Header Background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
          borderRadius: "20px 20px 0 0",
          opacity: "0.1"
        }} />
        
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
            boxShadow: "0 10px 30px rgba(217, 162, 153, 0.3)"
          }}>
            🛠️
          </div>
          <h2 style={{
            margin: 0,
            fontSize: "1.8rem",
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700",
            letterSpacing: "0.5px"
          }}>
            تسجيل دخول الإدارة
          </h2>
          <p style={{
            margin: "0.5rem 0 0",
            color: "#666",
            fontSize: "0.95rem"
          }}>
            مرحباً بك في لوحة التحكم
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "linear-gradient(135deg, #D9A299 0%, #DCC5B2 100%)",
            color: "white",
            padding: "1rem",
            borderRadius: "12px",
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            boxShadow: "0 5px 15px rgba(217, 162, 153, 0.3)",
            animation: "slideIn 0.3s ease-out"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <div onSubmit={handleLogin} style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          {/* Email Input */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              color: "#D9A299",
              zIndex: 1
            }}>
              📧
            </div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3.5rem",
                borderRadius: "12px",
                border: "2px solid #F0E4D3",
                background: "#FAF7F3",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                outline: "none",
                direction: "ltr",
                textAlign: "left",
                boxSizing: "border-box"
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleLogin();
                }
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.background = "#FAF7F3";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.background = "#FAF7F3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              color: "#D9A299",
              zIndex: 1
            }}>
              🔒
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 3.5rem 1rem 3.5rem",
                borderRadius: "12px",
                border: "2px solid #F0E4D3",
                background: "#FAF7F3",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                outline: "none",
                direction: "ltr",
                textAlign: "left",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#DCC5B2";
                e.target.style.background = "#FAF7F3";
                e.target.style.boxShadow = "0 0 0 3px rgba(220, 197, 178, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#F0E4D3";
                e.target.style.background = "#FAF7F3";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#D9A299",
                padding: "0.25rem"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              background: isLoading 
                ? "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)"
                : "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              color: "#ffffff",
              padding: "1.2rem",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
              letterSpacing: "0.5px",
              boxShadow: isLoading 
                ? "none"
                : "0 10px 30px rgba(217, 162, 153, 0.3)",
              transform: isLoading ? "scale(0.98)" : "scale(1)"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 15px 40px rgba(217, 162, 153, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 30px rgba(217, 162, 153, 0.3)";
              }
            }}
          >
            {isLoading ? (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.5rem" 
              }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                جارٍ تسجيل الدخول...
              </div>
            ) : (
              "🚀 تسجيل الدخول"
            )}
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "2rem",
          padding: "1.5rem 0 0",
          borderTop: "1px solid rgba(220, 197, 178, 0.3)",
          color: "#666",
          fontSize: "0.85rem"
        }}>
          <p style={{ margin: 0 }}>
            🔐 نظام إدارة آمن ومحمي
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          div[style*="maxWidth: 450px"] {
            margin: 1rem !important;
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;