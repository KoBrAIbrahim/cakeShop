import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

    if (isLoggedIn) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  return null; // لا حاجة لعرض شيء، فقط إعادة توجيه
};

export default AdminRootRedirect;
