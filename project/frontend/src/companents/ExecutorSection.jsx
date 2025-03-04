import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ExecutorSection.css'; 

const ExecutorSection = () => {
    return (
        <div className="container mt-4">
            <div className="row">
                {/* Фильтр с левой стороны */}
                <div className="col-md-3">
                    <div className="filter-section">
                        <h3>Фильтры</h3>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="websiteDesign" />
                            <label className="form-check-label" htmlFor="websiteDesign">Дизайн и разработка сайтов</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="appDevelopment" />
                            <label className="form-check-label" htmlFor="appDevelopment">Разработка приложений</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="phpDevelopment" />
                            <label className="form-check-label" htmlFor="phpDevelopment">PHP разработка</label>
                        </div>
                    </div>
                </div>

                {/* Основной контент */}
                <div className="col-md-9">
                    <h1>Поиск по ключевым словам</h1>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Онлайн работа" />
                    </div>
                    <button className="btn btn-primary mb-4">Поиск</button>
                    <p className="text-muted">Мои последние поиски</p>
                    <p className="text-muted">Newsit первый</p>
                    <p className="mb-4">Найдено 44 вакансии</p>

                    {/* Карточка 1 */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">$131 Средний бюджет</h5>
                            <p className="card-text">Осталось 6 дней Проверено</p>
                            <p className="card-text">62 заявки</p>
                            <p className="card-text">Бюджет</p>
                            <p className="card-text">Ищу того, кто сможет разработать и загрузить сайт для моей строительной компании</p>
                            <p className="card-text">Проекты с фиксированной ценой</p>
                            <p className="card-text">с логотипом.</p>
                            <p className="card-text">Веб-разработка Дизайн сайтов</p>
                            <div className="row">
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="мин" />
                                </div>
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="макс" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Карточка 2 */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Разработчик приложений для объявлений и бизнес-каталога --2</h5>
                            <p className="card-text">$4301 Средний бюджет</p>
                            <div className="row">
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="мин" />
                                </div>
                                <div className="col">
                                    <input type="number" className="form-control" placeholder="макс" />
                                </div>
                            </div>
                            <p className="card-text">Осталось 6 дней</p>
                            <p className="card-text">30 заявок</p>
                            <h6>Название вакансии: Требуется опытный разработчик веб и мобильных приложений для платформы объявлений и бизнеса</h6>
                            <p className="card-text">Все сроки</p>
                            <p className="card-text">Описание вакансии: Мы ищем опытного разработчика веб и мобильных приложений для создания многофункциональной платформы объявлений. Платформа должна включать списки недвижимости, вакансии и бизнес-каталог. Она должна быть доступна как на веб, так и на мобильных устройствах (Android и iOS) с интуитивно понятным пользовательским интерфейсом, расширенными функциями поиска и фильтрации, а также возможностями монетизации.</p>
                            <p className="card-text">Разработка Android iPhone Мобильных приложений PHP Веб-разработка</p>
                        </div>
                    </div>

                    {/* Карточка 3 */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Профессиональный сайт и приложение</h5>
                            <p className="card-text">$8387 Средний бюджет</p>
                            <p className="card-text">Тип</p>
                            <p className="card-text">Осталось 6 дней</p>
                            <p className="card-text">124 заявки</p>
                            <p className="card-text">Местные вакансии</p>
                            <p className="card-text">Ищу опытного разработчика или команду для создания сайта и мобильного приложения, аналогичного существующим, но адаптированного для немецкого рынка. Платформа должна связывать профессионалов с клиентами и включать функции, такие как публикация вакансий, профили, отзывы, платежи и интуитивная функция чата. В зависимости от опыта и требований, проект может начаться как MVP или быть разработан в полностью масштабируемую платформу. Опыт работы с платформами маркетплейсов и интеграциями платежей будет плюсом.</p>
                            <p className="card-text">Разработка Android приложений HTML Разработка iPhone приложений PHP Веб-разработка</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutorSection;