import { useState, useEffect } from "react";

const Home = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);




  const statsData = [
    { number: 300, label: "عميل مميز" },
    { number: 50, label: "كيكة فاخرة" },
    { number: 5, label: "سنوات إبداع" },
    { number: 99, label: "رضا العملاء %" }
  ];

  const featuresData = [
    {
      title: "عن المتجر",
      description: "متجر دانا للكيك هو متجر حلويات أونلاين متخصص في صنع أجود أنواع الكيك والحلويات بمكونات طبيعية وبلمسة منزلية مميزة.",
      bgColor: "#EAE4D5",
      accentColor: "#B6B09F"
    },
    {
      title: "خدمات التوصيل",
      description: "نوفر خدمة التوصيل السريع داخل بيرزيت والمناطق المجاورة. يمكن الطلب مباشرة عبر الموقع أو من خلال صفحتنا على فيسبوك.",
      bgColor: "#B6B09F",
      accentColor: "#EAE4D5"
    },
    {
      title: "مناسباتكم علينا!",
      description: "نغطي كافة المناسبات: الأعراس، أعياد الميلاد، حفلات التخرج، وأيضاً المناسبات الصغيرة والعائلية. اطلب تصميم خاص بك!",
      bgColor: "#F2F2F2",
      accentColor: "#B6B09F"
    },
    {
      title: "الموقع",
      description: "موقعنا في بيرزيت – فلسطين. يمكن التوصيل للمنازل أو الاستلام من الموقع حسب رغبتك.",
      bgColor: "#EAE4D5",
      accentColor: "#F2F2F2"
    },
    {
      title: "حلويات متنوعة",
      description: "نقدم تشكيلة واسعة من الكيكات والحلويات: حلويات كلاسيكية ومميزة، حلويات صحية وخالية من السكر، حلويات مناسبة للرياضيين وأصحاب الدايت",
      bgColor: "#B6B09F",
      accentColor: "#F2F2F2"
    }
  ];

  const Counter = ({ targetNumber, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (statsVisible) {
        const timer = setInterval(() => {
          setCount(prev => {
            if (prev < targetNumber) {
              return prev + Math.ceil(targetNumber / 40);
            }
            return targetNumber;
          });
        }, 80);

        return () => clearInterval(timer);
      }
    }, [statsVisible, targetNumber]);

    return (
      <div className="counter-card">
        <div className="counter-number">
          {count}{label.includes('%') ? '%' : '+'}
        </div>
        <div className="counter-label">{label}</div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{responsiveStyles}</style>
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          {/* Geometric Background Elements */}
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
          <div className="bg-element bg-element-3"></div>

          <div className="hero-content">
            <div className="hero-badge">
              <span>الأناقة في كل تفصيل</span>
            </div>
            
            <h1 className="hero-title">
              متجر <span className="title-accent">دانا</span> للكيك
            </h1>
            <p className="hero-subtitle">
              الفخامة تلتقي بالطعم الأصيل في كل قضمة
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                اطلب الآن
              </button>
              <button className="btn-secondary">
                تعرف علينا
              </button>
            </div>
          </div>
        </section>

        <div className="container">
          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-bg-1"></div>
            <div className="stats-bg-2"></div>
            
            <h2 className="stats-title">
              إنجازات نعتز بها
            </h2>
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <Counter 
                  key={index}
                  targetNumber={stat.number}
                  label={stat.label}
                />
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="section-header">
              <div className="section-badge">
                خدماتنا المميزة
              </div>
              <h2 className="section-title">
                لماذا نحن الخيار الأمثل؟
              </h2>
            </div>

            <div className="features-grid">
              {featuresData.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-card ${activeCard === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div 
                    className="card-header-strip"
                    style={{ background: feature.bgColor }}
                  ></div>

                  <div className="card-content">
                    <div 
                      className="feature-title-container"
                      style={{ background: feature.bgColor }}
                    >
                      <h3 className="feature-title">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="feature-description">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div 
                    className="card-bottom-strip"
                    style={{ background: feature.bgColor }}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const responsiveStyles = `
  .home-container {
    background: #EAE4D5;
    min-height: 100vh;
    color: #000000;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    direction: rtl;
  }

  /* Hero Section */
  .hero-section {
    background: #B6B09F;
    color: #000000;
    padding: 6rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 4rem;
    clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
  }

  .bg-element {
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
  }

  .bg-element-1 {
    top: 15%;
    right: 8%;
    width: 120px;
    height: 120px;
    background: #EAE4D5;
    animation: float 6s ease-in-out infinite;
  }

  .bg-element-2 {
    bottom: 12%;
    left: 10%;
    width: 100px;
    height: 100px;
    background: #F2F2F2;
    border-radius: 25px;
    opacity: 0.5;
    animation: rotate 10s linear infinite;
  }

  .bg-element-3 {
    top: 30%;
    left: 15%;
    width: 80px;
    height: 80px;
    background: #EAE4D5;
    opacity: 0.4;
    animation: spin 15s linear infinite;
  }

  .hero-content {
    position: relative;
    z-index: 2;
  }

  .hero-badge {
    background: #EAE4D5;
    padding: 1.2rem 3rem;
    border-radius: 60px;
    display: inline-block;
    margin-bottom: 2.5rem;
    border: 2px solid #F2F2F2;
    animation: fadeInDown 1.2s ease-out;
  }

  .hero-badge span {
    font-size: 1.3rem;
    font-weight: 700;
    color: #000000;
  }

  .hero-title {
    font-size: 4.5rem;
    margin-bottom: 2rem;
    font-weight: 900;
    animation: slideInUp 1.2s ease-out 0.3s both;
    line-height: 1.1;
    color: #000000;
  }

  .title-accent {
    color: #EAE4D5;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 3.5rem;
    max-width: 750px;
    margin: 0 auto 3.5rem auto;
    font-weight: 600;
    color: #000000;
    animation: slideInUp 1.2s ease-out 0.6s both;
  }

  .hero-buttons {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: slideInUp 1.2s ease-out 0.9s both;
  }

  .btn-primary {
    background: #EAE4D5;
    color: #000000;
    border: none;
    padding: 1.4rem 3.5rem;
    font-size: 1.3rem;
    border-radius: 70px;
    cursor: pointer;
    font-weight: 800;
    box-shadow: 0 15px 40px rgba(182,176,159,0.4);
    transition: all 0.5s ease;
  }

  .btn-primary:hover {
    transform: translateY(-6px) scale(1.05);
    box-shadow: 0 20px 50px rgba(182,176,159,0.6);
    background: #F2F2F2;
  }

  .btn-secondary {
    background: transparent;
    color: #000000;
    border: 3px solid #F2F2F2;
    padding: 1.4rem 3.5rem;
    font-size: 1.3rem;
    border-radius: 70px;
    cursor: pointer;
    font-weight: 800;
    transition: all 0.5s ease;
  }

  .btn-secondary:hover {
    background: #F2F2F2;
    color: #B6B09F;
    transform: translateY(-6px);
  }

  /* Stats Section */
  .stats-section {
    margin: 6rem 0;
    padding: 5rem 4rem;
    background: #B6B09F;
    border-radius: 40px;
    position: relative;
    overflow: hidden;
    border: 3px solid #EAE4D5;
  }

  .stats-bg-1 {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 250px;
    height: 250px;
    background: #F2F2F2;
    border-radius: 50%;
    opacity: 0.4;
  }

  .stats-bg-2 {
    position: absolute;
    bottom: -40px;
    left: -40px;
    width: 200px;
    height: 200px;
    background: #EAE4D5;
    border-radius: 50%;
    opacity: 0.5;
  }

  .stats-title {
    text-align: center;
    margin-bottom: 5rem;
    font-size: 3.5rem;
    font-weight: 900;
    color: #000000;
    position: relative;
    z-index: 2;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 3rem;
    position: relative;
    z-index: 2;
  }

  .counter-card {
    text-align: center;
    padding: 2.5rem;
    background: #F2F2F2;
    border-radius: 25px;
    border: 2px solid #EAE4D5;
    transition: all 0.4s ease;
    cursor: pointer;
  }

  .counter-card:hover {
    transform: translateY(-12px) scale(1.05);
    background: #EAE4D5;
    box-shadow: 0 20px 50px rgba(182,176,159,0.3);
  }

  .counter-number {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 1rem;
    color: #B6B09F;
  }

  .counter-label {
    font-size: 1.3rem;
    font-weight: 700;
    color: #000000;
  }

  /* Features Section */
  .features-section {
    margin: 6rem 0;
  }

  .section-header {
    text-align: center;
    margin-bottom: 5rem;
  }

  .section-badge {
    background: #B6B09F;
    padding: 1rem 3rem;
    border-radius: 60px;
    display: inline-block;
    margin-bottom: 2rem;
    color: #000000;
    font-weight: 700;
    font-size: 1.2rem;
    box-shadow: 0 10px 30px rgba(182,176,159,0.3);
  }

  .section-title {
    color: #8B8680;
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 4rem;
  }

  .feature-card {
    background: #F2F2F2;
    color: #000000;
    border-radius: 30px;
    padding: 3rem;
    margin: 2.5rem 0;
    box-shadow: 0 25px 60px rgba(182,176,159,0.2);
    text-align: right;
    line-height: 1.9;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    border: 2px solid #EAE4D5;
  }

  .feature-card.active {
    background: #EAE4D5;
    transform: translateY(-20px) scale(1.03);
    box-shadow: 0 40px 80px rgba(182,176,159,0.35);
    border-color: #B6B09F;
  }

  .card-header-strip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
  }

  .card-content {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .feature-title-container {
    display: inline-block;
    padding: 1rem 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    box-shadow: 0 10px 25px rgba(182,176,159,0.2);
    transition: all 0.4s ease;
  }

  .feature-card.active .feature-title-container {
    transform: scale(1.05);
  }

  .feature-title {
    margin: 0;
    font-size: 1.8rem;
    color: #000000;
    font-weight: 800;
  }

  .feature-description {
    margin: 0;
    font-size: 1.3rem;
    line-height: 1.9;
    color: #000000;
  }

  .card-bottom-strip {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    opacity: 0.6;
    transition: opacity 0.4s ease;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }

  .feature-card.active .card-bottom-strip {
    opacity: 1;
  }

  /* Animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-25px) scale(1.1); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  /* Responsive Design */

  /* Large Tablets and Small Desktops (768px - 1024px) */
  @media (max-width: 1024px) {
    .container {
      padding: 0 2rem;
    }

    .hero-title {
      font-size: 3.8rem;
    }

    .hero-subtitle {
      font-size: 1.3rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .stats-section {
      padding: 4rem 3rem;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
  }

  /* Tablets (768px) */
  @media (max-width: 768px) {
    .hero-section {
      padding: 4rem 1.5rem;
      clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%);
    }

    .hero-title {
      font-size: 3rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 2.5rem;
    }

    .hero-badge span {
      font-size: 1.1rem;
    }

    .hero-buttons {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 1.2rem 3rem;
      font-size: 1.2rem;
      width: 100%;
      max-width: 300px;
    }

    .stats-section {
      margin: 4rem 0;
      padding: 3rem 2rem;
    }

    .stats-title {
      font-size: 2.8rem;
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2.8rem;
    }

    .counter-card {
      padding: 2rem;
    }

    .counter-number {
      font-size: 3rem;
    }

    .counter-label {
      font-size: 1.2rem;
    }

    .feature-card {
      padding: 2rem;
      margin: 1.5rem 0;
    }

    .feature-title {
      font-size: 1.6rem;
    }

    .feature-description {
      font-size: 1.2rem;
    }

    .bg-element-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      right: 5%;
    }

    .bg-element-2 {
      width: 70px;
      height: 70px;
      bottom: 8%;
      left: 5%;
    }

    .bg-element-3 {
      width: 60px;
      height: 60px;
      top: 25%;
      left: 10%;
    }
  }

  /* Mobile Large (480px) */
  @media (max-width: 480px) {
    .container {
      padding: 0 1rem;
    }

    .hero-section {
      padding: 3rem 1rem;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .hero-badge {
      padding: 1rem 2rem;
      margin-bottom: 2rem;
    }

    .hero-badge span {
      font-size: 1rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 50px;
    }

    .stats-section {
      margin: 3rem 0;
      padding: 2rem 1rem;
      border-radius: 25px;
    }

    .stats-title {
      font-size: 2.2rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .counter-card {
      padding: 1.5rem;
    }

    .counter-number {
      font-size: 2.5rem;
    }

    .counter-label {
      font-size: 1.1rem;
    }

    .section-header {
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2.2rem;
    }

    .section-badge {
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
    }

    .features-grid {
      gap: 2rem;
    }

    .feature-card {
      padding: 1.5rem;
      margin: 1rem 0;
      border-radius: 20px;
    }

    .feature-title-container {
      padding: 0.8rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .feature-title {
      font-size: 1.4rem;
    }

    .feature-description {
      font-size: 1.1rem;
      line-height: 1.7;
    }

    .stats-bg-1 {
      width: 150px;
      height: 150px;
      top: -30px;
      right: -30px;
    }

    .stats-bg-2 {
      width: 120px;
      height: 120px;
      bottom: -20px;
      left: -20px;
    }

    .bg-element-1,
    .bg-element-2,
    .bg-element-3 {
      display: none;
    }
  }

  /* Mobile Small (360px) */
  @media (max-width: 360px) {
    .hero-title {
      font-size: 2.2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .counter-card {
      padding: 1.2rem;
    }

    .counter-number {
      font-size: 2.2rem;
    }

    .counter-label {
      font-size: 1rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .feature-card {
      padding: 1.2rem;
    }

    .feature-title {
      font-size: 1.3rem;
    }

    .feature-description {
      font-size: 1rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.9rem 1.8rem;
      font-size: 1rem;
    }
  }

  /* Extra Small Mobile (320px) */
  @media (max-width: 320px) {
    .hero-section {
      padding: 2.5rem 0.8rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .stats-section {
      padding: 1.5rem 0.8rem;
    }

    .feature-card {
      padding: 1rem;
    }

    .container {
      padding: 0 0.8rem;
    }
  }

  /* Landscape Mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    .hero-section {
      padding: 2rem 1rem;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      margin-bottom: 1.5rem;
    }

    .hero-buttons {
      gap: 1rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.8rem 2rem;
    }
  }
`;

export default Home;