import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespDefault } from '../../interfaces/default-interfaces';
import { Observable } from 'rxjs';
import { AuthPost, AuthResp, OtpPost, OtpResp } from '../../interfaces/auth/auth-interfaces';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { LocalService } from '../local.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private local: LocalService) {}  

  static LOGIN_ENDPOINT_PATH: string = '/api/v1/auth/login';

  public loginFullReq(data: AuthPost): Observable<RespDefault<AuthResp>> {     
    return this.http.post<RespDefault<AuthResp>>(environment.bomdevApiUrl + '/api/v1/auth/login', data);
  } 

  private isTokenExpired(dateExpires: Date): boolean {
    return new Date() > dateExpires;
  }

  // You can use this method for refresh token, OTP or external login redirected
  public loginWithCode(code: string, codePassword:string | null = null): Observable<RespDefault<AuthResp>> {     
    const data: AuthPost = {
      continueWithCode: code,
      codePassword : codePassword,
      email: null,
      password: null,
      projectId: null     
    };

    return this.loginFullReq(data);    
  }     


  // Return the best way login for the current context.
  public async login(): Promise<AuthResp | null> {        

    // Prevent unnecessarily requests
    if(!this.local.isLocalStorageAvailable())
      return null;    
    
    

    let result: AuthResp | null = null;    
    const localTokens = this.local.getAuthStoraged();        

    // Check if already authenticated            
    if(localTokens && localTokens.accessToken) {
      if(!this.isTokenExpired(new Date(localTokens.accessExpiredAt))) {        
        return localTokens;
      } else if(localTokens.refreshToken && !this.isTokenExpired(new Date(localTokens.refreshExpiredAt))) {
        try {
          console.log('loginWithCode');
          const res = await lastValueFrom(this.loginWithCode(localTokens.refreshToken));
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
        projectId: environment.defaultProjectId        ,
        continueWithCode:null,
        codePassword:null
      };
      
      try {
        console.log('firstLogin');
        const res = await lastValueFrom(this.loginFullReq(data));
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

  public otp(data:OtpPost): Observable<RespDefault<OtpResp>>{    
    return this.http.post<RespDefault<OtpResp>>(`${environment.bomdevApiUrl}/api/v1/auth/otp`, data);
  }   
}
