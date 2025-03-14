import axios from 'axios';
import storage from "./localStorage";

const httpClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
    const token = storage.get("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

export default httpClient;
