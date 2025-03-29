import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Подключаем Bootstrap
import "../../assets/style/PostProject/PostProject.css"; 

const PostProject = () => {
  // Состояния для хранения данных
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [authOptions, setAuthOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [skills, setSkills] = useState([
    "css",
    "php",
    "js",
    "mongodb",
    "mern",
    "react",
    "tailwind css",
    "node.js",
    "express",
    "python",
    "django",
  ]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1);

  // При загрузке компонента выбираем первые 5 навыков
  useEffect(() => {
    setSelectedSkills(skills.slice(0, 5));
  }, []);

  // Обработчики изменений
  const handleAuthOptionChange = (option) => {
    let updatedOptions;
    if (option === "Вход в систему не требуется") {
      // Если выбран "Вход в систему не требуется", снимаем другие варианты
      updatedOptions = ["Вход в систему не требуется"];
    } else {
      // Если выбран другой вариант, убираем "Вход в систему не требуется"
      updatedOptions = authOptions.filter((item) => item !== "Вход в систему не требуется");
      if (authOptions.includes(option)) {
        updatedOptions = updatedOptions.filter((item) => item !== option);
      } else {
        updatedOptions = [...updatedOptions, option];
      }
    }

    // Обновляем выбранные функции
    setAuthOptions(updatedOptions);

    // Обновляем описание проекта, добавляя выбранные функции
    updateDescriptionWithAuthOptions(updatedOptions);
  };

  // Обновление описания проекта с учетом выбранных функций
  const updateDescriptionWithAuthOptions = (options) => {
    const baseDescription = projectDescription.split("\n")[0]; // Берем основное описание (первую строку)
    let authOptionsText = "";

    if (options.length > 0) {
      if (options.includes("Вход в систему не требуется")) {
        authOptionsText = "Проект не требует регистрации или входа в систему.";
      } else {
        const functionsList = options.join(", ");
        authOptionsText = `Проект включает следующие функции: ${functionsList}.`;
      }
    }

    // Объединяем основное описание и текст о функциях
    setProjectDescription(`${baseDescription}\n\n${authOptionsText}`);
  };

  const handleSkillChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((item) => item !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      } else {
        alert("Можно добавить не более 5 навыков.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePublish = () => {
    console.log({
      projectName,
      projectDescription,
      authOptions,
      images,
      selectedSkills,
    });
    alert("Проект успешно опубликован!");
  };

  // Фильтрация навыков для поиска
  const filteredSkills = skills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body p-5">
          {step === 1 && (
            <div className="step-1">
              <h2 className="mb-4">Шаг 1: Название и описание проекта</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Название проекта"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control form-control-lg"
                  placeholder="Описание проекта"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={5}
                />
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                Далее
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-2">
              <h2 className="mb-4">Шаг 2: Функции регистрации и входа</h2>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={authOptions.includes("Регистрация пользователя и вход в систему")}
                    onChange={() => handleAuthOptionChange("Регистрация пользователя и вход в систему")}
                  />
                  <label className="form-check-label">Регистрация пользователя и вход в систему</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={authOptions.includes("Интеграция входа в социальные сети")}
                    onChange={() => handleAuthOptionChange("Интеграция входа в социальные сети")}
                  />
                  <label className="form-check-label">Интеграция входа в социальные сети</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={authOptions.includes("Вход в систему не требуется")}
                    onChange={() => handleAuthOptionChange("Вход в систему не требуется")}
                  />
                  <label className="form-check-label">Вход в систему не требуется</label>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                Далее
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="step-3">
              <h2 className="mb-4">Шаг 3: Итоговый результат</h2>
              <div className="mb-3">
                <h3>Название проекта</h3>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Название проекта"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <h3>Описание проекта</h3>
                <textarea
                  className="form-control form-control-lg"
                  placeholder="Описание проекта"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="mb-3">
                <h3>Изображения</h3>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleImageUpload}
                />
                <div className="mt-2">
                  {images.map((image, index) => (
                    <div key={index}>{image.name}</div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                Далее
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="step-4">
              <h2 className="mb-4">Шаг 4: Выбор навыков</h2>
              <p className="mb-4">
                Мы определили следующие навыки, которые подходят для вашего проекта. Вы можете изменить эти параметры по
                своему усмотрению. Вы можете добавить до 5 навыков.
              </p>
              <div className="skills-input-container mb-3">
                <div className="selected-skills-in-input d-flex flex-wrap gap-2 mb-3">
                  {selectedSkills.map((skill) => (
                    <div key={skill} className="skill-tag">
                      {skill}
                      <button
                        className="remove-skill-btn"
                        onClick={() => handleSkillChange(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Поиск навыков"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <div className="suggested-skills mt-3">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      className="skill-item"
                    >
                      <span>{skill}</span>
                      <button
                        className="btn-add-skill"
                        onClick={() => handleSkillChange(skill)}
                      >
                        Добавить
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn-next-step" onClick={handleNextStep}>
                Далее
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="step-5">
              <h2 className="mb-4">Шаг 5: Публикация проекта</h2>
              <div className="mb-4">
                <h3>Название проекта: {projectName}</h3>
                <p>Описание проекта: {projectDescription}</p>
                <p>Выбранные навыки: {selectedSkills.join(", ")}</p>
              </div>
              <button className="btn-publish" onClick={handlePublish}>
                Опубликовать проект
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostProject;