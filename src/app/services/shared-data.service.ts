import { Injectable } from '@angular/core';
import { GetContextResp, GetUserInfoResp } from '../interfaces/oauth/oauth-interfaces';
import { RespDefault } from '../interfaces/default-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

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
  public errorAPIDescriptions: string[] | null = null;


  public goStep(step:number, errorCode:string | null = null, errorObjAPIResult: any | null = null):void {    
    this.step = step;
    this.errorCode = errorCode;
    this.errorAPIDescriptions = null;

    if(errorObjAPIResult){
      if (errorObjAPIResult.error) {
        try {          
          const apiResponse: RespDefault<any> = errorObjAPIResult.error;

          if(apiResponse && apiResponse.errors && apiResponse.errors.length > 0){
            this.errorAPIDescriptions = apiResponse.errors;
          }
                    
        } catch (e) {
          console.error('(errorInterceptor) Error deserializing the error response:', e);          
        }
      }      
    }
    
  }

  public generateCallbackUrl(userInfoCode: string | null = null):string{
    if(!this.context)
      return '';

    if(!userInfoCode || userInfoCode === null || userInfoCode === '')
      return this.context!.clientCallbackUrl;

    return this.context!.clientCallbackUrl + '?userInfoCode=' + userInfoCode;
  }

  public generateForgetPasswordPath(userEmail:string,currentLang:string, currentSecret:string, redirectUrl: string | null = null):string{
    if(!this.context)
      return '';    

    let redirectUrlParm = '';

    if(redirectUrl){
      redirectUrlParm = `&${this.RESET_PASSWD_FLOW_REDIRECT_URL_QUERY}=${redirectUrl}`;
    }

    return `${currentLang}/sso/${currentSecret}?${this.IS_RESET_PASSWD_FLOW_QUERY}=true&${this.USER_EMAIL_QUERY}=${userEmail}${redirectUrlParm}`;
  }
}