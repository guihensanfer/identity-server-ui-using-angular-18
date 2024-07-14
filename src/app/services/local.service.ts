import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

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
}
