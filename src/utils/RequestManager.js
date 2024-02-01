import axios from 'axios';
import config from '../config/config';
import Global from '../utils/Global';

export default class RequestManager {
  static createAxiosInstance() {
    return axios.create({
      baseURL: config.backendApiEndPoint,
      timeout: 1000 * 60, //1 minutes
      headers: {
        'x-access-token': config.backendSecretKey,
      },
    });
  }

  static asyncResolver(fn) {
    return (request, response, next) => {
      Promise.resolve(fn(request, response, next)).catch(error => {
        RequestManager.sendResponse(response, {
          success: false,
          error,
        });
      });
    };
  }

  static sendResponse(response, dataToSend, status = null) {
    if (dataToSend && dataToSend.success) {
      response.status(200).json(dataToSend);
    } else {
      response.status(status || 460).json({
        success: false,
        error: dataToSend.error,
      });
    }
  }

  static executePost(url, params, specialConfig = {}) {
    return new Promise((resolve, reject) => {
      Global.instanceAxios
        .post(url, params, specialConfig)
        .then(response => {
          const {status, data} = response;
          resolve(data);
        })
        .catch(error => {
          resolve(error.response.data);
        });
    });
  }
}
const instance = RequestManager.createAxiosInstance();
