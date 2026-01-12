import { DistrictModel } from "../models/district.model.js";

export const DistrictService = {
    async getAllDistrictsFull() {
        const districts = await DistrictModel.findAll();
        const result = [];

        for (const d of districts) {
            const scores = await DistrictModel.findScoresByDistrictId(d.id);
            const factors = await DistrictModel.findNegativeFactorsByDistrictId(d.id);
            const trendRows = await DistrictModel.findTrendDataByDistrictId(d.id);
            const actions = await DistrictModel.findActionsByDistrictId(d.id);

            result.push({
                id: d.id,
                name: d.name,
                coordinates: [Number(d.lat), Number(d.lng)],
                radius: d.radius,
                scores: scores
                    ? {
                        infrastructure: Number(scores.infrastructure),
                        environment: Number(scores.environment),
                        social: Number(scores.social),
                        transportation: Number(scores.transportation),
                        security: Number(scores.security),
                        education: Number(scores.education),
                        health: Number(scores.health),
                        overall: Number(scores.overall),
                    }
                    : {
                        infrastructure: 0,
                        environment: 0,
                        social: 0,
                        transportation: 0,
                        security: 0,
                        education: 0,
                        health: 0,
                        overall: 0,
                    },
                negativeFactors: factors
                    ? {
                        uncontrolledMigration: Number(factors.uncontrolled_migration),
                        informalSettlement: Number(factors.informal_settlement),
                        crimeRate: Number(factors.crime_rate),
                        trafficCongestion: Number(factors.traffic_congestion),
                        noisePollution: Number(factors.noise_pollution),
                        airPollution: Number(factors.air_pollution),
                    }
                    : {
                        uncontrolledMigration: 0,
                        informalSettlement: 0,
                        crimeRate: 0,
                        trafficCongestion: 0,
                        noisePollution: 0,
                        airPollution: 0,
                    },
                trendData: trendRows.map(t => Number(t.overall)),
                recommendedActions: actions.map(a => ({
                    id: a.id,
                    action: a.action,
                    category: a.category,
                    potentialScore: Number(a.potential_score),
                    priority: a.priority,
                    budget: a.budget,
                    durationMonths: a.duration_months,
                    status: a.status,
                })),
            });
        }
        return result;
    },

    async createAction(data) {
        // Business Rule 1: Budget cannot be negative
        if (data.budget < 0) {
            throw new Error("Bütçe negatif olamaz.");
        }

        return await DistrictModel.createAction({
            ...data,
            status: data.status || 'pending'
        });
    },

    async deleteAction(id) {
        const action = await DistrictModel.findActionById(id);
        if (!action) {
            throw new Error("Action bulunamadı");
        }

        // Business Rule 2: High priority action cannot be deleted
        if (action.priority === 'high') {
            throw new Error("Yüksek öncelikli aksiyonlar silinemez.");
        }

        return await DistrictModel.deleteAction(id);
    },

    async updateAction(id, data) {
        // Business Rule 1: Budget cannot be negative
        if (data.budget !== undefined && data.budget < 0) {
            throw new Error("Bütçe negatif olamaz.");
        }

        const existingAction = await DistrictModel.findActionById(id);
        if (!existingAction) {
            throw new Error("Action bulunamadı");
        }

        const updatedData = {
            ...existingAction,
            ...data
        };

        return await DistrictModel.updateAction(id, updatedData);
    }
};
