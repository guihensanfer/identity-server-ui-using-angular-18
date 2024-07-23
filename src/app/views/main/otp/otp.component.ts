import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SeparatorElemComponent } from "../../components/separator-elem/separator-elem.component";
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../../services/loading.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { OtpPost, OtpResp } from '../../../interfaces/auth/auth-interfaces';
import { RespDefault } from '../../../interfaces/default-interfaces';
import { GetUserInfoResp } from '../../../interfaces/oauth/oauth-interfaces';
import { OauthService } from '../../../services/oauth/oauth.service';
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [SeparatorElemComponent, TranslocoModule,ReactiveFormsModule,CommonModule],
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
  //codeOtp: string | null = null;
  //userInfo: GetUserInfoResp | null = null;


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
            this.sharedData.goStep(-1);
          }

          this.loading.hideLoading();
        },
        error: () => {
          // show error
          this.sharedData.goStep(-1);

          this.loading.hideLoading();
        }
      });

  }

  resendEmail():void{
    this.otpRequest();

    this.sentByDemand = true;
    this.myGroup.reset();    
  }

  ngAfterViewInit(): void {
    document.getElementById('i1')?.focus()
  }

  onSubmit():void{
    this.loading.showLoading();

    if(this.sharedData.codeOtp){
      // Implement here the login with code and number code, then call the line below:      
      this.oAuth.getUserInfo(this.sharedData.codeOtp).subscribe({
        next : (resp : RespDefault<GetUserInfoResp>) => {
          if(resp){
            console.log(resp.data);
            if(resp.success){
              this.sharedData.userInfo = resp.data;
              this.sharedData.goStep(2);
            }
            else
            {
              this.loading.hideLoading();    
              this.sharedData.goStep(-1);
              
            }
          }
        }
      });
    }
    else{
      this.loading.hideLoading();    
      this.sharedData.goStep(-1);
        
    }
  }
}
