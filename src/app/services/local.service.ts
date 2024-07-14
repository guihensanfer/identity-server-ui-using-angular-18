import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResp } from '../interfaces/auth/auth-interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  public ACCESS_TOKEN_SECRET_NAME = 'orYQmZGYgcdR';
  public ACCESS_TOKEN_SECRET_TOKEN = 'bNSodIjmHRnXQWAUziBXxZqsFoR';

  public REFRESH_TOKEN_SECRET_NAME = 'TuhjbpBqUpmy';
  public REFRESH_TOKEN_SECRET_TOKEN = 'JByzdiqCmsgkcXLFvnqjYmCOoNZ';
  
  public ACCESS_TOKEN_EXPIRES_AT_SECRET_NAME = 'VLWkGxDxJjga';
  public ACCESS_TOKEN_EXPIRES_AT_SECRET_TOKEN = 'MXWYglCejiYaaPrUqZWPcgqjbHu';

  public REFRESH_TOKEN_EXPIRES_AT_SECRET_NAME = 'PwrMZOeTNstg';
  public REFRESH_TOKEN_EXPIRES_AT_SECRET_TOKEN = 'YFpQJCMOzwnpxyCuMQLGNwzgpjQ';

  private encrypt(txt: string): string {
    // const token = jwt.sign({ data: txt }, environment.localEncryptKey);
    
    return txt;
  }  
  
  private decrypt(token: string): string {
    try {
      // const decoded = jwt.verify(token, environment.localEncryptKey);
      const decoded = '';
      // return (decoded as any).data;
      return token;
    } catch (err) {
      console.error('Error decrypting token:', err);
      return '';
    }
  }

  public saveData(key: string, value: string): void {
    localStorage.setItem(key, this.encrypt(value));
  }  
  
  public getData(key: string): string {
    const data = localStorage.getItem(key) || "";
    return this.decrypt(data);
  }
  
  public removeData(key: string): void {
    localStorage.removeItem(key);
  }  
  
  public clearAllData(): void {
    localStorage.clear();
  }    

  public isAuthStoraged():boolean{
    const accessToken = this.getData(this.ACCESS_TOKEN_SECRET_NAME);
    const refreshToken = this.getData(this.REFRESH_TOKEN_SECRET_NAME);
    
    if(accessToken && accessToken !== '' && refreshToken && refreshToken !== '')
      return true;

    return false;
  }

  public getAuthStoraged(): AuthResp{
    const localTokens: AuthResp = {
      accessExpiredAt:  new Date(this.getData(this.ACCESS_TOKEN_EXPIRES_AT_SECRET_NAME)),
      accessToken: this.getData(this.ACCESS_TOKEN_SECRET_NAME),
      refreshExpiredAt: new Date(this.REFRESH_TOKEN_EXPIRES_AT_SECRET_NAME),
      refreshToken: this.getData(this.REFRESH_TOKEN_SECRET_NAME),
      userInfoCode:'',
      userInfoCodeExpiredAt: new Date()
    };

    return localTokens;
  }

  public setAuthStorage(data: AuthResp | null):void{
    if(data){
      this.saveData(this.ACCESS_TOKEN_SECRET_NAME, data.accessToken);
      this.saveData(this.ACCESS_TOKEN_EXPIRES_AT_SECRET_NAME, data.accessExpiredAt.toString());
      this.saveData(this.REFRESH_TOKEN_SECRET_NAME, data.refreshToken);
      this.saveData(this.REFRESH_TOKEN_EXPIRES_AT_SECRET_NAME, data.refreshExpiredAt.toString());
    }    
  }
}
