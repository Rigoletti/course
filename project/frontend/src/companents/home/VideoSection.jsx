import React from 'react';
import { Link } from 'react-router-dom'; 
import freelanceVideo from '../../assets/video/bg.mp4'; 
import styles from '../../assets//style/home/Video.module.css';

const VideoSection = () => {
  return (
    <main className={`position-relative vh-100 overflow-hidden ${styles.videoSection}`}>
      {/* Видео на заднем плане */}
      <video
        autoPlay
        loop
        muted
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ zIndex: -1 }}
      >
        <source src={freelanceVideo} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      {/* Контент поверх видео */}
      <div className={`position-relative d-flex flex-column align-items-center justify-content-center min-vh-100 text-white text-center p-4`}>
        <h1 className="display-4 fw-bold mb-4">
          Найдите лучших фрилансеров
        </h1>
        <ul className={`lead mb-5 ${styles.list}`}> 
          <li className={styles.listItem}>Разнообразная работа в сфере IT-технологий</li>
          <li className={styles.listItem}>Экономете до 90% своего времени</li>
          <li className={styles.listItem}>Платите только тогда, когда вы счастливы на 100%</li>
        </ul>
        <div className={`d-flex ${styles.dFlex} flex-column gap-3 align-items-center justify-content-center`}>
          {/* Кнопка авторизации */}
          <div className={styles.wrapper}>
            <div className={styles.linkWrapper}>
              <Link to="/authorization" className="nav-link literata-font">Найти фрилансера</Link>
              <div className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
                  <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoSection;