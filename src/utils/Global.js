import axios from "axios";
import config from "../config/config";

export default {
    instanceAxios: axios.create({
        baseURL: config.backendApiEndPoint,
        headers: {
            "x-access-token": config.backendSecretKey,
        },
    }),
};
