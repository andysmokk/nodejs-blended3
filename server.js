// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const { colors } = require("./helpers");
const connectDB = require("./config/db");
// const User = require("./models/User");
const sendEmail = require("./services/email");
const { engine } = require("express-handlebars");

// регистрация - сохранение нового пользователя в базе
// аутентификация - проверка пользователя (email, pass, token)
// авторизация - права на доступ к определенным ресурсам сайта

// load config variables
dotenv.config({ path: "./config/.env" });

const app = express();

// body parser
app.use(express.json());

const urlEncodedParcer = express.urlencoded({ extended: false });

app.use(urlEncodedParcer);

const { PORT } = process.env;

connectDB();

// routes
const books = require("./routes/booksRouts");
app.use("/api/v1/books", books);

const auth = require("./routes/authRouts");
app.use("/api/v1", auth);

// app.post("/api/v1/register", async (req, res) => {
//   // 1. получаем данные пользователя (email, pass, name)

//   const { firsName, lastName, email, password } = req.body;

//   // 2. валидация полей пользователя
//   if (!lastName || !email || !password) {
//     return res
//       .status(400)
//       .json({ message: "Введите корректные данные", code: 400 });
//   }

//   // 3. проверяем если пользователь в базе
//   const user = await User.findOne({ email });

//   // 4. если пользователь есть то сообщаем что можно логинится
//   if (user) {
//     return res
//       .status(409)
//       .json({ message: "Пользователь существует", code: 409 });
//   }

//   // 5. если пользователя нет то солим пароль
//   const saltPassword = await bcrypt.hash(password, 3);

//   // 6. сохранаяем пользователя в базе
//   const candidate = await User.create({
//     firsName,
//     lastName,
//     email,
//     password: saltPassword,
//     role: "",
//   });

//   // 7. генерируем токен для пользователя и сохраняем в базу
//   const token = jwt.sign(
//     { user_id: candidate._id },
//     process.env.TOKEN_SECRET_KEY,
//     { expiresIn: "8h" }
//   );

//   candidate.token = token;
//   await candidate.save();

//   // 8. отправляем ответ об успехе регистрации
//   return res
//     .status(201)
//     .json({ message: "Успешно", code: 201, user: { candidate } });
// });

// app.post("/api/v1/login", async (req, res) => {
//   // 1. получаем данные пользователя (email, pass)
//   const { lastName, email, password } = req.body;

//   // 2. валидация полей пользователя
//   if (!lastName || !email || !password) {
//     return res
//       .status(400)
//       .json({ message: "Введите корректные данные", code: 400 });
//   }

//   // 3. проверяем если пользователь в базе
//   const user = await User.findOne({ email });

//   // 4. если пользователя нет то сообщаем что нужно зарегится
//   if (!user) {
//     return res
//       .status(400)
//       .json({ message: "Пользователь не зарегистрирован", code: 400 });
//   }

//   // 5. если пользователь есть то проверяем логин, пароль
//   const candidatePassword = await bcrypt.compare(password, user.password);

//   // 6. если логин и пароль не валидные выдаем ошибку аутентификации
//   if (!user.email === email && !candidatePassword) {
//     return res
//       .status(401)
//       .json({ message: "Неверный логин или пароль", code: 401 });
//   }

//   // 7. проверяем токен на валидность при условии логина и пароля OK
//   jwt.verify(
//     user.token,
//     process.env.TOKEN_SECRET_KEY,
//     async (error, decoded) => {
//       if (error) {
//         const token = jwt.sign(
//           { user_id: user._id },
//           process.env.TOKEN_SECRET_KEY,
//           { expiresIn: "8h" }
//         );
//         user.token = token;
//         await user.save();
//         console.log("new token");
//         return res
//           .status(200)
//           .json({ message: "Success", code: 200, user: user });
//       }
//       console.log("token has already");
//       return res
//         .status(200)
//         .json({ message: "Success", code: 200, user: user });
//     }
//   );

//   // 8. если токен не валидные выдаем новый
//   // 9. успешная логинизация
// });

// app.post("/logout", async (req, res) => {});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/contact", async (req, res) => {
  res.render("contact", { message: "Andy" });
  // await sendEmail(req.body);
});

app.get("/about", async (req, res) => {
  res.render("about", { code: 200 });
  // await sendEmail(req.body);
});

app.post("/send", async (req, res) => {
  try {
    await sendEmail(req.body);
    // return res
    //   .status(200)
    //   .render("contact", { message: "Форма успешно отправлена" });
    return res.status(200).redirect("/contact");
  } catch (error) {
    console.log(error.message);
  }

  // res.status(200).redirect("/about");
  // console.log(req.body);
});

// page not found
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// connect db

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`.green.italic);
});

process.on("unhandledRejection", (error, _) => {
  if (error) {
    console.log(`error: ${error.message}`.red);
    server.close(() => process.exit(1));
  }
});
