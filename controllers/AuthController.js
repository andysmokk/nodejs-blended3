const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

class AuthController {
  async register(req, res) {
    // 1. получаем данные пользователя (email, pass, name)

    const { firsName, lastName, email, password } = req.body;

    // 2. валидация полей пользователя
    // if (!lastName || !email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: "Введите корректные данные", code: 400 });
    // }

    // 3. проверяем если пользователь в базе
    const user = await User.findOne({ email });

    // 4. если пользователь есть то сообщаем что можно логинится
    if (user) {
      return res
        .status(409)
        .json({ message: "Пользователь существует", code: 409 });
    }

    // 5. если пользователя нет то солим пароль
    const saltPassword = await bcrypt.hash(password, 3);

    // 6. сохранаяем пользователя в базе
    const candidate = await User.create({
      firsName,
      lastName,
      email,
      password: saltPassword,
      role: "",
    });

    // 7. генерируем токен для пользователя и сохраняем в базу
    const token = jwt.sign(
      { user_id: candidate._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "8h" }
    );

    candidate.token = token;
    await candidate.save();

    // 8. отправляем ответ об успехе регистрации
    return res
      .status(201)
      .json({ message: "Успешно", code: 201, user: { candidate } });
  }

  async login(req, res) {
    // 1. получаем данные пользователя (email, pass)
    const { lastName, email, password } = req.body;

    // 2. валидация полей пользователя
    if (!lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Введите корректные данные", code: 400 });
    }

    // 3. проверяем если пользователь в базе
    const user = await User.findOne({ email });

    // 4. если пользователя нет то сообщаем что нужно зарегится
    if (!user) {
      return res
        .status(400)
        .json({ message: "Пользователь не зарегистрирован", code: 400 });
    }

    // 5. если пользователь есть то проверяем логин, пароль
    const candidatePassword = await bcrypt.compare(password, user.password);

    // 6. если логин и пароль не валидные выдаем ошибку аутентификации
    if (!user.email === email && !candidatePassword) {
      return res
        .status(401)
        .json({ message: "Неверный логин или пароль", code: 401 });
    }

    // 7. проверяем токен на валидность при условии логина и пароля OK
    jwt.verify(
      user.token,
      process.env.TOKEN_SECRET_KEY,
      async (error, decoded) => {
        if (error) {
          const token = jwt.sign(
            { user_id: user._id },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "8h" }
          );
          user.token = token;
          await user.save();
          console.log("new token");
          return res
            .status(200)
            .json({ message: "Success", code: 200, user: user });
        }
        console.log("token has already");
        return res
          .status(200)
          .json({ message: "Success", code: 200, user: user });
      }
    );

    // 8. если токен не валидные выдаем новый
    // 9. успешная логинизация
  }

  async logout(req, res) {
    // 1) получаем токен из заголовков
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Error", code: 401 });
    }

    const token = req.headers.authorization.slice(7);

    // 2) расшифровыем токен, достаем payload
    try {
      const { id } = jwt.decode(token, process.env.TOKEN_SECRET_KEY);
      // 3) если внутри есть id - то токен валидный и меняем его на null
      await User.findByIdAndUpdate(id, { token: null });
      return res.status(200).json({ message: "Вы успешно розлогинились" });
      // 4) если id нет внутри, то токен не валидный
    } catch (error) {
      console.log(error.message);
      return res.status(401).json({ message: "Not authorized", code: 401 });
    }
  }
}

module.exports = new AuthController();
