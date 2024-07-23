import { Component } from '@angular/core';
import { GetUserInfoResp } from '../../../interfaces/oauth/oauth-interfaces';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent } from "../../components/avatar/avatar.component";
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-by-password',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent],
  templateUrl: './by-password.component.html',
  styleUrl: './by-password.component.css'
})
export class ByPasswordComponent {
  constructor(
    public sharedData:SharedDataService
  ) {
    if(!this.userInfo)
      this.sharedData.goStep(-1, '#OTP230724-1832');

    this.userInfo = this.sharedData.userInfo;
  }  

  userInfo: GetUserInfoResp | null = null;
  initials: string = '';
  public myGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.maxLength(300)])    
  });

   

  onSubmit():void{

  }

}
