import axios from "axios";
import config from "../config/config";

export default {
    instanceAxios: axios.create({
        baseURL: config.backendApiEndPoint,
        timeout: 10000,
        headers: {
            "x-access-token": config.backendSecretKey,
        },
    }),
};
