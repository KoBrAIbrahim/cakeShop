import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/admin/dashboard');
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
const handleLogout = () => {
  localStorage.removeItem("admin");  // حذف بيانات تسجيل الدخول
  navigate("/admin/login");          // توجيه لصفحة تسجيل الدخول
};


  const toggleSidebar = () => {
    setOpen(!open);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && open) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const navigationItems = [
    { path: "/admin/dashboard", label: "لوحة التحكم", icon: "📊" },
    { path: "/admin/orders", label: "الطلبات", icon: "📦" },
    { path: "/admin/products", label: "المنتجات", icon: "🧁" },
    { path: "/admin/sales", label: "المبيعات", icon: "💰" },
  ];

  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
    closeSidebar();
  };

  return (
    <div>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, #3498DB, #2980B9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
          }}>
            🛠️
          </div>

          <h1 style={{ 
            margin: 0, 
            fontSize: '1.8rem',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #ECF0F1, #BDC3C7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            إدارة المتجر
          </h1>
        </div>
        
        <button
          ref={buttonRef}
          onClick={toggleSidebar}
          style={{
            fontSize: '1.5rem',
            background: open ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: '2px solid transparent',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: '#FFFFFF',
            transition: 'all 0.3s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            backdropFilter: open ? 'blur(10px)' : 'none'
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease-out',
            backdropFilter: 'blur(2px)'
          }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        style={{
          position: 'fixed',
          top: 0,
          right: open ? '0' : '-300px',
          height: '100%',
          width: '280px',
          background: 'linear-gradient(180deg, #34495E 0%, #2C3E50 100%)',
          padding: '2rem 0',
          boxShadow: open ? '-5px 0 25px rgba(0,0,0,0.3)' : 'none',
          zIndex: 1100,
          transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          direction: 'rtl',
          borderLeft: '3px solid #3498DB'
        }}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '0 2rem 2rem 2rem',
          borderBottom: '2px solid rgba(255,255,255,0.2)',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🛠️</span>
            <h2 style={{
              margin: 0,
              fontSize: '1.2rem',
              color: '#FFFFFF',
              fontWeight: '600'
            }}>
              لوحة الإدارة
            </h2>
          </div>
        </div>

        {/* Navigation Links */}
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navigationItems.map((item, index) => (
            <li key={item.path} style={{
              margin: '0 1rem',
              animation: open ? `slideInRight 0.3s ease-out ${index * 0.1}s both` : 'none'
            }}>
              <a
                onClick={() => handleLinkClick(item.path)}
                style={{
                    cursor: 'pointer',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  backgroundColor: activeLink === item.path 
                    ? 'rgba(52, 152, 219, 0.3)' 
                    : 'transparent',
                  transform: 'translateX(0)',
                  border: activeLink === item.path 
                    ? '2px solid rgba(52, 152, 219, 0.5)' 
                    : '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeLink !== item.path) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateX(-5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLink !== item.path) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={{ 
                  fontSize: '1.3rem',
                  minWidth: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {activeLink === item.path && (
                  <div style={{
                    marginRight: 'auto',
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#3498DB',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div style={{
          margin: '2rem 1rem 0 1rem',
          animation: open ? `slideInRight 0.3s ease-out ${navigationItems.length * 0.1}s both` : 'none'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              color: '#FFFFFF',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backgroundColor: '#E74C3C',
              border: '2px solid transparent',
              cursor: 'pointer',
              transform: 'translateX(0)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#C0392B';
              e.target.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#E74C3C';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ 
              fontSize: '1.3rem',
              minWidth: '1.5rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              🚪
            </span>
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          right: '2rem',
          textAlign: 'center',
          padding: '1rem',
          borderTop: '2px solid rgba(255,255,255,0.2)',
          color: '#BDC3C7',
          fontSize: '0.9rem',
          opacity: '0.8'
        }}>
          <p style={{ margin: 0 }}>🛠️ إدارة متجر الكيك</p>
        </div>
      </nav>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          header {
            padding: 1rem !important;
          }

          header h1 {
            font-size: 1.4rem !important;
          }

          nav {
            width: 60% !important;
            right: ${open ? '0' : '-60%'} !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminNavbar;