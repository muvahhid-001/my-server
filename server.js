const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors"); // Импортируем библиотеку cors
const app = express();
const port = 3000;

// Настроим middleware для обработки JSON в теле запроса
app.use(express.json());

// Настройка CORS (разрешаем все источники)
app.use(cors()); // Теперь запросы с других источников будут разрешены

// Создадим или откроем базу данных SQLite
const db = new sqlite3.Database("./mydb.db", (err) => {
  if (err) {
    console.error("Ошибка при открытии базы данных:", err.message);
  } else {
    console.log("База данных подключена");
  }
});

// Создадим таблицу, если ее нет
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)"
);

// Эндпоинт для получения всех пользователей
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

// Эндпоинт для добавления нового пользователя
app.post("/users", (req, res) => {
  const { name, age } = req.body;
  const sql = "INSERT INTO users (name, age) VALUES (?, ?)";

  db.run(sql, [name, age], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, name, age });
  });
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
