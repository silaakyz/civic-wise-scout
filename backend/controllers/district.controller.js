import { DistrictService } from "../services/district.service.js";

export const DistrictController = {
    // GET /api/districts-full
    async getAllDistrictsFull(req, res) {
        try {
            const result = await DistrictService.getAllDistrictsFull();
            res.json(result);
        } catch (err) {
            console.error("DISTRICT API ERROR:", err);
            res.status(500).json({ error: "Veriler alınamadı" });
        }
    },

    // POST /api/districts/:id/actions
    async createAction(req, res) {
        try {
            const districtId = req.params.id;
            // Support both camelCase and snake_case
            const body = req.body;
            const actionData = {
                district_id: districtId,
                action: body.action,
                category: body.category,
                potential_score: body.potential_score || body.potentialScore,
                priority: body.priority,
                budget: body.budget,
                duration_months: body.duration_months || body.durationMonths,
                status: body.status
            };

            const newActionId = await DistrictService.createAction(actionData);

            res.status(201).json({ message: "Action created", id: newActionId });
        } catch (err) {
            console.error("CREATE ACTION ERROR:", err);
            if (err.message === "Bütçe negatif olamaz.") {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: "Action oluşturulamadı" });
        }
    },

    // DELETE /api/actions/:id
    async deleteAction(req, res) {
        try {
            const actionId = req.params.id;
            await DistrictService.deleteAction(actionId);
            res.json({ message: "Action silindi" });
        } catch (err) {
            console.error("DELETE ACTION ERROR:", err);
            if (err.message === "Action bulunamadı") {
                return res.status(404).json({ error: err.message });
            }
            if (err.message === "Yüksek öncelikli aksiyonlar silinemez.") {
                return res.status(403).json({ error: err.message });
            }
            res.status(500).json({ error: "Action silinemedi" });
        }
    },

    // PUT /api/actions/:id
    async updateAction(req, res) {
        try {
            const actionId = req.params.id;
            const body = req.body;

            // Normalize to snake_case for internal service usage
            const updateData = {};
            if (body.action !== undefined) updateData.action = body.action;
            if (body.category !== undefined) updateData.category = body.category;
            if (body.priority !== undefined) updateData.priority = body.priority;
            if (body.budget !== undefined) updateData.budget = body.budget;
            if (body.status !== undefined) updateData.status = body.status;

            // Handle camelCase variations
            if (body.potential_score !== undefined) updateData.potential_score = body.potential_score;
            if (body.potentialScore !== undefined) updateData.potential_score = body.potentialScore;

            if (body.duration_months !== undefined) updateData.duration_months = body.duration_months;
            if (body.durationMonths !== undefined) updateData.duration_months = body.durationMonths;

            await DistrictService.updateAction(actionId, updateData);

            res.json({ message: "Action güncellendi" });
        } catch (err) {
            console.error("UPDATE ACTION ERROR:", err);
            if (err.message === "Bütçe negatif olamaz.") {
                return res.status(400).json({ error: err.message });
            }
            if (err.message === "Action bulunamadı") {
                return res.status(404).json({ error: err.message });
            }
            res.status(500).json({ error: "Action güncellenemedi" });
        }
    }
};
