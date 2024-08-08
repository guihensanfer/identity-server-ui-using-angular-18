import { Injectable } from '@angular/core';
import { GetContextResp, GetUserInfoResp } from '../interfaces/oauth/oauth-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }  

  public readonly IS_RESET_PASSWD_FLOW_QUERY: string = 'reset_passwd_flow';
  public readonly RESET_PASSWD_FLOW_REDIRECT_URL_QUERY: string = 'reset_passwd_redirect_url';
  public readonly USER_EMAIL_QUERY: string = 'user_email'; 

  // Sso step
  public context: GetContextResp | null = null;
  public emailLogin:string | null = null;  
  public step : number = 0;

  // Otp step
  public userInfo: GetUserInfoResp | null = null;
  public codeOtp: string | null = null;

  public errorCode: string | null = null;


  public goStep(step:number, errorCode:string | null = null):void {    
    this.step = step;
    this.errorCode = errorCode;
  }

  public generateCallbackUrl(userInfoCode: string | null = null):string{
    if(!this.context)
      return '';

    if(!userInfoCode || userInfoCode === null || userInfoCode === '')
      return this.context!.clientCallbackUrl;

    return this.context!.clientCallbackUrl + '?userInfoCode=' + userInfoCode;
  }
}