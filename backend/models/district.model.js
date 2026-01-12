import { db } from "../db/mysql_connect.js";

export const DistrictModel = {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM districts");
        return rows;
    },

    async findScoresByDistrictId(id) {
        const [[row]] = await db.query(
            `
      SELECT * FROM district_scores
      WHERE district_id = ?
      ORDER BY year DESC, score_date DESC
      LIMIT 1
      `,
            [id]
        );
        return row;
    },

    async findNegativeFactorsByDistrictId(id) {
        const [[row]] = await db.query(
            `
      SELECT * FROM negative_factors
      WHERE district_id = ?
      ORDER BY factor_date DESC
      LIMIT 1
      `,
            [id]
        );
        return row;
    },

    async findTrendDataByDistrictId(id) {
        const [rows] = await db.query(
            `
      SELECT overall
      FROM district_scores
      WHERE district_id = ?
      ORDER BY year DESC, score_date DESC
      LIMIT 4
      `,
            [id]
        );
        return rows;
    },

    async findActionsByDistrictId(id) {
        const [rows] = await db.query(
            `
      SELECT *
      FROM actions
      WHERE district_id = ?
      ORDER BY
        FIELD(priority,'high','medium','low'),
        created_at DESC
      `,
            [id]
        );
        return rows;
    },

    async findActionById(id) {
        const [[row]] = await db.query("SELECT * FROM actions WHERE id = ?", [id]);
        return row;
    },

    async createAction(data) {
        const { district_id, action, category, potential_score, priority, budget, duration_months, status } = data;
        const [result] = await db.query(
            `INSERT INTO actions 
      (district_id, action, category, potential_score, priority, budget, duration_months, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [district_id, action, category, potential_score, priority, budget, duration_months, status]
        );
        return result.insertId;
    },

    async deleteAction(id) {
        const [result] = await db.query("DELETE FROM actions WHERE id = ?", [id]);
        return result.affectedRows;
    },

    async updateAction(id, data) {
        const { action, category, potential_score, priority, budget, duration_months, status } = data;
        const [result] = await db.query(
            `UPDATE actions 
             SET action = ?, category = ?, potential_score = ?, priority = ?, budget = ?, duration_months = ?, status = ?
             WHERE id = ?`,
            [action, category, potential_score, priority, budget, duration_months, status, id]
        );
        return result.affectedRows;
    }
};
