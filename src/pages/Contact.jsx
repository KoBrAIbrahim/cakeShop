const Contact = () => {
  return (
    <>
      <style>{advancedContactStyles}</style>
      <div className="contact-container">
        <div className="contact-content">
          {/* Header Section */}
          <div className="contact-header">
            <div className="header-icon">🧁</div>
            <h1 className="main-title">Dana's Cake Shop</h1>
            <p className="subtitle">أجمل الكيكات والحلويات المصنوعة بحب</p>
            <div className="decorative-line"></div>
          </div>

          {/* Contact Cards */}
          <div className="contact-cards">
            {/* Location Card */}
            <div className="contact-card location-card">
              <div className="card-icon">📍</div>
              <div className="card-content">
                <h3>موقعنا</h3>
                <p>رام الله، بيرزيت</p>
                <span className="card-subtitle">نحن في خدمتكم</span>
              </div>
            </div>

            {/* Phone Card */}
            <div className="contact-card phone-card">
              <div className="card-icon">📞</div>
              <div className="card-content">
                <h3>اتصل بنا</h3>
                <a href="tel:+972595297715" className="phone-link">
                  +972 59-529-7715
                </a>
                <span className="card-subtitle">متاح 24/7</span>
              </div>
            </div>

            {/* Facebook Card */}
            <div className="contact-card facebook-card">
              <div className="card-icon">💬</div>
              <div className="card-content">
                <h3>تابعنا على فيسبوك</h3>
                <a
                  href="https://www.facebook.com/profile.php?id=100057469577702"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="facebook-link"
                >
                  Dana's Cake Shop
                </a>
                <span className="card-subtitle">آخر الأخبار والعروض</span>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="info-section">
            <div className="info-card">
              <h3>أوقات العمل</h3>
              <div className="working-hours">
                <div className="hour-item">
                  <span className="day">السبت - الخميس</span>
                  <span className="time">10:00 ص - 7:00 م</span>
                </div>
                <div className="hour-item">
                  <span className="day">الطلب قبل بيوم على الاقل</span>
                  
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>خدماتنا</h3>
              <div className="services">
                <div className="service-item">🎂 كيكات مخصصة</div>
                <div className="service-item">🧁 كب كيك</div>
                <div className="service-item">🍰 حلويات شرقية</div>
                <div className="service-item">🧁حلويات صغيرة</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <h3>جاهز لطلب كيكتك المثالية؟</h3>
            <p>تواصل معنا الآن واحصل على أفضل العروض</p>
            <div className="cta-buttons">
              <a href="tel:+972595297715" className="cta-btn primary">
                📞 اتصل الآن
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100057469577702"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn secondary"
              >
                💬 راسلنا على فيسبوك
              </a>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="floating-elements">
            <div className="floating-cake">🎂</div>
            <div className="floating-cupcake">🧁</div>
            <div className="floating-star">⭐</div>
          </div>
        </div>
      </div>
    </>
  );
};

const advancedContactStyles = `
  * {
    box-sizing: border-box;
  }

  .contact-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 2rem 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
    position: relative;
    overflow: hidden;
  }

  .contact-content {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .contact-header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
  }

  .header-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    80% { transform: translateY(-10px); }
  }

  .main-title {
    font-size: 3rem;
    font-weight: 700;
    color: #B6B09F;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(182, 176, 159, 0.3);
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .decorative-line {
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #B6B09F 0%, #A09B89 100%);
    margin: 0 auto;
    border-radius: 2px;
  }

  .contact-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .contact-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border-top: 5px solid #B6B09F;
    position: relative;
    overflow: hidden;
  }

  .contact-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #B6B09F 0%, #A09B89 100%);
  }

  .contact-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(182, 176, 159, 0.2);
  }

  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .card-content h3 {
    color: #B6B09F;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .card-content p {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .card-subtitle {
    color: #888;
    font-size: 0.9rem;
    font-style: italic;
  }

  .phone-link {
    color: #B6B09F;
    text-decoration: none;
    font-size: 1.3rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: block;
    margin-bottom: 0.5rem;
  }

  .phone-link:hover {
    color: #A09B89;
    transform: scale(1.05);
  }

  .facebook-link {
    color: #B6B09F;
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: block;
    margin-bottom: 0.5rem;
  }

  .facebook-link:hover {
    color: #A09B89;
    transform: scale(1.02);
  }

  .info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .info-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    border-left: 5px solid #B6B09F;
  }

  .info-card h3 {
    color: #B6B09F;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .working-hours {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .hour-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    background: #f8f9fa;
    border-radius: 10px;
    border-right: 3px solid #B6B09F;
  }

  .day {
    font-weight: 600;
    color: #333;
  }

  .time {
    color: #B6B09F;
    font-weight: 500;
  }

  .services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .service-item {
    background: linear-gradient(135deg, #B6B09F 0%, #A09B89 100%);
    color: white;
    padding: 1rem;
    border-radius: 15px;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .service-item:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(182, 176, 159, 0.3);
  }

  .cta-section {
    background: white;
    border-radius: 25px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    border: 2px solid #B6B09F;
    margin-bottom: 2rem;
  }

  .cta-section h3 {
    color: #B6B09F;
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .cta-section p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-btn {
    padding: 1rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cta-btn.primary {
    background: linear-gradient(135deg, #B6B09F 0%, #A09B89 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(182, 176, 159, 0.3);
  }

  .cta-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(182, 176, 159, 0.4);
  }

  .cta-btn.secondary {
    background: white;
    color: #B6B09F;
    border: 2px solid #B6B09F;
  }

  .cta-btn.secondary:hover {
    background: #B6B09F;
    color: white;
    transform: translateY(-3px);
  }

  .floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
  }

  .floating-cake,
  .floating-cupcake,
  .floating-star {
    position: absolute;
    font-size: 2rem;
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;
  }

  .floating-cake {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .floating-cupcake {
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  .floating-star {
    top: 40%;
    left: 80%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .contact-container {
      padding: 1rem 0.5rem;
    }

    .main-title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .contact-cards {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .contact-card {
      padding: 1.5rem;
    }

    .info-section {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .cta-section {
      padding: 2rem 1rem;
    }

    .cta-section h3 {
      font-size: 1.5rem;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .cta-btn {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }

    .services {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .main-title {
      font-size: 1.8rem;
    }

    .contact-card {
      padding: 1rem;
    }

    .info-card {
      padding: 1.5rem;
    }

    .services {
      grid-template-columns: 1fr;
    }

    .hour-item {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
`;

export default Contact;