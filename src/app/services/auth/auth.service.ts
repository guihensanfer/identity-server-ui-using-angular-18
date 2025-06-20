import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespDefault } from '../../interfaces/default-interfaces';
import { Observable } from 'rxjs';
import { AuthPost, AuthResp, ExternalGoogleResp, ForgetPasswordPost, OtpPost, OtpResp, ResetPasswordPut } from '../../interfaces/auth/auth-interfaces';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { LocalService } from '../local.service';
import { EncryptAndDecryptDataService } from '../encrypt-and-decrypt-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private local: LocalService) {}  

  static LOGIN_ENDPOINT_PATH: string = '/api/v1/auth/login';
  static LOGIN_EXTERNAL_GOOGLE_REDIRECT = '/api/v1/auth/login/external/redirect';

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
      passwordEncrypted: null,
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
        passwordEncrypted: EncryptAndDecryptDataService.encryptWithIVData(environment.passwordSU),
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

  public async loginUsingGoogle(): Promise<string> {
    let urlToRedirect = `${environment.bomdevApiUrl}${AuthService.LOGIN_EXTERNAL_GOOGLE_REDIRECT}`;
  
    try {
      const response = await lastValueFrom(this.http.get<RespDefault<ExternalGoogleResp>>(
        `${environment.bomdevApiUrl}/api/v1/auth/login/external/google`
      ));
        
      if (response.success && response.statusCode === 200) {
        urlToRedirect += `?codeForRedirect=${response.data.codeForRedirect}`;

        return urlToRedirect;
      } else {
        throw new Error('#SERV280724-1932');
      }
    } catch (err) {      
      throw new Error('#SERV280724-1933');
    }
  }

  public resetPassword(data:ResetPasswordPut): Observable<RespDefault<null>>{    
    return this.http.put<RespDefault<null>>(`${environment.bomdevApiUrl}/api/v1/auth/reset-password`, data);
  }    
}
