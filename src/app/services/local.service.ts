import { Injectable } from '@angular/core';
import { AuthResp } from '../interfaces/auth/auth-interfaces';
import { EncryptAndDecryptDataService } from './encrypt-and-decrypt-data.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {  

  public ACCESS_TOKEN_SECRET_NAME = 'orYQmZGYgcdR';
  public ACCESS_TOKEN_SECRET_TOKEN = 'bNSodIjmHRnXQWAUziBXxZqsFoR';

  public REFRESH_TOKEN_SECRET_NAME = 'TuhjbpBqUpmy';
  public REFRESH_TOKEN_SECRET_TOKEN = 'JByzdiqCmsgkcXLFvnqjYmCOoNZ';
  
  public ACCESS_TOKEN_EXPIRES_AT_SECRET_NAME = 'VLWkGxDxJjga';
  public ACCESS_TOKEN_EXPIRES_AT_SECRET_TOKEN = 'MXWYglCejiYaaPrUqZWPcgqjbHu';

  public REFRESH_TOKEN_EXPIRES_AT_SECRET_NAME = 'PwrMZOeTNstg';
  public REFRESH_TOKEN_EXPIRES_AT_SECRET_TOKEN = 'YFpQJCMOzwnpxyCuMQLGNwzgpjQ';  

  public USER_INFO_EXPIRES_AT_SECRET_NAME = 'CsicjErNEqcuGh';
  public USER_INFO_EXPIRES_AT_SECRET_TOKEN = 'UKutVBptMQQTyewmrZthZRAOYSH';

  public USER_INFO_SECRET_NAME = 'MKpXzoxVTZiVEm';
  public USER_INFO_SECRET_TOKEN = 'MfiuXWjLsLYqdpupKQfgpBMyvQz';

  private DEFAULT_SECRET_TOKEN = 'YNJnXzAgBXLpAKUdBNhfnnahRIZ';

  public isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  public saveData(key: string, value: string, token:string | null = null): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    if(!token){
      token = this.DEFAULT_SECRET_TOKEN;
    }

    localStorage.setItem(key, EncryptAndDecryptDataService.encryptData(value, token));
  }  
  
  public getData(key:string, token:string | null = null): string {
    if (!this.isLocalStorageAvailable()) {
      return '';
    }
    
    if(!token){
      token = this.DEFAULT_SECRET_TOKEN;
    }    

    if(!localStorage)
      return '';

    const data = localStorage.getItem(key) || "";

    if(!data || data === '')
      return data;
    
    return EncryptAndDecryptDataService.decryptData(data, token);
  }
  
  public removeData(key: string): void {
    localStorage.removeItem(key);
  }  
  
  public clearAllData(): void {
    localStorage.clear();
  }    

  public isAuthStoraged():boolean{
    const accessToken = this.getData(this.ACCESS_TOKEN_SECRET_NAME, this.ACCESS_TOKEN_EXPIRES_AT_SECRET_TOKEN);
    const refreshToken = this.getData(this.REFRESH_TOKEN_SECRET_NAME, this.ACCESS_TOKEN_EXPIRES_AT_SECRET_TOKEN);
    
    if(accessToken && accessToken !== '' && refreshToken && refreshToken !== '')
      return true;

    return false;
  }

  public getAuthStoraged(): AuthResp{
    const localTokens: AuthResp = {
      accessExpiredAt:  new Date(this.getData(this.ACCESS_TOKEN_EXPIRES_AT_SECRET_NAME, this.ACCESS_TOKEN_EXPIRES_AT_SECRET_TOKEN)),
      accessToken: this.getData(this.ACCESS_TOKEN_SECRET_NAME,this.ACCESS_TOKEN_SECRET_TOKEN),
      refreshExpiredAt: new Date(this.getData(this.REFRESH_TOKEN_EXPIRES_AT_SECRET_NAME, this.REFRESH_TOKEN_EXPIRES_AT_SECRET_TOKEN)),
      refreshToken: this.getData(this.REFRESH_TOKEN_SECRET_NAME, this.REFRESH_TOKEN_SECRET_TOKEN),
      userInfoCode:this.getData(this.USER_INFO_SECRET_NAME, this.USER_INFO_SECRET_TOKEN),
      userInfoCodeExpiredAt: new Date(this.getData(this.USER_INFO_EXPIRES_AT_SECRET_NAME, this.USER_INFO_EXPIRES_AT_SECRET_TOKEN))
    };

    return localTokens;
  }

  public setAuthStorage(data: AuthResp | null):void{
    if(data){
      this.saveData(this.ACCESS_TOKEN_SECRET_NAME, data.accessToken, this.ACCESS_TOKEN_SECRET_TOKEN);
      this.saveData(this.ACCESS_TOKEN_EXPIRES_AT_SECRET_NAME, data.accessExpiredAt.toString(), this.ACCESS_TOKEN_EXPIRES_AT_SECRET_TOKEN);
      this.saveData(this.REFRESH_TOKEN_SECRET_NAME, data.refreshToken, this.REFRESH_TOKEN_SECRET_TOKEN);
      this.saveData(this.REFRESH_TOKEN_EXPIRES_AT_SECRET_NAME, data.refreshExpiredAt.toString(), this.REFRESH_TOKEN_EXPIRES_AT_SECRET_TOKEN);
      this.saveData(this.USER_INFO_SECRET_NAME, data.userInfoCode, this.USER_INFO_SECRET_TOKEN);
      this.saveData(this.USER_INFO_EXPIRES_AT_SECRET_NAME, data.userInfoCodeExpiredAt.toString(), this.USER_INFO_EXPIRES_AT_SECRET_TOKEN);
    }    
  }
}
