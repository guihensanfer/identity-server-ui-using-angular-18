import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent } from "../../components/avatar/avatar.component";
import { SharedDataService } from '../../../services/shared-data.service';
import { TranslocoModule } from '@ngneat/transloco';
import { SeparatorElemComponent } from "../../components/separator-elem/separator-elem.component";

@Component({
  selector: 'app-by-password',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent, TranslocoModule, SeparatorElemComponent],
  templateUrl: './by-password.component.html',
  styleUrl: './by-password.component.css'
})
export class ByPasswordComponent implements AfterViewInit {
  constructor(
    public sharedData:SharedDataService
  ) {
    if(!this.sharedData.userInfo)
      this.sharedData.goStep(-1, '#OTP230724-1832');
    
  }  
  ngAfterViewInit(): void {
    document.getElementById('passwordField')?.focus();
  }

  

  public myGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.maxLength(300)])    
  });

   

  onSubmit():void{

  }

}
