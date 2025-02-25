import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Извлекаем токен из URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token); // Сохраняем токен в localStorage
      navigate("/profile", { replace: true }); // Убираем токен из URL
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/authorization");
        return;
      }

      try {
        // Запрос на бэкенд для получения данных профиля
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); // Убедитесь, что response.data.user содержит данные пользователя
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
        navigate("/authorization");
      }
    };

    fetchProfile();
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Профиль</h1>
      <p>Имя: {user.firstName} {user.lastName}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default ProfileSection;