import { Component } from '@angular/core';
import { SsoComponent } from '../sso/sso.component';
import { GetUserInfoResp } from '../interfaces/oauth/oauth-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent } from "../avatar/avatar.component";
import { OtpComponent } from '../otp/otp.component';

@Component({
  selector: 'app-by-password',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent],
  templateUrl: './by-password.component.html',
  styleUrl: './by-password.component.css'
})
export class ByPasswordComponent {
  constructor(private sso: SsoComponent,
    public otp: OtpComponent
  ) {
    if(!this.userInfo)
      this.goStep(-1);

    this.userInfo = otp.userInfo;
  }  

  userInfo: GetUserInfoResp | null = null;
  initials: string = '';
  public myGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.maxLength(300)])    
  });

 

  goStep(step:number):void {
    this.sso.step = step;
  }

  onSubmit():void{

  }

}
