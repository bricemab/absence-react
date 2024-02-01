import Store from '../store';
import store from '../store';
import * as CryptoJS from 'crypto-js';
import qs from 'qs';
import config from '../config/config';
import RequestManager from '../utils/RequestManager';
import {jwtDecode} from 'jwt-decode';
import 'core-js/stable/atob';

const getDataFromKey = async key => {
  try {
    return await Store.load({key});
  } catch (e) {
    return false;
  }
};
const setData = async (key, data) => {
  try {
    return await store.save({key: key, data: data});
  } catch (e) {
    return false;
  }
};

export default {
  getDataFromKey,
  setData,
  jwtDecode: token => {
    return jwtDecode(token);
  },
  awaitTimeout: async time => {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  },
  clearData(key) {
    return store.remove({key});
  },
  clearAll() {
    return store.clearMap();
  },
  buildHmacSha256Signature(parameters) {
    const dataQueryString = qs.stringify(parameters); // .replace("%20", "+");
    return CryptoJS.HmacSHA256(
      dataQueryString,
      config.hmacSecretPacketKey,
    ).toString(CryptoJS.enc.Hex);
  },
  async postEncodedToBackend(url, params, config, isUploadFile) {
    const token = this.buildHmacSha256Signature(params);
    if (isUploadFile) {
      return RequestManager.executePost(
        url,
        {
          token,
          params,
        },
        config,
      );
    } else {
      const data = {
        data: params,
        token,
      };
      return RequestManager.executePost(url, data, config);
    }
  },
};
