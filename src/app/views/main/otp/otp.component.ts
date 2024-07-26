import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SeparatorElemComponent } from "../../components/separator-elem/separator-elem.component";
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../../services/loading.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthResp, OtpPost, OtpResp } from '../../../interfaces/auth/auth-interfaces';
import { RespDefault } from '../../../interfaces/default-interfaces';
import { GetUserInfoResp } from '../../../interfaces/oauth/oauth-interfaces';
import { OauthService } from '../../../services/oauth/oauth.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { AlertComponent } from "../../components/alert/alert.component";

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [SeparatorElemComponent, TranslocoModule, ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements AfterViewInit, OnInit {
  constructor(
    private loading:LoadingService,
    private auth:AuthService,
    private oAuth: OauthService,
    public sharedData: SharedDataService
  ){

    if(!this.sharedData.emailLogin || !this.sharedData.context || !this.sharedData.context.projectId || this.sharedData.context.projectId <= 0)
      this.sharedData.goStep(-1);
  }    
  

  public myGroup = new FormGroup({
    i1: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")]),
    i2: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")]),
    i3: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")]),
    i4: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")])
  });
  sentByDemand: boolean = false;
  invalidNumberCode:boolean = false;

  ngOnInit(): void {
    
    this.otpRequest();

  }

  inputKeyUp(event: Event):void{
    const element = event.target as HTMLInputElement;
        
    if(element){      
      if(element.value.length >= 1){
        const currentInputIndex = parseInt(element.id.replace('i', ''));
        const nextInputIndex = currentInputIndex + 1;
        const nextInputId = 'i' + nextInputIndex.toString();        
        const nextInput = document.getElementById(nextInputId);
        
        if(nextInput){
          nextInput.focus();
        }
        else
        {
          document.getElementById('sendButton')?.focus();
        }

        this.invalidNumberCode = false;
      }
    }
  }

  otpRequest():void{
    this.loading.showLoading();    
    
    const data: OtpPost = {
      email: this.sharedData.emailLogin!,
      projectId: this.sharedData.context!.projectId      
    };

    this.sharedData.codeOtp = null;

    this.auth.otp(data)
      .subscribe({
        next: (resp : RespDefault<OtpResp>) => {          
          if(resp && resp.success){
            console.log('code', resp.data.code);
            this.sharedData.codeOtp = resp.data.code;
          }
          else{
            // show error
            this.sharedData.goStep(-1, '#OTP230724-1649');
          }

          this.loading.hideLoading();
        },
        error: () => {
          // show error
          this.sharedData.goStep(-1, '#OTP230724-1650');

          this.loading.hideLoading();
        }
      });

  }

  resendEmail():void{
    this.otpRequest();

    this.sentByDemand = true;
    this.myGroup.reset();    
    const form = window.document.getElementById('formCode');
    if(form){
      form.style.display = 'block';
      document.getElementById('i1')?.focus();
    }
    
    this.invalidNumberCode = false;    
  }

  ngAfterViewInit(): void {
    document.getElementById('i1')?.focus();
  }

  getNumberCodeFromView():number{
    return parseInt(`${this.myGroup.controls.i1.value}${this.myGroup.controls.i2.value}${this.myGroup.controls.i3.value}${this.myGroup.controls.i4.value}`);
  }

  onSubmit():void{
    const numberCode = this.getNumberCodeFromView();
    this.loading.showLoading();

    if(this.sharedData.codeOtp && numberCode > -1){      

      this.auth.loginWithCode(this.sharedData.codeOtp, numberCode.toString())
        .subscribe({
          next : (resp : RespDefault<AuthResp>) => {
            if(resp && resp.success){
              this.oAuth.getUserInfo(resp.data.userInfoCode).subscribe({
                next : (resp : RespDefault<GetUserInfoResp>) => {
                  if(resp){                    
                    if(resp.success){
                      this.sharedData.userInfo = resp.data;
                      this.sharedData.goStep(2);
                    }
                    else
                    {
                      this.loading.hideLoading();    
                      this.sharedData.goStep(-1, '#OTP230724-1648');
                      
                    }


                  }


                },
                error: () => {
                  this.sharedData.goStep(-1, '#OTP240724-1502');
                  this.loading.hideLoading();    
                },
                complete:() =>{
                  this.loading.hideLoading();    
                }

              });
            }
          },
          error : () => {
            this.invalidNumberCode = true;
            this.myGroup.reset();
            const form = window.document.getElementById('formCode');
            if(form){
              form.style.display = 'none';
            }
            this.loading.hideLoading();
            document.getElementById('i1')?.focus();
          },
          complete:()=>{
            this.loading.hideLoading();
          }
        });    
      
    }
    else{
      this.loading.hideLoading();    
      this.sharedData.goStep(-1, '#OTP230724-1647');
        
    }
  }
}
