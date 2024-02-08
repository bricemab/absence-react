import Store from '../store';
import store from '../store';
import 'react-native-get-random-values';
import * as CryptoJS from 'crypto-js';
import qs from 'qs';
import config from '../config/config';
import RequestManager from '../utils/RequestManager';
import {jwtDecode} from 'jwt-decode';
import 'core-js/stable/atob';
import {UtilsTypes} from './types';
import dayjs from 'dayjs';
import {Utils} from '@react-native-firebase/app';

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
  generateQrCodeData: (userKey, deviceKey, certificateKey) => {
    try {
      const sep = config.qrCodeEncryptSeparator;
      const plainText = `${userKey}${sep}${deviceKey}${sep}${certificateKey}${sep}${dayjs().format(
        'YYYY-MM-DD HH:mm:ss',
      )}`;
      const key = deviceKey;
      const encrypted = CryptoJS.AES.encrypt(plainText, key).toString();
      const secondText = `${key}${sep}${encrypted}`;
      return CryptoJS.AES.encrypt(
        secondText,
        config.qrCodeEncryptKey,
      ).toString();
    } catch (e) {
      console.log(e);
    }
  },
  decryptData: ciphertext => {
    const bytesOri = CryptoJS.AES.decrypt(ciphertext, config.qrCodeEncryptKey);
    const secondText = bytesOri.toString(CryptoJS.enc.Utf8);
    const [deviceKey, encrypted] = secondText.split(
      config.qrCodeEncryptSeparator,
    );
    const bytes = CryptoJS.AES.decrypt(encrypted, deviceKey);
    const original = bytes.toString(CryptoJS.enc.Utf8);
    return original.split(config.qrCodeEncryptSeparator);
  },
  getDataFromKey,
  setData,
  formatDef(dayjs) {
    return dayjs.format('YYYY-MM-DD HH:mm:ss');
  },
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
  async clearAll() {
    await this.clearData(UtilsTypes.LAST_NOTIFICATION);
    await this.clearData(UtilsTypes.LAST_BG_NOTIFICATION);
    await this.clearData(UtilsTypes.DATA);
    await this.clearData(UtilsTypes.TOKEN);
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
