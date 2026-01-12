import express from "express";
import { DistrictController } from "../controllers/district.controller.js";

const router = express.Router();

// GET /api/districts-full
router.get("/districts-full", DistrictController.getAllDistrictsFull);

// POST /api/districts/:id/actions - Yeni aksiyon ekle (Kural: Bütçe negatif olamaz)
router.post("/districts/:id/actions", DistrictController.createAction);

// DELETE /api/actions/:id - Aksiyon sil (Kural: High priority silinemez)
router.delete("/actions/:id", DistrictController.deleteAction);

// PUT /api/actions/:id - Aksiyon güncelle (Kural: Bütçe negatif olamaz)
router.put("/actions/:id", DistrictController.updateAction);

export default router;
