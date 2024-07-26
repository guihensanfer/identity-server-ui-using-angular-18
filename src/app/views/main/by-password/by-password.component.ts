import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent } from "../../components/avatar/avatar.component";
import { SharedDataService } from '../../../services/shared-data.service';
import { TranslocoModule } from '@ngneat/transloco';
import { SeparatorElemComponent } from "../../components/separator-elem/separator-elem.component";
import { AuthService } from '../../../services/auth/auth.service';
import { AuthPost, AuthResp } from '../../../interfaces/auth/auth-interfaces';
import { RespDefault } from '../../../interfaces/default-interfaces';
import { LoadingService } from '../../../services/loading.service';
import { AlertComponent } from "../../components/alert/alert.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-by-password',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent, TranslocoModule, SeparatorElemComponent, AlertComponent, CommonModule],
  templateUrl: './by-password.component.html',
  styleUrl: './by-password.component.css'
})
export class ByPasswordComponent implements AfterViewInit {
  constructor(
    public sharedData:SharedDataService,
    private auth : AuthService,
    private loading: LoadingService
  ) {
    if(!this.sharedData.userInfo)
      this.sharedData.goStep(-1, '#PASSWD230724-1832');
    
  }  
  invalidPassword : boolean = false;
  successPassword:boolean = false;


  ngAfterViewInit(): void {
    document.getElementById('passwordField')?.focus();
  }

  

  public myGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.maxLength(300)])    
  });

  textChanged(){
    this.invalidPassword = false;
    this.successPassword = false;    
  }

  onSubmit():void{
    if(this.myGroup.controls.password.valid){
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
          console.log(resp);
          if(resp && resp.success && resp.data){
            const callbackUrl = this.sharedData.context?.clientCallbackUri + '?userInfoCode=' + resp.data.userInfoCode;
            
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
          else
          {
            this.sharedData.goStep(-1, '#260724-1459');
          }
          
          this.loading.hideLoading();          
        }
      });    
    
    }
  }

}
