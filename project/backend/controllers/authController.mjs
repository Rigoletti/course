// Регистрация пользователя
export const register = async (req, res) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;
  
      // Проверяем, существует ли пользователь с указанным email или username
      const existingUserByEmail = await User.findOne({ email });
      const existingUserByUsername = await User.findOne({ username });
  
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });
      }
  
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Пользователь с таким логином уже существует" });
      }
  
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Создаем нового пользователя
      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
      res.status(201).json({ message: "Регистрация успешна" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };