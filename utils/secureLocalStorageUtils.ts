import { User } from '@/features/users/interfaces';
import crypto  from 'crypto-js';
import CryptoJS from 'crypto-js';

 const secretKey = process.env.LOCAL_SECRET as string;

const setEncryptedDataToLocalStorage = (key: string, data: User | string) => {
    const encryptedData = crypto.AES.encrypt(JSON.stringify(data), secretKey).toString();
    window.localStorage.setItem(key, encryptedData);
};

const getDecryptedDataFromLocalStorage = (key: string) => {
   const encryptedData = window.localStorage.getItem(key);
   if(encryptedData) {
       const decryptedData = crypto.AES.decrypt(encryptedData!, secretKey).toString(CryptoJS.enc.Utf8);
       return JSON.parse(decryptedData);
   } else {
    return null;
   }
};
 const secureLocalUtils = {
    setEncryptedDataToLocalStorage,
    getDecryptedDataFromLocalStorage
 };

export default  secureLocalUtils; 