import { Component } from '@angular/core';
import { SeparatorElemComponent } from "../separator-elem/separator-elem.component";
import { TranslocoModule } from '@ngneat/transloco';
import { SsoComponent } from '../sso/sso.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [SeparatorElemComponent, TranslocoModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
  constructor(public sso:SsoComponent){}

  goStep(step:number):void {
    this.sso.step = step;
  }
}
