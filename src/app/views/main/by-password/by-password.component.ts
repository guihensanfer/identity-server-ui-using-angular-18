import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent } from "../../components/avatar/avatar.component";
import { SharedDataService } from '../../../services/shared-data.service';
import { TranslocoModule } from '@ngneat/transloco';
import { SeparatorElemComponent } from "../../components/separator-elem/separator-elem.component";
import { AuthService } from '../../../services/auth/auth.service';
import { AuthPost, AuthResp, ResetPasswordPut } from '../../../interfaces/auth/auth-interfaces';
import { RespDefault } from '../../../interfaces/default-interfaces';
import { LoadingService } from '../../../services/loading.service';
import { AlertComponent } from "../../components/alert/alert.component";
import { CommonModule } from '@angular/common';
import { passwordMatchValidator, passwordStrengthValidator } from '../../../validators/passwords-validator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-by-password',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent, TranslocoModule, SeparatorElemComponent, AlertComponent, CommonModule],
  templateUrl: './by-password.component.html',
  styleUrl: './by-password.component.css'
})
export class ByPasswordComponent implements AfterViewInit, OnInit {
  constructor(
    public sharedData:SharedDataService,
    private auth : AuthService,
    private loading: LoadingService,
    private route: ActivatedRoute,
  ) {
    if(!this.sharedData.userInfo || !this.sharedData.userInfo.userInfo || this.sharedData.userInfo.userInfo.userId <= 0)
      this.sharedData.goStep(-1, '#PASSWD230724-1832');

    this.resetPasswordFlow = this.sharedData.userInfo!.userInfo.isPasswordEmpty;    
    
  }  
  
  invalidPassword : boolean = false;
  successPassword:boolean = false;
  resetPasswordFlow:boolean = false;
  passwordsDoNotMatch:boolean = false;
  passwordStrengt:boolean = false;
  redirectUrlForResetPasswd: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectUrlForResetPasswd = params[this.sharedData.RESET_PASSWD_FLOW_REDIRECT_URL_QUERY];
    });
  }

  ngAfterViewInit(): void {
    if(this.resetPasswordFlow){
      document.getElementById('newPasswordField')?.focus();
    }
    else
    {
      document.getElementById('passwordField')?.focus();
    }    
  }

  

  public myGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.maxLength(300)])    
  });

  public resetPasswordGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.maxLength(300)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(300)])
  }, 
  { 
    validators: [
      passwordMatchValidator('newPassword', 'confirmPassword'), 
      passwordStrengthValidator(this.sharedData.context?.projectPasswordStrengthRegex ?? '', 'newPassword')
    ]
  });


  textChanged(){
    this.invalidPassword = false;
    this.successPassword = false;    
  }

  textChangedResetPasswdFlow(){
    this.passwordsDoNotMatch = this.resetPasswordGroup.errors && this.resetPasswordGroup.errors['passwordMismatch'];
    this.passwordStrengt = this.resetPasswordGroup.errors && this.resetPasswordGroup.errors['weakPassword'];
  }

  onSubmit():void{
    if(this.myGroup.controls.password.valid && !this.myGroup.errors){
      this.loading.showLoading();
      const password = this.myGroup.controls.password.value;

      const data: AuthPost = {
        continueWithCode: null,
        codePassword : null,
        email: this.sharedData.emailLogin,
        password: password,
        projectId: this.sharedData.context!.projectId     
      };
  

      this.auth.loginFullReq(data)
      .subscribe({
        next : (resp : RespDefault<AuthResp>) => {
          if(resp && resp.success && resp.data){
            const callbackUrl = this.sharedData.generateCallbackUrl(resp.data.userInfoCode);
            
            this.successPassword = true; 
            this.myGroup.controls.password.disable();

            
            // Callback redirect
            window.location.href  = callbackUrl;

          }
        },
        error : (err) => {            
          if(err && err.error?.statusCode === 401){
            this.invalidPassword = true;        
            document.getElementById('password')?.focus();
                      
          }                  

          if(err && err.error?.errors && err.error?.errors.length > 0){            
            this.sharedData.goStep(-1, '#260724-1459', err);
          }
          
          this.loading.hideLoading();          
        }
      });    
    
    }
  }

  onSubmitResetPasswdFlow():void{
    if(!this.resetPasswordGroup.errors && !this.passwordsDoNotMatch){
      this.loading.showLoading();

      const data: ResetPasswordPut = {
        code: this.sharedData.userInfo!.operations.resetPasswordQuickly.code,
        newPassword: this.resetPasswordGroup.controls.confirmPassword.value!.toString()
      };

      this.auth.resetPassword(data)
      .subscribe({
        next : (resp : RespDefault<null>) => {
          if(resp && resp.success){
            // Reset was succefully            
            // Callback redirect            
            window.location.href  = this.redirectUrlForResetPasswd ?? this.sharedData.generateCallbackUrl();

            this.successPassword = true; 
            this.myGroup.controls.password.disable();

          }
          else
          {
            this.sharedData.goStep(-1, '#070824-1834');
          }
        },
        error : (err) => {            
          this.sharedData.goStep(-1, '#070824-1836', err);
          this.loading.hideLoading();          
        }
      });  
    }
  }

  forgetMyPasswordClick():void{
    window.location.href = this.sharedData.generateForgetPasswordPath(
      this.sharedData.emailLogin!.toString(),
      this.route.snapshot.paramMap.get('lang')!.toString(),
      this.route.snapshot.paramMap.get('secret')!.toString(),
      this.redirectUrlForResetPasswd
    );
  }
}
