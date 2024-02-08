import axios from 'axios';
import config from '../config/config';
import Global from '../utils/Global';
import {err} from 'react-native-svg';
import {UtilsErrors} from './CodeErrors';
import {UtilsTypes} from './types';
import Store from '../store';

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
    const getDataFromKey = async key => {
      try {
        return await Store.load({key});
      } catch (e) {
        return false;
      }
    };
    return new Promise(async (resolve, reject) => {
      const data = await getDataFromKey(UtilsTypes.DATA);
      if (data && data.userKey && data.deviceKey) {
        if (!specialConfig.headers) {
          specialConfig.headers = {};
        }
        specialConfig.headers['x-device-token'] = data.deviceKey;
        specialConfig.headers['x-user-token'] = data.userKey;
      }
      Global.instanceAxios
        .post(url, params, specialConfig)
        .then(response => {
          const {status, data} = response;
          resolve(data);
        })
        .catch(error => {
          console.log(error);
          if (UtilsErrors.API_NOT_RESPONDING === error.toString()) {
            resolve({
              success: false,
              error: {
                code: UtilsErrors.API_NOT_RESPONDING_CODE,
                message: 'API is not responding',
              },
            });
          } else {
            resolve(error);
          }
        });
    });
  }
}
const instance = RequestManager.createAxiosInstance();
