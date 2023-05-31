import { User } from '@/features/users/interfaces';
import { getCookie, setCookie } from 'cookies-next';
import crypto  from 'crypto-js';
import CryptoJS from 'crypto-js';

const secretKey = process.env.LOCAL_SECRET as string;

const setEncryptedDataToCookie = (key: string, data: User | string, req?: any, res?: any) => {
    const encryptedData = crypto.AES.encrypt(JSON.stringify(data), secretKey).toString();
     setCookie(key, encryptedData, { req, res });
};

const getEncryptedDataFromCookie = (key: string) => {
    const encryptedData = getCookie(key) as string;
    if(encryptedData) {
        const decryptedData = crypto.AES.decrypt(encryptedData!, secretKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } else {
     return null;
    }
 };

const  secureLocalUtils = {
    setEncryptedDataToCookie,
    getEncryptedDataFromCookie
};

export default secureLocalUtils;