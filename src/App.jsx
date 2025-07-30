import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminSales from "./admin/AdminSales";
import AdminProducts from "./admin/AdminProducts";
import AdminAddProduct from "./admin/components/AddProductModal";
import AdminEditProduct from "./admin/components/EditProductModal";
import AdminRootRedirect from "./admin/AdminRootRedirect";

// ✅ حماية مسارات الأدمن
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("admin");
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppWrapper() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin/login";

  const headerHeight = isAdmin
    ? isLoginPage
      ? "0px"     // لا يوجد هيدر لصفحة تسجيل الدخول
      : "100px"   // هيدر الأدمن
    : "80px";     // هيدر المستخدم العادي

  return (
    <>
      {/* ✅ عرض الهيدر المناسب */}
      {!isAdmin && <Navbar />}
      {isAdmin && !isLoginPage && <AdminNavbar />}

      {/* ✅ تطبيق marginTop حسب الهيدر المعروض */}
      <div style={{ padding: "1rem", marginTop: headerHeight }}>
        <Routes>
          {/* صفحات المستخدم */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />

          {/* صفحة تسجيل دخول الأدمن */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* صفحات الأدمن المحمية */}
          <Route path="/admin" element={<ProtectedRoute><AdminRootRedirect /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/sales" element={<ProtectedRoute><AdminSales /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/products/add" element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminEditProduct /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
