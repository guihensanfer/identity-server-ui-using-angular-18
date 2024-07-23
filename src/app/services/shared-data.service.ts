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

  public goStep(step:number):void {
    this.step = step;
  }
}