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
    }, []);

    useEffect(() => {
        let filtered = products;

        if (selectedCategory !== "الكل") {
            filtered = filtered.filter(product => product.type === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

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
        <div className="loading-card">
            <div className="loading-image"></div>
            <div className="loading-title"></div>
            <div className="loading-price"></div>
        </div>
    );

    const ProductCard = ({ product, index }) => {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const navigate = useNavigate();

        return (
            <div
                className="product-card"
                style={{
                    border: isHovered ? '2px solid #B6B09F' : '2px solid #EAE4D5',
                    boxShadow: isHovered ? '0 30px 60px rgba(182,176,159,0.3)' : '0 20px 40px rgba(182,176,159,0.1)',
                    transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                    opacity: isVisible ? 1 : 0,
                    animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* New Badge */}
                {product.isNew && (
                    <div className="new-badge">
                        جديد
                    </div>
                )}

                {/* Image Container */}
                <div className="image-container">
                    {!imageLoaded && (
                        <div className="image-placeholder">
                            <div className="spinner"></div>
                        </div>
                    )}
                    <img
                        src={product.images && product.images[0]}
                        alt={product.name}
                        className="product-image"
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Overlay on hover */}
                    <div 
                        className="image-overlay"
                        style={{ opacity: isHovered ? 1 : 0 }}
                    >
                        <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="details-button"
                            style={{
                                transform: isHovered ? 'scale(1)' : 'scale(0.8)'
                            }}
                        >
                            عرض التفاصيل
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h3 className="product-title">
                        {product.name}
                    </h3>

                    <p className="product-description">
                        {product.description}
                    </p>

                    <div className="product-price">
                        {product.price} ₪
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="products-page">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <div className="shop-badge">
                        تسوق الآن
                    </div>
                    <h1 className="main-title">
                        المنتجات المتوفرة
                    </h1>
                    <p className="main-description">
                        اكتشف مجموعتنا المميزة من أجود الكيكات والحلويات المصنوعة بعناية فائقة
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    {/* Search Bar */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="ابحث عن منتجك المفضل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filters-grid">
                        {/* Category Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                الفئة:
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                ترتيب حسب:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="name">الاسم</option>
                                <option value="price-low">السعر: من الأقل للأعلى</option>
                                <option value="price-high">السعر: من الأعلى للأقل</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="results-count">
                            {filteredProducts.length} منتج متوفر
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="products-grid">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <LoadingCard key={index} />
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))
                    ) : (
                        <div className="no-products">
                            <div className="no-products-icon">🔍</div>
                            <h3 className="no-products-title">
                                لم نجد أي منتجات
                            </h3>
                            <p className="no-products-text">
                                جرب تغيير معايير البحث أو الفلترة
                            </p>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="load-more-container">
                        <button className="load-more-button">
                            عرض المزيد من المنتجات
                        </button>
                    </div>
                )}
            </div>

            {/* Styles */}
            <style jsx>{`
                .products-page {
                    background: #EAE4D5;
                    min-height: 100vh;
                    padding: 1rem;
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                /* Header Styles */
                .header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .shop-badge {
                    background: #B6B09F;
                    padding: 0.8rem 2rem;
                    border-radius: 50px;
                    display: inline-block;
                    margin-bottom: 1.5rem;
                    color: #F2F2F2;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .main-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #000000;
                    margin: 0 0 1rem 0;
                    line-height: 1.2;
                }

                .main-description {
                    font-size: 1.1rem;
                    color: #000000;
                    opacity: 0.8;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Filters Section */
                .filters-section {
                    background: #F2F2F2;
                    padding: 1.5rem;
                    border-radius: 25px;
                    margin-bottom: 2.5rem;
                    border: 2px solid #EAE4D5;
                }

                .search-container {
                    margin-bottom: 1.5rem;
                }

                .search-input {
                    width: 100%;
                    max-width: 500px;
                    padding: 1rem 1.5rem;
                    border-radius: 20px;
                    border: 2px solid #EAE4D5;
                    background: #F2F2F2;
                    font-size: 1rem;
                    color: #000000;
                    outline: none;
                    transition: border-color 0.3s ease;
                    box-sizing: border-box;
                }

                .search-input:focus {
                    border-color: #B6B09F;
                }

                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    align-items: end;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                }

                .filter-label {
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    color: #000000;
                    font-size: 0.9rem;
                }

                .filter-select {
                    padding: 0.8rem;
                    border-radius: 15px;
                    border: 2px solid #EAE4D5;
                    background: #F2F2F2;
                    color: #000000;
                    font-size: 0.9rem;
                    cursor: pointer;
                    outline: none;
                }

                .results-count {
                    text-align: center;
                    background: #B6B09F;
                    color: #F2F2F2;
                    padding: 1rem;
                    border-radius: 15px;
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                /* Products Grid */
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                /* Product Card */
                .product-card {
                    background: #F2F2F2;
                    border-radius: 25px;
                    padding: 1.5rem;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    animation: slideInUp 0.6s ease-out both;
                    height: fit-content;
                }

                .new-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #B6B09F;
                    color: #F2F2F2;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    z-index: 2;
                }

                .image-container {
                    position: relative;
                    margin-bottom: 1.5rem;
                    border-radius: 15px;
                    overflow: hidden;
                    aspect-ratio: 1.4;
                }

                .image-placeholder {
                    width: 100%;
                    height: 100%;
                    background: #EAE4D5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #B6B09F;
                    border-top: 4px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 15px;
                    transition: transform 0.5s ease;
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(182,176,159,0.8);
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                }

                .details-button {
                    background: #F2F2F2;
                    color: #000000;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 25px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    font-size: 0.9rem;
                }

                .product-info {
                    display: flex;
                    flex-direction: column;
                }

                .product-title {
                    margin: 0 0 1rem 0;
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: #000000;
                    line-height: 1.4;
                }

                .product-description {
                    margin: 0 0 1rem 0;
                    font-size: 0.9rem;
                    color: #000000;
                    opacity: 0.7;
                    line-height: 1.5;
                    flex-grow: 1;
                }

                .product-price {
                    font-weight: 900;
                    font-size: 1.3rem;
                    color: #000000;
                    margin-top: auto;
                }

                /* Loading Card */
                .loading-card {
                    background: #F2F2F2;
                    border-radius: 25px;
                    padding: 1.5rem;
                    border: 2px solid #EAE4D5;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                .loading-image {
                    width: 100%;
                    aspect-ratio: 1.4;
                    background: #EAE4D5;
                    border-radius: 15px;
                    margin-bottom: 1.5rem;
                }

                .loading-title {
                    width: 70%;
                    height: 20px;
                    background: #EAE4D5;
                    border-radius: 10px;
                    margin-bottom: 0.5rem;
                }

                .loading-price {
                    width: 40%;
                    height: 16px;
                    background: #B6B09F;
                    border-radius: 8px;
                }

                /* No Products */
                .no-products {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 3rem 2rem;
                    background: #F2F2F2;
                    border-radius: 25px;
                    border: 2px solid #EAE4D5;
                }

                .no-products-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .no-products-title {
                    font-size: 1.4rem;
                    color: #000000;
                    margin: 0 0 0.5rem 0;
                }

                .no-products-text {
                    color: #000000;
                    opacity: 0.7;
                    margin: 0;
                }

                /* Load More Button */
                .load-more-container {
                    text-align: center;
                    margin-top: 2rem;
                }

                .load-more-button {
                    background: #B6B09F;
                    color: #F2F2F2;
                    border: none;
                    padding: 1.2rem 3rem;
                    font-size: 1.1rem;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: 800;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 25px rgba(182,176,159,0.3);
                }

                .load-more-button:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 15px 35px rgba(182,176,159,0.4);
                }

                /* Animations */
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

                /* Large Desktop (1200px+) */
                @media (min-width: 1200px) {
                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 2.5rem;
                    }
                    
                    .main-title {
                        font-size: 3.5rem;
                    }
                    
                    .container {
                        padding: 0 2rem;
                    }
                    
                    .products-page {
                        padding: 2rem;
                    }
                }

                /* Desktop (992px - 1199px) */
                @media (min-width: 992px) and (max-width: 1199px) {
                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 2rem;
                    }
                    
                    .main-title {
                        font-size: 3rem;
                    }
                }

                /* Tablet (768px - 991px) */
                @media (min-width: 768px) and (max-width: 991px) {
                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 1.5rem;
                    }
                    
                    .main-title {
                        font-size: 2.5rem;
                    }
                    
                    .filters-grid {
                        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                        gap: 1rem;
                    }
                    
                    .shop-badge {
                        padding: 0.7rem 1.5rem;
                        font-size: 0.9rem;
                    }
                }

                /* Mobile Large (576px - 767px) */
                @media (min-width: 576px) and (max-width: 767px) {
                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                        gap: 1.5rem;
                    }
                    
                    .main-title {
                        font-size: 2.2rem;
                    }
                    
                    .filters-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .filters-section {
                        padding: 1.2rem;
                    }
                    
                    .container {
                        padding: 0 0.5rem;
                    }
                }

                /* Mobile (480px - 575px) */
                @media (min-width: 480px) and (max-width: 575px) {
                    .products-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    
                    .main-title {
                        font-size: 2rem;
                    }
                    
                    .main-description {
                        font-size: 1rem;
                    }
                    
                    .product-card {
                        padding: 1.2rem;
                    }
                    
                    .filters-section {
                        padding: 1rem;
                        border-radius: 20px;
                    }
                    
                    .search-input {
                        padding: 0.8rem 1.2rem;
                        font-size: 0.9rem;
                    }
                }

                /* Mobile Small (up to 479px) */
                @media (max-width: 479px) {
                    .products-page {
                        padding: 0.5rem;
                    }
                    
                    .container {
                        padding: 0;
                    }
                    
                    .products-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .main-title {
                        font-size: 1.8rem;
                        line-height: 1.3;
                    }
                    
                    .main-description {
                        font-size: 0.9rem;
                        padding: 0 1rem;
                    }
                    
                    .product-card {
                        padding: 1rem;
                        border-radius: 20px;
                    }
                    
                    .product-title {
                        font-size: 1.1rem;
                    }
                    
                    .product-price {
                        font-size: 1.2rem;
                    }
                    
                    .filters-section {
                        padding: 1rem;
                        border-radius: 15px;
                        margin-bottom: 2rem;
                    }
                    
                    .search-input {
                        padding: 0.8rem 1rem;
                        font-size: 0.9rem;
                        border-radius: 15px;
                    }
                    
                    .filter-select {
                        padding: 0.7rem;
                        font-size: 0.9rem;
                    }
                    
                    .results-count {
                        padding: 0.8rem;
                        font-size: 0.8rem;
                    }
                    
                    .shop-badge {
                        padding: 0.6rem 1.2rem;
                        font-size: 0.8rem;
                    }
                    
                    .load-more-button {
                        padding: 1rem 2rem;
                        font-size: 1rem;
                    }
                    
                    .details-button {
                        padding: 0.7rem 1.2rem;
                        font-size: 0.8rem;
                    }
                    
                    .header {
                        margin-bottom: 2rem;
                    }
                    
                    .no-products {
                        padding: 2rem 1rem;
                    }
                    
                    .no-products-icon {
                        font-size: 2.5rem;
                    }
                    
                    .no-products-title {
                        font-size: 1.2rem;
                    }
                }

                /* Ultra Small Devices (up to 360px) */
                @media (max-width: 360px) {
                    .main-title {
                        font-size: 1.6rem;
                    }
                    
                    .product-card {
                        padding: 0.8rem;
                    }
                    
                    .filters-section {
                        padding: 0.8rem;
                    }
                    
                    .search-input {
                        padding: 0.7rem;
                    }
                    
                    .load-more-button {
                        padding: 0.8rem 1.5rem;
                        font-size: 0.9rem;
                    }
                }

                /* High DPI Displays */
                @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                    .product-image {
                        image-rendering: -webkit-optimize-contrast;
                        image-rendering: optimize-contrast;
                    }
                }

                /* Landscape orientation for mobile */
                @media (max-width: 767px) and (orientation: landscape) {
                    .main-title {
                        font-size: 2rem;
                    }
                    
                    .header {
                        margin-bottom: 2rem;
                    }
                    
                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default Products;