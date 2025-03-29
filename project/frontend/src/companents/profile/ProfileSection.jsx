import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaWallet, FaTasks, FaStar, FaEdit, FaUpload, FaSignOutAlt } from "react-icons/fa";
import { useFormik } from "formik";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { profileSchema } from "../../utils/validation";
import "../../assets/style/profile/ProfileSection.css";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    const localStorageToken = localStorage.getItem("token");
    return urlToken || localStorageToken;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        
        if (!token) {
          throw new Error("Требуется авторизация");
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setPreviewAvatar(response.data.user.avatar || getDefaultAvatar(response.data.user));
        
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get("token")) {
          localStorage.setItem("token", queryParams.get("token"));
          navigate("/profile", { replace: true });
        }

      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        toast.error("Требуется авторизация");
        navigate("/authorization");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, location.search]);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      avatar: null,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Требуется авторизация");
        }

        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("bio", values.bio);
        
        if (values.avatar) {
          formData.append("avatar", values.avatar);
        }

        const response = await axios.put(
          "http://localhost:5000/api/profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUser(response.data.user);
        if (response.data.user.avatar) {
          setPreviewAvatar(response.data.user.avatar);
        }
        setIsEditing(false);
        toast.success("Профиль успешно обновлен!");

      } catch (error) {
        console.error("Ошибка обновления профиля:", error);
        toast.error(error.response?.data?.message || "Не удалось обновить профиль");
      }
    },
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout", 
        {}, 
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      navigate("/authorization");
    } catch (error) {
      console.error("Ошибка выхода:", error);
      toast.error("Не удалось выйти");
    }
  };

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("avatar", file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const getDefaultAvatar = (user) => {
    const name = user ? `${user.firstName}+${user.lastName}` : "Пользователь";
    return `https://ui-avatars.com/api/?name=${name}&background=random&size=150`;
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <p>Не удалось загрузить профиль</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/authorization")}
        >
          Перейти к авторизации
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={previewAvatar}
            alt="Аватар"
            onError={(e) => {
              e.target.src = getDefaultAvatar(user);
            }}
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
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Имя"
                className={`edit-input ${
                  formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''
                }`}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="error-message">{formik.errors.firstName}</div>
              )}

              <input
                type="text"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Фамилия"
                className={`edit-input ${
                  formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''
                }`}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="error-message">{formik.errors.lastName}</div>
              )}
            </>
          ) : (
            <h1>{user.firstName} {user.lastName}</h1>
          )}
          <p className="profile-meta">
            <span className="profile-joined">
              Участник с {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-description">
          <h2>О себе</h2>
          {isEditing ? (
            <>
              <textarea
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Расскажите о себе..."
                className={`edit-textarea ${
                  formik.touched.bio && formik.errors.bio ? 'is-invalid' : ''
                }`}
              />
              {formik.touched.bio && formik.errors.bio && (
                <div className="error-message">{formik.errors.bio}</div>
              )}
            </>
          ) : (
            <p>{user.bio || "Информация отсутствует."}</p>
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
      </div>

      <div className="profile-actions">
        <button 
          className="btn btn-primary edit-button"
          onClick={isEditing ? formik.handleSubmit : handleEditClick}
          disabled={isEditing && !formik.isValid}
        >
          <FaEdit /> {isEditing ? "Сохранить" : "Редактировать"}
        </button>
        <button 
          className="btn btn-outline-danger logout-button"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;