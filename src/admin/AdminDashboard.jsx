import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const productsSnapshot = await getDocs(collection(db, "products"));

      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
      setProducts(productsData);
    };

    fetchData();
  }, []);

  // إحصائيات
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const doneOrders = orders.filter((o) => o.status === "done").length;
  const totalSales = orders
    .filter((o) => o.status === "done")
    .reduce((acc, o) => acc + Number(o.total_price || 0), 0);

  // آخر 3 طلبات
  const latestOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

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
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h2 style={{ 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
          marginBottom: "1.5rem",
          background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: "1px",
          textShadow: "0 2px 4px rgba(217, 162, 153, 0.1)"
        }}>
          🛠️ لوحة تحكم الإدارة
        </h2>

        {/* الإحصائيات */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div style={cardStyle}>
            <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginBottom: "0.5rem" }}>📦</div>
            <div style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "bold", marginBottom: "0.3rem", color: "#FAF7F3" }}>{totalOrders}</div>
            <div style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)", opacity: "0.9", color: "#FAF7F3" }}>الطلبات الكلية</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginBottom: "0.5rem" }}>⏳</div>
            <div style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "bold", marginBottom: "0.3rem", color: "#FAF7F3" }}>{pendingOrders}</div>
            <div style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)", opacity: "0.9", color: "#FAF7F3" }}>المعلقة</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginBottom: "0.5rem" }}>✅</div>
            <div style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "bold", marginBottom: "0.3rem", color: "#FAF7F3" }}>{doneOrders}</div>
            <div style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)", opacity: "0.9", color: "#FAF7F3" }}>المكتملة</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginBottom: "0.5rem" }}>🧁</div>
            <div style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "bold", marginBottom: "0.3rem", color: "#FAF7F3" }}>{products.length}</div>
            <div style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)", opacity: "0.9", color: "#FAF7F3" }}>المنتجات</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginBottom: "0.5rem" }}>💰</div>
            <div style={{ fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: "bold", marginBottom: "0.3rem", color: "#FAF7F3" }}>₪{totalSales}</div>
            <div style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)", opacity: "0.9", color: "#FAF7F3" }}>إجمالي المبيعات</div>
          </div>
        </div>

        {/* الطلبات الأخيرة */}
        <div style={{
          background: "rgba(250, 247, 243, 0.7)",
          borderRadius: "20px",
          padding: "1rem",
          boxShadow: "0 10px 25px rgba(217, 162, 153, 0.1)",
          border: "1px solid rgba(240, 228, 211, 0.5)"
        }}>
          <h3 style={{
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "600",
            textAlign: "center"
          }}>
            📋 آخر الطلبات
          </h3>
          <div style={{ 
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            marginLeft: "-1rem",
            marginRight: "-1rem",
            paddingLeft: "1rem",
            paddingRight: "1rem"
          }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)"
                }}>
                  <th style={thStyle}>الزبون</th>
                  <th style={thStyle}>الحالة</th>
                  <th style={thStyle}>التاريخ</th>
                  <th style={thStyle}>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order, index) => (
                  <tr key={order.id} style={{
                    background: index % 2 === 0 ? "#FAF7F3" : "#F0E4D3",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(220, 197, 178, 0.3)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? "#FAF7F3" : "#F0E4D3";
                    e.currentTarget.style.transform = "scale(1)";
                  }}>
                    <td style={tdStyle}>{order.customer_name || "غير معروف"}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                        fontWeight: "500",
                        background: order.status === "pending" 
                          ? "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)"
                          : "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
                        color: order.status === "pending" ? "#8B4513" : "#FAF7F3",
                        border: "1px solid rgba(217, 162, 153, 0.3)",
                        whiteSpace: "nowrap",
                        display: "inline-block"
                      }}>
                        {order.status === "pending" ? "📦 قيد التنفيذ" : "✅ مكتمل"}
                      </span>
                    </td>
                    <td style={tdStyle}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{...tdStyle, fontWeight: "bold", color: "#D9A299"}}>₪{order.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSS for responsive design */}
      <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 0.5rem !important;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            gap: 0.8rem !important;
          }
          
          .card {
            padding: 1rem !important;
            min-height: 100px !important;
          }
          
          .table-container {
            padding: 0.8rem !important;
          }
          
          .status-badge {
            padding: 0.3rem 0.6rem !important;
            font-size: 0.8rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-container {
            padding: 0.25rem !important;
          }
          
          .main-card {
            padding: 1rem !important;
            border-radius: 16px !important;
          }
          
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.5rem !important;
          }
          
          .card {
            padding: 0.8rem !important;
            min-height: 90px !important;
            border-radius: 12px !important;
          }
          
          .table-scroll {
            margin-left: -1rem !important;
            margin-right: -1rem !important;
          }
        }
        
        /* Smooth scrolling for touch devices */
        .table-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(217, 162, 153, 0.5) transparent;
        }
        
        .table-scroll::-webkit-scrollbar {
          height: 6px;
        }
        
        .table-scroll::-webkit-scrollbar-track {
          background: rgba(240, 228, 211, 0.3);
          border-radius: 10px;
        }
        
        .table-scroll::-webkit-scrollbar-thumb {
          background: rgba(217, 162, 153, 0.5);
          border-radius: 10px;
        }
        
        .table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 162, 153, 0.7);
        }
      `}</style>
    </div>
  );
};

const cardStyle = {
  background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
  padding: "1.5rem",
  borderRadius: "16px",
  color: "#FAF7F3",
  fontSize: "1rem",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(217, 162, 153, 0.2)",
  border: "1px solid rgba(250, 247, 243, 0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
};

const tableStyle = {
  width: "100%",
  minWidth: "500px",
  borderCollapse: "collapse",
  background: "#FAF7F3",
  boxShadow: "0 10px 25px rgba(217, 162, 153, 0.15)",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid rgba(240, 228, 211, 0.5)"
};

const thStyle = {
  padding: "0.8rem",
  color: "#FAF7F3",
  fontWeight: "600",
  fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
  textAlign: "center",
  borderBottom: "2px solid rgba(250, 247, 243, 0.2)",
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "0.8rem",
  textAlign: "center",
  fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
  color: "#8B4513",
  borderBottom: "1px solid rgba(217, 162, 153, 0.1)",
  whiteSpace: "nowrap"
};

export default AdminDashboard;