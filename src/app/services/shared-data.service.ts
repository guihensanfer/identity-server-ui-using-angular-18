import { Injectable } from '@angular/core';
import { GetContextResp, GetUserInfoResp } from '../interfaces/oauth/oauth-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }  

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

  public generateCallbackUrl(userInfoCode: string):string{
    if(!this.context)
      return '';

    return this.context!.clientCallbackUri + '?userInfoCode=' + userInfoCode;
  }
}