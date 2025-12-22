import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 TEST
app.get("/api/hello", (req, res) => {
  res.json({ mesaj: "Server çalışıyor" });
});

// 🔹 MYSQL TEST (ASIL 8. ADIM)
app.get("/api/districts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM districts");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: "Veritabanı hatası" });
  }
});

app.listen(4000, () => {
  console.log("🚀 Server başladı: http://localhost:4000");
});
