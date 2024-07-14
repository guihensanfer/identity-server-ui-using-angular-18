import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptAndDecryptDataService {

  public encryptData(data: string, token: string): string {

    return CryptoJS.AES.encrypt(data, token).toString();

  }

  public decryptData(data: string, token: string): string {

    const bytes = CryptoJS.AES.decrypt(data, token);

    return bytes.toString(CryptoJS.enc.Utf8);

  }
}
