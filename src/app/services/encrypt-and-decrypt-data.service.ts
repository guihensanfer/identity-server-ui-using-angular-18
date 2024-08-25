import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptAndDecryptDataService {

  // Simple encrypt
  static encryptData(data: string, token: string): string {

    return CryptoJS.AES.encrypt(data, token).toString();

  }

  static decryptData(data: string, token: string): string {

    const bytes = CryptoJS.AES.decrypt(data, token);

    return bytes.toString(CryptoJS.enc.Utf8);

  }

  static encryptWithIVData(data: string): string {
    const keyBytes = CryptoJS.enc.Hex.parse(environment.encryptionAESKey);
    const ivBytes = CryptoJS.enc.Hex.parse(environment.encryptionAESIV);

    const encrypted = CryptoJS.AES.encrypt(data, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  }

  // Método para descriptografar os dados
  static decryptWithIVData(encryptedData: string): string {
    const keyBytes = CryptoJS.enc.Hex.parse(environment.encryptionAESKey);
    const ivBytes = CryptoJS.enc.Hex.parse(environment.encryptionAESIV);

    const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData);
    const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }


}
