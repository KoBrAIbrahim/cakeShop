import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [isVisible, setIsVisible] = useState(false);

    const categories = ["الكل", "كيك", "تشيز كيك", "حلويات صغيرة", "حلويات صحية"];

    useEffect(() => {
        // Simulate loading
       const fetchData = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
    setFilteredProducts(items);
    setLoading(false);
    setIsVisible(true);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
fetchData();


        // No cleanup needed here since no timer is set
    }, []);

    useEffect(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== "الكل") {
            filtered = filtered.filter(product => product.type === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort products
        filtered.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return 0;
        });

        setFilteredProducts(filtered);
    }, [products, selectedCategory, searchTerm, sortBy]);

    const LoadingCard = () => (
        <div style={{
            background: '#F2F2F2',
            borderRadius: '25px',
            padding: '1.5rem',
            border: '2px solid #EAE4D5',
            animation: 'pulse 1.5s ease-in-out infinite'
        }}>
            <div style={{
                width: '100%',
                height: '200px',
                background: '#EAE4D5',
                borderRadius: '15px',
                marginBottom: '1rem'
            }}></div>
            <div style={{
                width: '70%',
                height: '20px',
                background: '#EAE4D5',
                borderRadius: '10px',
                marginBottom: '0.5rem'
            }}></div>
            <div style={{
                width: '40%',
                height: '16px',
                background: '#B6B09F',
                borderRadius: '8px'
            }}></div>
        </div>
    );

    const ProductCard = ({ product, index }) => {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const navigate = useNavigate();

        return (
            <div
                style={{
                      width: "100%",
    maxWidth: "320px", // ✅ تحديد أقصى عرض للكرت
    background: '#F2F2F2',
    borderRadius: '25px',
    padding: '1.5rem',
    border: isHovered ? '2px solid #B6B09F' : '2px solid #EAE4D5',
    boxShadow: isHovered ? '0 30px 60px rgba(182,176,159,0.3)' : '0 20px 40px rgba(182,176,159,0.1)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
    margin: '0 auto' // ✅ لتوسيط الكرت داخل الشبكة
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* New Badge */}
                {product.isNew && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: '#B6B09F',
                        color: '#F2F2F2',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        zIndex: 2
                    }}>
                        جديد
                    </div>
                )}

                {/* Image Container */}
                <div style={{
                    position: 'relative',
                    marginBottom: '1.5rem',
                    borderRadius: '15px',
                    overflow: 'hidden'
                }}>
                    {!imageLoaded && (
                        <div style={{
                            width: '100%',
                            height: '200px',
                            background: '#EAE4D5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '15px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                border: '4px solid #B6B09F',
                                borderTop: '4px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                    )}
                    <img
                        src={product.images && product.images[0]}
                        alt={product.name}
                        style={{
                             maxWidth: "320px",
                            width: "100%",
                            borderRadius: "15px",
                            height: "200px",
                            objectFit: "cover",
                            display: imageLoaded ? 'block' : 'none',
                            transition: 'transform 0.5s ease'
                        }}
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Overlay on hover */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(182,176,159,0.8)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '15px'
                    }}>
 <button
  onClick={() => navigate(`/products/${product.id}`)}
  style={{
    background: '#F2F2F2',
    color: '#000000',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    fontWeight: '700',
    cursor: 'pointer',
    transform: isHovered ? 'scale(1)' : 'scale(0.8)',
    transition: 'transform 0.3s ease'
  }}
>
  عرض التفاصيل
</button>

                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h3 style={{
                        margin: "0 0 1rem 0",
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        color: '#000000',
                        lineHeight: '1.4'
                    }}>
                        {product.name}
                    </h3>

                    <p style={{
                        margin: "0 0 1rem 0",
                        fontSize: '0.9rem',
                        color: '#000000',
                        opacity: 0.7,
                        lineHeight: '1.5'
                    }}>
                        {product.description}
                    </p>

                    <div style={{
                    fontWeight: "900",
                    fontSize: '1.4rem',
                    color: "#000000"
                }}>
                    {product.price} ₪
                </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            background: '#EAE4D5',
            minHeight: '100vh',
            padding: "2rem"
        }}>
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto"
            }}>
                {/* Header */}
                <div style={{
                    textAlign: "center",
                    marginBottom: "4rem"
                }}>
                    <div style={{
                        background: '#B6B09F',
                        padding: '1rem 2.5rem',
                        borderRadius: '50px',
                        display: 'inline-block',
                        marginBottom: '1.5rem',
                        color: '#F2F2F2',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                    }}>
                        تسوق الآن
                    </div>
                    <h1 style={{
                        fontSize: "3.5rem",
                        fontWeight: "900",
                        color: "#000000",
                        margin: "0 0 1rem 0"
                    }}>
                        المنتجات المتوفرة
                    </h1>
                    <p style={{
                        fontSize: "1.2rem",
                        color: "#000000",
                        opacity: 0.8,
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        اكتشف مجموعتنا المميزة من أجود الكيكات والحلويات المصنوعة بعناية فائقة
                    </p>
                </div>

                {/* Filters and Search */}
                <div style={{
                    background: '#F2F2F2',
                    padding: '2rem',
                    borderRadius: '25px',
                    marginBottom: '3rem',
                    border: '2px solid #EAE4D5'
                }}>
                    {/* Search Bar */}
                    <div style={{
                        marginBottom: '2rem'
                    }}>
                        <input
                            type="text"
                            placeholder="ابحث عن منتجك المفضل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '90%',
                                padding: '1rem 1.5rem',
                                borderRadius: '20px',
                                border: '2px solid #EAE4D5',
                                background: '#F2F2F2',
                                fontSize: '1.1rem',
                                color: '#000000',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#B6B09F'}
                            onBlur={(e) => e.target.style.borderColor = '#EAE4D5'}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        alignItems: 'center'
                    }}>
                        {/* Category Filter */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                color: '#000000'
                            }}>
                                الفئة:
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '15px',
                                    border: '2px solid #EAE4D5',
                                    background: '#F2F2F2',
                                    color: '#000000',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '700',
                                color: '#000000'
                            }}>
                                ترتيب حسب:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '15px',
                                    border: '2px solid #EAE4D5',
                                    background: '#F2F2F2',
                                    color: '#000000',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="name">الاسم</option>
                                <option value="price-low">السعر: من الأقل للأعلى</option>
                                <option value="price-high">السعر: من الأعلى للأقل</option>
                                <option value="rating">التقييم</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div style={{
                            textAlign: 'center',
                            background: '#B6B09F',
                            color: '#F2F2F2',
                            padding: '1rem',
                            borderRadius: '15px',
                            fontWeight: '700'
                        }}>
                            {filteredProducts.length} منتج متوفر
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "2.5rem"
                }}>
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 6 }).map((_, index) => (
                            <LoadingCard key={index} />
                        ))
                    ) : filteredProducts.length > 0 ? (
                        // Products
                        filteredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))
                    ) : (
                        // No products found
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '4rem',
                            background: '#F2F2F2',
                            borderRadius: '25px',
                            border: '2px solid #EAE4D5'
                        }}>
                            <div style={{
                                fontSize: '4rem',
                                marginBottom: '1rem',
                                opacity: 0.5
                            }}>🔍</div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                color: '#000000',
                                marginBottom: '0.5rem'
                            }}>
                                لم نجد أي منتجات
                            </h3>
                            <p style={{
                                color: '#000000',
                                opacity: 0.7
                            }}>
                                جرب تغيير معايير البحث أو الفلترة
                            </p>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {!loading && filteredProducts.length > 0 && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '4rem'
                    }}>
                        <button style={{
                            background: '#B6B09F',
                            color: '#F2F2F2',
                            border: 'none',
                            padding: '1.2rem 3rem',
                            fontSize: '1.2rem',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: '800',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 25px rgba(182,176,159,0.3)'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                                e.target.style.boxShadow = '0 15px 35px rgba(182,176,159,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 10px 25px rgba(182,176,159,0.3)';
                            }}
                        >
                            عرض المزيد من المنتجات
                        </button>
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 60px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          div[style*="fontSize: '3.5rem'"] {
            font-size: 2.5rem !important;
          }
          
          div[style*="gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'"] {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          
          div[style*="gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'"] {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          div[style*="padding: '2rem'"] {
            padding: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="minWidth: '320px'"] {
            min-width: 280px !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Products;