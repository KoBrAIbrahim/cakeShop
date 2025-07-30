import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AdminSales = () => {
  const [sales, setSales] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), where("status", "==", "done"));
      const snapshot = await getDocs(q);

      let total = 0;
      const salesMap = {};

      snapshot.forEach(doc => {
        const order = doc.data();
        total += order.total_price || 0;

        order.items?.forEach(item => {
          const key = item.product_id;

          if (!salesMap[key]) {
            salesMap[key] = {
              name: item.name,
              quantity: 0,
              total: 0,
              timesSold: 0,
            };
          }

          salesMap[key].quantity += Number(item.quantity || 0);
          salesMap[key].total += Number(item.price_per_one || 0) * Number(item.quantity || 0);
          salesMap[key].timesSold += 1;
        });
      });

      setSales(salesMap);
      setTotalRevenue(total);
    } catch (error) {
      console.error("خطأ في جلب بيانات المبيعات:", error);
    }
    setLoading(false);
  };

  const salesArray = Object.entries(sales);
  const totalProducts = salesArray.length;
  const totalQuantitySold = salesArray.reduce((sum, [, data]) => sum + data.quantity, 0);
  const bestSeller = salesArray.reduce((best, [, data]) => 
    (!best || data.quantity > best.quantity) ? data : best, null);

  if (loading) {
    return (
      <div style={{ 
        padding: "1rem", 
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 100%)",
        minHeight: "100vh",
        direction: "rtl",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "rgba(250, 247, 243, 0.9)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "3rem",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(217, 162, 153, 0.15)",
          border: "1px solid rgba(240, 228, 211, 0.3)"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid rgba(220, 197, 178, 0.3)",
            borderTop: "4px solid #DCC5B2",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <div style={{
            fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
            color: "#8B4513",
            fontWeight: "600"
          }}>
            جاري تحميل بيانات المبيعات...
          </div>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <h2 style={{ 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
          margin: "0 0 2rem 0",
          background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: "1px"
        }}>
          📊 ملخص المبيعات
        </h2>

        {/* Statistics Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}>
          {/* Total Revenue */}
          <div style={{
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            padding: "2rem",
            borderRadius: "20px",
            color: "#FAF7F3",
            textAlign: "center",
            boxShadow: "0 15px 35px rgba(217, 162, 153, 0.2)",
            border: "1px solid rgba(250, 247, 243, 0.2)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 20px 45px rgba(217, 162, 153, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 162, 153, 0.2)";
          }}>
            <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.5rem" }}>💰</div>
            <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: "bold", marginBottom: "0.3rem" }}>
              ₪{totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", opacity: "0.9" }}>إجمالي الدخل</div>
          </div>

          {/* Total Products */}
          <div style={{
            background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
            padding: "2rem",
            borderRadius: "20px",
            color: "#8B4513",
            textAlign: "center",
            boxShadow: "0 15px 35px rgba(217, 162, 153, 0.1)",
            border: "1px solid rgba(240, 228, 211, 0.5)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 20px 45px rgba(217, 162, 153, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 162, 153, 0.1)";
          }}>
            <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.5rem" }}>🧁</div>
            <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: "bold", marginBottom: "0.3rem" }}>
              {totalProducts}
            </div>
            <div style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", opacity: "0.9" }}>منتجات مباعة</div>
          </div>

          {/* Total Quantity */}
          <div style={{
            background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
            padding: "2rem",
            borderRadius: "20px",
            color: "#8B4513",
            textAlign: "center",
            boxShadow: "0 15px 35px rgba(217, 162, 153, 0.1)",
            border: "1px solid rgba(240, 228, 211, 0.5)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 20px 45px rgba(217, 162, 153, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 162, 153, 0.1)";
          }}>
            <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.5rem" }}>📦</div>
            <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: "bold", marginBottom: "0.3rem" }}>
              {totalQuantitySold}
            </div>
            <div style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", opacity: "0.9" }}>إجمالي الكمية</div>
          </div>

          {/* Best Seller */}
          {bestSeller && (
            <div style={{
              background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
              padding: "2rem",
              borderRadius: "20px",
              color: "#FAF7F3",
              textAlign: "center",
              boxShadow: "0 15px 35px rgba(217, 162, 153, 0.2)",
              border: "1px solid rgba(250, 247, 243, 0.2)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 45px rgba(217, 162, 153, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 162, 153, 0.2)";
            }}>
              <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "0.5rem" }}>🏆</div>
              <div style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: "bold", marginBottom: "0.3rem" }}>
                {bestSeller.name}
              </div>
              <div style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)", opacity: "0.9" }}>الأكثر مبيعاً</div>
            </div>
          )}
        </div>

        {/* Products Sales Details */}
        <div style={{
          background: "rgba(250, 247, 243, 0.7)",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid rgba(240, 228, 211, 0.5)"
        }}>
          <h3 style={{
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
            marginBottom: "2rem",
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "600",
            textAlign: "center"
          }}>
            📈 تفاصيل مبيعات المنتجات
          </h3>

          {salesArray.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "#8B4513"
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📊</div>
              <h3 style={{
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                margin: "0 0 0.5rem 0",
                color: "#D9A299"
              }}>
                لا توجد مبيعات بعد
              </h3>
              <p style={{
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                opacity: "0.8",
                margin: 0
              }}>
                ستظهر بيانات المبيعات هنا عند إتمام أول طلب
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem"
            }}>
              {salesArray
                .sort(([, a], [, b]) => b.total - a.total) // Sort by total revenue
                .map(([id, data], index) => (
                <div key={id} style={{
                  background: "rgba(250, 247, 243, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(240, 228, 211, 0.5)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(217, 162, 153, 0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 162, 153, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(217, 162, 153, 0.1)";
                }}>
                  
                  {/* Rank Badge */}
                  {index < 3 && (
                    <div style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: index === 0 ? "linear-gradient(45deg, #FFD700, #FFA500)" :
                                index === 1 ? "linear-gradient(45deg, #C0C0C0, #A9A9A9)" :
                                "linear-gradient(45deg, #CD7F32, #B8860B)",
                      color: "#FAF7F3",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  )}

                  {/* Product Info */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{
                      margin: "0 0 1rem 0",
                      fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
                      fontWeight: "700",
                      color: "#8B4513",
                      lineHeight: "1.3"
                    }}>
                      🧁 {data.name}
                    </h4>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
                      padding: "1rem",
                      borderRadius: "12px",
                      textAlign: "center",
                      color: "#8B4513"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.quantity}</div>
                      <div style={{ fontSize: "0.8rem", opacity: "0.8" }}>الكمية المباعة</div>
                    </div>
                    
                    <div style={{
                      background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
                      padding: "1rem",
                      borderRadius: "12px",
                      textAlign: "center",
                      color: "#8B4513"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.timesSold}</div>
                      <div style={{ fontSize: "0.8rem", opacity: "0.8" }}>عدد الطلبات</div>
                    </div>
                  </div>

                  {/* Total Revenue */}
                  <div style={{
                    background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
                    padding: "1rem",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#FAF7F3"
                  }}>
                    <div style={{
                      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                      marginBottom: "0.3rem"
                    }}>
                      💵 إجمالي الدخل
                    </div>
                    <div style={{
                      fontSize: "clamp(1.3rem, 4vw, 1.6rem)",
                      fontWeight: "bold"
                    }}>
                      ₪{data.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS for animations and responsive design */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 1rem !important;
          }
          
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .product-card {
            padding: 1rem !important;
          }
          
          .stats-card {
            padding: 1.5rem !important;
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
          
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.8rem !important;
          }
          
          .product-details {
            padding: 1.5rem !important;
          }
          
          .product-stats {
            grid-template-columns: 1fr !important;
            gap: 0.8rem !important;
          }
        }
        
        /* Animation for cards */
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

export default AdminSales;