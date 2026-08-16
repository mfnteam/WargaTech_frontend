import api from "./api";

export const mobilityService = {
    // ---- Train ----
    async listTrains() {
        const response = await api.get("/api/mobility/train/list-train");
        return response.data;
    },
    async detailTrain(id) {
        const response = await api.get(
            `/api/mobility/train/detail-train/${id}`,
        );
        return response.data;
    },
    async listStations() {
        const response = await api.get("/api/mobility/train/list-station");
        return response.data;
    },
    async createTrain(data) {
        const response = await api.post(
            "/api/mobility/train/create-train",
            data,
        );
        return response.data;
    },

    // ---- Bus ----
    async listBuses(params = {}) {
        const response = await api.get("/api/mobility/bus/list-bus", {
            params,
        });
        return response.data;
    },
    async listCorridors() {
        const response = await api.get("/api/mobility/bus/list-corridor");
        return response.data;
    },
    async createBus(data) {
        const response = await api.post("/api/mobility/bus/create-bus", data);
        return response.data;
    },

    // ---- MRT ----
    async listMRT() {
        const response = await api.get("/api/mobility/mrt/list-mrt");
        return response.data;
    },
    async listMRTStations() {
        const response = await api.get("/api/mobility/mrt/list-station");
        return response.data;
    },
    async createMRT(data) {
        const response = await api.post("/api/mobility/mrt/create-mrt", data);
        return response.data;
    },

    // ---- LRT ----
    async listLRT(type) {
        const params = type ? { type } : {};
        const response = await api.get("/api/mobility/lrt/list-lrt", {
            params,
        });
        return response.data;
    },
    async detailLRT(id) {
        const response = await api.get(`/api/mobility/lrt/detail-lrt/${id}`);
        return response.data;
    },
    async createLRT(data) {
        const response = await api.post("/api/mobility/lrt/create-lrt", data);
        return response.data;
    },
};
