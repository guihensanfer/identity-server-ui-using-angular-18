import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespDefault } from '../../interfaces/default-interfaces';
import { Observable } from 'rxjs';
import { AuthPost, AuthResp } from '../../interfaces/auth/auth-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

    this.getStoredTokens();
  }

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private accessTokenExpiresAt: Date | null = null;
  private refreshTokenExpiresAt: Date | null = null;


  private firstLogin(data: AuthPost): Observable<RespDefault<AuthResp>>{     
    return this.http.post<RespDefault<AuthResp>>(environment.bomdevApiUrl + '/api/v1/auth/login', data);
  } 

  private refreshLogin(refreshToken:string): Observable<RespDefault<AuthResp>>{     
    const data: AuthPost = {
      continueWithToken: refreshToken,
      email:"",
      password: "",
      projectId: 0
    };

    return this.http.post<RespDefault<AuthResp>>(environment.bomdevApiUrl + '/api/v1/auth/login', data);
  } 

  private storeTokens(accessToken: string, refreshToken: string, accessTokenExpiresAt: Date, refreshTokenExpiresAt:Date): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt.toISOString());
    localStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt.toISOString());
  }

  private getStoredTokens(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');    
    const accessTokenExpiresAtStr = localStorage.getItem('accessTokenExpiresAt');
    const refreshTokenExpiresAtStr = localStorage.getItem('refreshTokenExpiresAt');
    if (accessTokenExpiresAtStr) {
      this.accessTokenExpiresAt = new Date(accessTokenExpiresAtStr);
    }
    if (refreshTokenExpiresAtStr) {
      this.refreshTokenExpiresAt = new Date(refreshTokenExpiresAtStr);
    }
  }

  private isAccessTokenExpired(): boolean {
    return !this.accessTokenExpiresAt || new Date() > this.accessTokenExpiresAt;
  }

  private isRefreshTokenExpired(): boolean {
    return !this.refreshTokenExpiresAt || new Date() > this.refreshTokenExpiresAt;
  }


  public login(): string {
    let usingRefreshToken = false;
    let resultAccessToken = '';    

    // Update the data
    this.getStoredTokens();
    
    // check if already authenticated            
    if(this.accessToken){

      if(!this.isAccessTokenExpired())
        return this.accessToken;

      if(this.refreshToken && !this.isRefreshTokenExpired())
        usingRefreshToken = true;
    }

    if(usingRefreshToken){
      this.refreshLogin(this.refreshToken!).subscribe({
        next : (res : RespDefault<AuthResp>) => {
          if(res.success == true){
            this.storeTokens(res.data.accessToken, res.data.refreshToken, res.data.accessExpiredAt, res.data.refreshExpiredAt);

            resultAccessToken = res.data.accessToken;
          }
          
        },
        error : (err) => {
          console.log('refreshToken Error');
          console.log(err);
        }
      });
    }
    else
    {
      const data : AuthPost = {
        email : environment.emailSU,
        password:environment.passwordSU,
        projectId: environment.defaultProjectId,
        continueWithToken: ''
      };
      
      this.firstLogin(data).subscribe({
        next : (res : RespDefault<AuthResp>) => {
          if(res.success == true){
            this.storeTokens(res.data.accessToken, res.data.refreshToken, res.data.accessExpiredAt, res.data.refreshExpiredAt);

            resultAccessToken = res.data.accessToken;
          }
          
        },
        error : (err) => {
          console.log('firstLogin Error');
          console.log(err);
        }
      });
    }

    console.log(resultAccessToken);

    return resultAccessToken;
  }
}
