import api from "./api";

export const profileService = {
    async getProfile() {
        const response = await api.get("/api/profile");
        return response.data;
    },

    async updateProfile(data) {
        const response = await api.put("/api/profile/data-profile", data);
        return response.data;
    },

    async uploadPhoto(formData) {
        const response = await api.post(
            "/api/profile/photo-profile",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
        return response.data;
    },

    async deletePhoto() {
        const response = await api.post("/api/profile/delete-photo");
        return response.data;
    },

    async verifyCode(data) {
        const response = await api.post("/api/profile/verify-code", data);
        return response.data;
    },
};
