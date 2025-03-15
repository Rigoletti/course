import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaWallet, FaTasks, FaStar, FaEdit, FaUpload } from "react-icons/fa";
import "../../style/profile/ProfileSection.css";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: null,
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/profile");
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
        console.log("Данные профиля:", response.data); // Логируем данные
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          bio: response.data.user.bio || "",
          avatar: null,
        });
        setPreviewAvatar(response.data.user.avatar || null);
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/authorization");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authorization");
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    const { firstName, lastName, bio, avatar } = formData;

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { firstName, lastName, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.user);

      if (avatar) {
        const formDataToSend = new FormData();
        formDataToSend.append("avatar", avatar);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/auth/upload-avatar",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUser((prevUser) => ({ ...prevUser, avatar: uploadResponse.data.avatar }));
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        avatar: file,
      }));
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prevData) => ({
        ...prevData,
        avatar: file,
      }));
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      alert("Пожалуйста, выберите изображение.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Дата не указана";
    }
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Время не указано";
    }
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div
          className={`profile-avatar ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src={previewAvatar || "https://avatars.mds.yandex.net/i?id=d9716aec8b7a04c4bc5c30cdf79abf58_l-5467951-images-thumbs&n=13"}
            alt="Аватарка"
          />
          {isEditing && (
            <label className="avatar-upload">
              <FaUpload className="upload-icon" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Имя"
                className="edit-input"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Фамилия"
                className="edit-input"
              />
            </>
          ) : (
            <>
              <h1>{user.firstName} {user.lastName}</h1>
            </>
          )}
          <p className="profile-location">
            {user.location || "Локация не указана"} • {formatTime(new Date())}
          </p>
          <p className="profile-joined">
            Присоединился {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="profile-description">
        <h2>О себе</h2>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Расскажите о себе..."
            className="edit-textarea"
          />
        ) : (
          <p>{user.bio || "Нет информации о себе."}</p>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <FaWallet className="stat-icon" />
          <span className="stat-value">{user.balance || 0}</span>
          <span className="stat-label">Баланс</span>
        </div>
        <div className="stat-item">
          <FaTasks className="stat-icon" />
          <span className="stat-value">{user.completedOrders || 0}</span>
          <span className="stat-label">Заказы</span>
        </div>
        <div className="stat-item">
          <FaStar className="stat-icon" />
          <span className="stat-value">{user.rating || 0}</span>
          <span className="stat-label">Рейтинг</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-button" onClick={isEditing ? handleSaveClick : handleEditClick}>
          <FaEdit /> {isEditing ? "Сохранить" : "Редактировать"}
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;