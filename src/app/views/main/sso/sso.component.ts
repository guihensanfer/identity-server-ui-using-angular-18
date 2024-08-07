import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { SeparatorElemComponent } from '../../components/separator-elem/separator-elem.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OauthService } from '../../../services/oauth/oauth.service';
import { CheckEmailExistsPost, CheckEmailExistsResp } from '../../../interfaces/oauth/oauth-interfaces';
import { LoadingService } from '../../../services/loading.service';
import { RespDefault } from '../../../interfaces/default-interfaces';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { ErrorComponent } from "../../components/error/error.component";
import { OtpComponent } from "../otp/otp.component";
import { ByPasswordComponent } from "../by-password/by-password.component";
import { SharedDataService } from '../../../services/shared-data.service';
import { SlideIndicatorComponent } from "../../components/slide-indicator/slide-indicator.component";
import { AvatarComponent } from "../../components/avatar/avatar.component";

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [TranslocoModule, CommonModule, RouterLink, RouterLinkActive, SeparatorElemComponent, ReactiveFormsModule, FormsModule, ErrorComponent, OtpComponent, ByPasswordComponent, SlideIndicatorComponent, AvatarComponent],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.css'
})
export class SsoComponent  implements OnInit, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private oAuthService:OauthService,    
    private auth:AuthService,
    private _loading:LoadingService,
    public sharedData:SharedDataService
  ) {}
 


  public myGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.email])   
  });
  nextButtonDisabled: boolean = true;
  emailFound:boolean = false;   
  resetPasswordFlow:boolean = false;   
  ngAfterViewInit(): void {
    if(typeof document !== 'undefined'){
      const emailElement = document.getElementById('email');

      if(emailElement){
        if(this.resetPasswordFlow){
          const requestEmail = this.route.snapshot.paramMap.get('user_email')?.toString();
          setTimeout(() =>{
            if(requestEmail){
              this.myGroup.controls['email'].setValue(requestEmail);          
              this.emailValidate(requestEmail);
  
            }
          });          
          
        }
  
        emailElement.focus();
      }      


    }
    
  }



  ngOnInit(): void {    
      const lang = this.route.snapshot.paramMap.get('lang');
      const secret = this.route.snapshot.paramMap.get('secret');   
      this.resetPasswordFlow = this.route.snapshot.paramMap.get('reset_password_flow') === 'true';   
      this._loading.showLoading();      
      
      if (lang && secret) {                
        const availableTranslations = ['en-us', 'pt-br'];

        if(!availableTranslations.includes(lang.toLowerCase())){
          this.translocoService.setActiveLang(environment.defaultLanguage);  
        }
        else
        {
          this.translocoService.setActiveLang(lang);  
        }
   
        this.oAuthService.getContext(secret).subscribe(
          {
            next: (res) => {
              
              if(res && res.success){
                this.sharedData.context = res.data;                                      
              }                  
              
            },
            error : (err) => {                 
              if(err && err.error.success && err.error.data === null){
                // Context not found
                
              }        
              
              this.sharedData.goStep(-1, '#SSO260724-1009');
              this._loading.hideLoading();                                                
            },
            complete: () => {              
              this._loading.hideLoading();
            }
          }
        );
      } else {        
        this.sharedData.goStep(-1, '#SSO230724-1652')
      }  

      
  }

  onSubmit() {
    this.sharedData.emailLogin = this.myGroup.controls.email.value!.trim();
    this.sharedData.goStep(1);
  }  

  loginWithGoogle():void{
        
    this.auth.loginUsingGoogle().then((urlToRedirect : string) => {
      window.location.href = urlToRedirect;
    });
    
    
  }
  
  emailValidate(email:string){
    const data: CheckEmailExistsPost = {
      email: email.trim(),
      enabled: null,
      projectId: environment.defaultProjectId
    };

    this.oAuthService.userEmailExists(data)
    .subscribe({
        next :  (res : RespDefault<CheckEmailExistsResp>) => {                
          if(res && res.data?.userExists){
            // User exists

            this.nextButtonDisabled = false;
            this.emailFound = true;
            document.getElementById('sendButton')?.focus();
          }
          else{
            this.nextButtonDisabled = true;
            this.emailFound = false;              
          }                      
        },
        error : () => {      
          this.nextButtonDisabled = false;
          this.emailFound = false;   

          this._loading.hideLoading();                              
        },
        complete: () => {
          this._loading.hideLoading();
        }          
      }
    );
  }

  onChange(event: Event){
    

    if(this.myGroup.controls.email.valid){
      this._loading.showLoading();
      const element = event.target as HTMLInputElement;                            
      
      this.emailValidate(element.value);
    }  
         
  }



}
