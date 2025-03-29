import React from "react";
import "../../assets/style/home/HomeSection.css";
import { Link } from "react-router-dom"; 

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
                  style={{ backgroundImage: `url(https://habrastorage.org/files/a6e/c1a/94e/a6ec1a94efda4f43a8798360835a71b4.jpg)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/category/web-development">Веб-разработка</Link> 
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
                  style={{ backgroundImage: `url(https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_65992d9339c6e24c8b83d409_65993605c767be610de8e11a/scale_1200)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/mobile-development">Мобильная разработка</Link>
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
                  style={{ backgroundImage: `url(https://avatars.mds.yandex.net/i?id=00103a8fd78871ddb7aef12bd0cc553c_l-10754985-images-thumbs&n=13)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/cloud-solutions">Облачные решения</Link> 
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
                  style={{ backgroundImage: `url(https://avatars.mds.yandex.net/i?id=8a821fe7e4c3f88e10977dcd444e5e38_l-5220668-images-thumbs&n=13)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/seo">SEO-продвижение</Link>
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
                  style={{ backgroundImage: `url(https://avatars.mds.yandex.net/i?id=8537022540809bc8ad32f603131926f7_l-9193117-images-thumbs&n=13)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/digital-marketing">Цифровой маркетинг</Link> 
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
                  style={{ backgroundImage: `url(https://avatars.mds.yandex.net/i?id=5d1d3ec9b864abe0600f83710b47ee92ab8795e6-10782253-images-thumbs&n=13)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/cybersecurity">Кибербезопасность</Link> 
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
                  style={{ backgroundImage: `url(https://avatars.mds.yandex.net/i?id=4bc6e50f125d799041755bc4edf17d22_l-5281542-images-thumbs&n=13)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/data-analytics">Аналитика данных</Link>
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
                  style={{ backgroundImage: `url(https://avatars.mds.yandex.net/i?id=7c6a29aaec69b21add93ab44c2c2ad5a_l-12536664-images-thumbs&n=13)` }}
                >
                </div>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <h3>
                  <Link to="/consulting">Бизнес-консалтинг</Link> 
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