import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import districtRoutes from "./routers/districtRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   ROUTES
================================ */
app.use("/api", districtRoutes);

/* ===============================
   TEST & HEALTH CHECK
================================ */
app.get("/api/hello", (req, res) => {
  res.json({ mesaj: "Server çalışıyor" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
