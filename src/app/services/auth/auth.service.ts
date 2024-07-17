import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespDefault } from '../../interfaces/default-interfaces';
import { Observable } from 'rxjs';
import { AuthPost, AuthResp } from '../../interfaces/auth/auth-interfaces';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { LocalService } from '../local.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private local: LocalService) {}  

  private firstLogin(data: AuthPost): Observable<RespDefault<AuthResp>> {     
    return this.http.post<RespDefault<AuthResp>>(environment.bomdevApiUrl + '/api/v1/auth/login', data);
  } 

  private refreshLogin(refreshToken: string): Observable<RespDefault<AuthResp>> {     
    const data: AuthPost = {
      continueWithToken: refreshToken,
      email: "",
      password: "",
      projectId: 0
    };

    return this.http.post<RespDefault<AuthResp>>(environment.bomdevApiUrl + '/api/v1/auth/login', data);
  }     

  private isTokenExpired(dateExpires: Date): boolean {
    return new Date() > dateExpires;
  }

  public async getAuthToken(): Promise<AuthResp | null> {        
    let result: AuthResp | null = null;
    const localTokens = this.local.getAuthStoraged();    

    // Check if already authenticated            
    if(localTokens && localTokens.accessToken) {
      if(!this.isTokenExpired(new Date(localTokens.accessExpiredAt))) {        
        return localTokens;
      } else if(localTokens.refreshToken && !this.isTokenExpired(new Date(localTokens.refreshExpiredAt))) {
        try {
          const res = await lastValueFrom(this.refreshLogin(localTokens.refreshToken));
          if(res.success) {            
            result = res.data;            
          }
        } catch (err) {
          console.log('refreshToken Error', err);
        }
      }
    }

    if (!result) {
      const data: AuthPost = {
        email: environment.emailSU,
        password: environment.passwordSU,
        projectId: environment.defaultProjectId,
        continueWithToken: ''
      };
      
      try {
        const res = await lastValueFrom(this.firstLogin(data));
        if(res.success) {
          result = res.data;          
        }
      } catch (err) {
        console.log('firstLogin Error', err);
      }
    }

    // Update local storage
    this.local.setAuthStorage(result);    

    return result;
  }
}
