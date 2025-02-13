const express = require("express");
const mailgun = require("mailgun-js");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Раздаём статические файлы (file.html)


const mg = mailgun({
    apiKey: "e68bf0046289b502cfd6d386a5b4ef56-1654a412-a49ce55a",  // Заменить на свой API-ключ
    domain: "sandboxfeaa7374b4234eb28f05f59bbd8e5b5d.mailgun.org", // Заменить на свой домен
});

app.post("/send-email", async (req, res) => {
    const { email } = req.body;


    const filePath = path.join(__dirname, "file.html");
    const fileContent = fs.readFileSync(filePath, "utf8");

    const data = {
        from: "TABDRN <noreply@yourdomain.com>",
        to: email,
        subject: "Ваш файл от TABDRN",
        text: "Спасибо за выбор TABDRN! Ваш файл прикреплён к письму.",
        attachment: [{ data: fileContent, filename: "file.html" }] // 🔹 Добавляем вложение
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            console.error("Ошибка отправки:", error);
            res.status(500).json({ message: "Ошибка при отправке письма." });
        } else {
            console.log("Письмо отправлено:", body);
            res.json({ message: "Файл успешно отправлен на почту!" });
        }
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});