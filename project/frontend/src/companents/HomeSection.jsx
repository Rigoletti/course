import React from "react";
import "../style/HomeSection.css";

const HomeSection = () => {
  return (
    <div className="home-section dark-background">
      <div className="container">
        {/* Заголовок */}
        <h2 className="section-title">Популярные услуги</h2>
        {/* Карточки услуг */}
        <div className="card-grid">
          {/* Веб-разработка */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/FF6347/FFFFFF?text=Web)` }}
                >
                  <i className="fa fa-code" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#web-development" target="_blank">Веб-разработка</a>
                </h3>
                <p>Создание современных и адаптивных веб-сайтов и приложений.</p>
              </div>
            </div>
          </div>
          {/* Мобильная разработка */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/6495ED/FFFFFF?text=Mobile)` }}
                >
                  <i className="fa fa-mobile" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#mobile-development" target="_blank">Мобильная разработка</a>
                </h3>
                <p>Разработка мобильных приложений для iOS и Android.</p>
              </div>
            </div>
          </div>
          {/* Облачные решения */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/00CED1/FFFFFF?text=Cloud)` }}
                >
                  <i className="fa fa-cloud" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#cloud-solutions" target="_blank">Облачные решения</a>
                </h3>
                <p>Интеграция и управление облачными сервисами и инфраструктурой.</p>
              </div>
            </div>
          </div>
          {/* SEO-продвижение */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/FFD700/FFFFFF?text=SEO)` }}
                >
                  <i className="fa fa-line-chart" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#seo" target="_blank">SEO-продвижение</a>
                </h3>
                <p>Увеличение видимости вашего сайта в поисковых системах.</p>
              </div>
            </div>
          </div>
          {/* Цифровой маркетинг */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/EE82EE/FFFFFF?text=Marketing)` }}
                >
                  <i className="fa fa-bullhorn" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#digital-marketing" target="_blank">Цифровой маркетинг</a>
                </h3>
                <p>Привлечение целевой аудитории через онлайн-каналы.</p>
              </div>
            </div>
          </div>
          {/* Кибербезопасность */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/FF69B4/FFFFFF?text=Security)` }}
                >
                  <i className="fa fa-shield" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#cybersecurity" target="_blank">Кибербезопасность</a>
                </h3>
                <p>Защита ваших данных от кибератак и угроз.</p>
              </div>
            </div>
          </div>
          {/* Аналитика данных */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/00BFFF/FFFFFF?text=Data)` }}
                >
                  <i className="fa fa-bar-chart" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#data-analytics" target="_blank">Аналитика данных</a>
                </h3>
                <p>Превращение данных в осмысленные решения для бизнеса.</p>
              </div>
            </div>
          </div>
          {/* Консалтинг */}
          <div className="card">
            <div className="face face1">
              <div className="content">
                <div 
                  className="icon" 
                  style={{ backgroundImage: `url(https://via.placeholder.com/150/32CD32/FFFFFF?text=Consulting)` }}
                >
                  <i className="fa fa-lightbulb-o" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <a href="#consulting" target="_blank">Бизнес-консалтинг</a>
                </h3>
                <p>Стратегические решения для роста вашего бизнеса.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;