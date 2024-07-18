import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SeparatorElemComponent } from "../separator-elem/separator-elem.component";
import { TranslocoModule } from '@ngneat/transloco';
import { SsoComponent } from '../sso/sso.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [SeparatorElemComponent, TranslocoModule,ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements AfterViewInit {
  constructor(public sso:SsoComponent){}    
  ngAfterViewInit(): void {
    document.getElementById('i1')?.focus()
  }

  public myGroup = new FormGroup({
    i1: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")]),
    i2: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")]),
    i3: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")]),
    i4: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]*$")])
  });

  onSubmit():void{
    
  }

  goStep(step:number):void {
    this.sso.step = step;
  }
}
