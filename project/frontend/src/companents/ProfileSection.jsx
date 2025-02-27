import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../style/Profile.css"; // Убедитесь, что путь к стилям правильный

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Загрузка данных профиля
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/profile", { replace: true });
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/authorization");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          bio: response.data.user.bio || "",
          avatar: response.data.user.avatar || "https://gravatar.com/avatar/default",
        });
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
        navigate("/authorization");
      }
    };

    fetchProfile();
  }, [navigate, location]);

  // Выход из профиля
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Переключение режима редактирования
  const handleEditClick = () => {
    setIsEditing(!isEditing); // Переключаем режим редактирования
  };

  // Сохранение изменений
  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.user); // Обновляем данные пользователя
      setIsEditing(false); // Выходим из режима редактирования
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  // Обработка изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Если данные пользователя еще не загружены
  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container">
      <div className="row profile">
        {/* Боковая панель */}
        <div className="col-md-3">
          <div className="profile-sidebar">
            {/* Аватарка */}
            <div className="profile-userpic">
              <img
                src={user.avatar || "https://gravatar.com/avatar/default"}
                className="img-responsive"
                alt={user.firstName}
                style={{ display: "block", margin: "0 auto" }}
              />
            </div>

            {/* Имя и роль */}
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="profile-usertitle-job">{user.role}</div>
            </div>

            {/* Кнопки */}
            <div className="profile-userbuttons">
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleEditClick}
              >
                {isEditing ? "Отмена" : "Редактировать"}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>

            {/* Статистика */}
            <div className="portlet light bordered">
              <div className="row list-separated profile-stat">
                <div className="col-md-4 col-sm-4 col-xs-6">
                  <div className="uppercase profile-stat-title">37</div>
                  <div className="uppercase profile-stat-text">Проекты</div>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-6">
                  <div className="uppercase profile-stat-title">51</div>
                  <div className="uppercase profile-stat-text">Задачи</div>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-6">
                  <div className="uppercase profile-stat-title">61</div>
                  <div className="uppercase profile-stat-text">Загрузки</div>
                </div>
              </div>

              {/* Описание */}
              <div>
                <h4 className="profile-desc-title">
                  О {user.firstName} {user.lastName}
                </h4>
                <span className="profile-desc-text">
                  {user.bio || "Нет информации о себе."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="col-md-9">
          <div className="profile-content">
            {isEditing ? (
              // Форма редактирования
              <div className="edit-form">
                <h2>Редактировать профиль</h2>
                <form>
                  {/* Имя */}
                  <div className="form-group">
                    <label>Имя:</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Фамилия */}
                  <div className="form-group">
                    <label>Фамилия:</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* О себе */}
                  <div className="form-group">
                    <label>О себе:</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Аватарка */}
                  <div className="form-group">
                    <label>Аватарка (URL):</label>
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Кнопка сохранения */}
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveClick}
                    >
                      Сохранить
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Режим просмотра
              <div>
                <h2>Контент пользователя</h2>
                <p>Здесь будет контент, связанный с пользователем...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;