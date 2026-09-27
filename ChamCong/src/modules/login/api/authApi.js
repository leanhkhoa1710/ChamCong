import axiosClient from "../../../services/api/axiosClient";

const authApi = {
    login(data) {
        return axiosClient.post("/Auth/login", data);
    },
    changePassword(data) {
        return axiosClient.post("/Auth/change-password", data);
    },
};

export default authApi;
