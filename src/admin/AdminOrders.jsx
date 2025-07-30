import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import EditOrderModal from "./components/EditOrderModal"; // adjust path as needed

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filteredStatus === "all"
    ? orders
    : orders.filter(order => order.status === filteredStatus);

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return "⏳";
      case "in-progress": return "🔄";
      case "done": return "✅";
      case "reject": return "❌";
      default: return "📦";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)";
      case "in-progress": return "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)";
      case "done": return "linear-gradient(135deg, #D9A299 0%, #DCC5B2 100%)";
      case "reject": return "linear-gradient(135deg, #D9A299 0%, #F0E4D3 100%)";
      default: return "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)";
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case "pending": return "#8B4513";
      case "in-progress": return "#FAF7F3";
      case "done": return "#FAF7F3";
      case "reject": return "#8B4513";
      default: return "#8B4513";
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
        <h2 style={{ 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
          marginBottom: "2rem",
          background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: "1px"
        }}>
          📦 إدارة الطلبات
        </h2>

        {/* الفلتر */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.8rem",
          justifyContent: "center",
          marginBottom: "2rem",
          padding: "1rem",
          background: "rgba(250, 247, 243, 0.7)",
          borderRadius: "16px",
          border: "1px solid rgba(240, 228, 211, 0.5)"
        }}>
          {["all", "pending", "in-progress", "done", "reject"].map(status => (
            <button
              key={status}
              onClick={() => setFilteredStatus(status)}
              style={{
                padding: "0.8rem 1.5rem",
                background: filteredStatus === status 
                  ? "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)"
                  : "rgba(250, 247, 243, 0.8)",
                color: filteredStatus === status ? "#FAF7F3" : "#8B4513",
                border: filteredStatus === status 
                  ? "2px solid rgba(217, 162, 153, 0.5)"
                  : "2px solid rgba(240, 228, 211, 0.5)",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                fontWeight: "600",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                boxShadow: filteredStatus === status 
                  ? "0 8px 20px rgba(217, 162, 153, 0.3)"
                  : "0 4px 10px rgba(217, 162, 153, 0.1)"
              }}
              onMouseEnter={(e) => {
                if (filteredStatus !== status) {
                  e.target.style.background = "rgba(220, 197, 178, 0.3)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (filteredStatus !== status) {
                  e.target.style.background = "rgba(250, 247, 243, 0.8)";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{ marginLeft: "0.5rem" }}>
                {status === "all" && "📊"}
                {status === "pending" && "⏳"}
                {status === "in-progress" && "🔄"}
                {status === "done" && "✅"}
                {status === "reject" && "❌"}
              </span>
              {status === "all" && "الكل"}
              {status === "pending" && "قيد الانتظار"}
              {status === "in-progress" && "قيد التنفيذ"}
              {status === "done" && "مكتمل"}
              {status === "reject" && "مرفوض"}
            </button>
          ))}
        </div>

        {/* إحصائيات سريعة */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)",
            padding: "1rem",
            borderRadius: "12px",
            textAlign: "center",
            color: "#FAF7F3"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{filteredOrders.length}</div>
            <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>الطلبات المعروضة</div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #F0E4D3 0%, #DCC5B2 100%)",
            padding: "1rem",
            borderRadius: "12px",
            textAlign: "center",
            color: "#8B4513"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{orders.length}</div>
            <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>إجمالي الطلبات</div>
          </div>
        </div>

        {/* جدول الطلبات */}
        <div style={{
          background: "rgba(250, 247, 243, 0.7)",
          borderRadius: "16px",
          padding: "1rem",
          boxShadow: "0 10px 25px rgba(217, 162, 153, 0.1)",
          border: "1px solid rgba(240, 228, 211, 0.5)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch"
        }}>
          <table style={{
            width: "100%",
            minWidth: "700px",
            borderCollapse: "collapse",
            background: "#FAF7F3",
            boxShadow: "0 8px 20px rgba(217, 162, 153, 0.1)",
            borderRadius: "12px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ 
                background: "linear-gradient(135deg, #DCC5B2 0%, #D9A299 100%)"
              }}>
                <th style={{
                  padding: "1rem",
                  color: "#FAF7F3",
                  fontWeight: "600",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  textAlign: "center",
                  borderBottom: "2px solid rgba(250, 247, 243, 0.2)"
                }}>👤 الزبون</th>
                <th style={{
                  padding: "1rem",
                  color: "#FAF7F3",
                  fontWeight: "600",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  textAlign: "center",
                  borderBottom: "2px solid rgba(250, 247, 243, 0.2)"
                }}>📞 الهاتف</th>
                <th style={{
                  padding: "1rem",
                  color: "#FAF7F3",
                  fontWeight: "600",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  textAlign: "center",
                  borderBottom: "2px solid rgba(250, 247, 243, 0.2)"
                }}>📊 الحالة</th>
                <th style={{
                  padding: "1rem",
                  color: "#FAF7F3",
                  fontWeight: "600",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  textAlign: "center",
                  borderBottom: "2px solid rgba(250, 247, 243, 0.2)"
                }}>💰 الإجمالي</th>
                <th style={{
                  padding: "1rem",
                  color: "#FAF7F3",
                  fontWeight: "600",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  textAlign: "center",
                  borderBottom: "2px solid rgba(250, 247, 243, 0.2)"
                }}>⚙️ إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr 
                  key={order.id} 
                  style={{
                    background: index % 2 === 0 ? "#FAF7F3" : "#F0E4D3",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(220, 197, 178, 0.3)";
                    e.currentTarget.style.transform = "scale(1.01)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? "#FAF7F3" : "#F0E4D3";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <td style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
                    color: "#8B4513",
                    fontWeight: "500"
                  }}>{order.customer_name}</td>
                  <td style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
                    color: "#8B4513",
                    direction: "ltr"
                  }}>{order.phone}</td>
                  <td style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)"
                  }}>
                    <span style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                      fontWeight: "600",
                      background: getStatusColor(order.status),
                      color: getStatusTextColor(order.status),
                      border: "1px solid rgba(217, 162, 153, 0.3)",
                      whiteSpace: "nowrap",
                      display: "inline-block"
                    }}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </td>
                  <td style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
                    color: "#D9A299",
                    fontWeight: "bold"
                  }}>{order.total_price}₪</td>
                  <td style={{
                    padding: "1rem",
                    textAlign: "center"
                  }}>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: "0.6rem 1.2rem",
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
                      ✏️ تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              color: "#8B4513",
              fontSize: "1.2rem"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <div>لا توجد طلبات لعرضها</div>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={fetchOrders}
        />
      )}

      {/* CSS for responsive design */}
      <style jsx>{`
        @media (max-width: 768px) {
          .filter-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .filter-button {
            margin: 0.25rem 0 !important;
          }
          
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.8rem !important;
          }
          
          .table-container {
            padding: 0.5rem !important;
          }
          
          table {
            min-width: 600px !important;
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
            grid-template-columns: 1fr !important;
          }
          
          .filter-container {
            padding: 0.8rem !important;
          }
          
          table {
            min-width: 500px !important;
          }
          
          th, td {
            padding: 0.6rem !important;
          }
        }
        
        /* Custom scrollbar */
        .table-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(217, 162, 153, 0.5) transparent;
        }
        
        .table-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .table-container::-webkit-scrollbar-track {
          background: rgba(240, 228, 211, 0.3);
          border-radius: 10px;
        }
        
        .table-container::-webkit-scrollbar-thumb {
          background: rgba(217, 162, 153, 0.5);
          border-radius: 10px;
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 162, 153, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;