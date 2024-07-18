import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { SeparatorElemComponent } from '../separator-elem/separator-elem.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OauthService } from '../services/oauth/oauth.service';
import { CheckEmailExistsPost, CheckEmailExistsResp, GetContextResp } from '../interfaces/oauth/oauth-interfaces';
import { LoadingService } from '../services/loading.service';
import { RespDefault } from '../interfaces/default-interfaces';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { ErrorComponent } from "../error/error.component";
import { OtpComponent } from "../otp/otp.component";

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [TranslocoModule, CommonModule, RouterLink, RouterLinkActive, SeparatorElemComponent, ReactiveFormsModule, FormsModule, ErrorComponent, OtpComponent],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.css'
})
export class SsoComponent  implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translocoService: TranslocoService,
    private oAuthService:OauthService,
    private authService: AuthService, 
    private _loading:LoadingService
  ) {}


  public myGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.email])   
  });
  nextButtonDisabled: boolean = true;
  emailFound:boolean = false;
  public context: GetContextResp | null = null;
  step : number = 0;
  emailLogin: string | null = null;
  

  ngOnInit(): void {    
      const lang = this.route.snapshot.paramMap.get('lang');
      const secret = this.route.snapshot.paramMap.get('secret');      
      this._loading.showLoading();
      
      if (lang && secret) {
        this.translocoService.setActiveLang(lang);

        this.oAuthService.getContext(secret).subscribe(
          {
            next: (res) => {
              
              if(res && res.success){
                this.context = res.data;                                      
              }                  
              
            },
            error : (err) => {
              if(err && err.error.success && err.error.data === null){
                // Context not found
              } 

              this.step = -1;
              this._loading.hideLoading();    
            },
            complete: () => {              
              this._loading.hideLoading();
            }
          }
        );
      } else {        
        this.step = -1;
      }  

      
  }

  onSubmit() {
    this.step = 1;
    this.emailLogin = this.myGroup.controls.email.value;
  }  

  onChange(event: Event){
    

    if(this.myGroup.controls.email.valid){
      this._loading.showLoading();
      const element = event.target as HTMLInputElement;
      
                      
      this.authService.getAuthToken().then((auth) => {
        
        if(auth){
          const data: CheckEmailExistsPost = {
            email: element.value.trim(),
            enabled: null,
            projectId: environment.defaultProjectId
          };

          this.oAuthService.userEmailExists(data, auth.accessToken)
          .subscribe({
              next :  (res : RespDefault<CheckEmailExistsResp>) => {                
                if(res && res.data?.userExists){
                  this.nextButtonDisabled = false;
                  this.emailFound = true;
                }
                else{
                  this.nextButtonDisabled = true;
                  this.emailFound = false;              
                }                      
              },
              error : (err) => {                                                
                if(err && err.error.success && !err.error.data.userExists){
                  // Email user not found
                  
                  this.nextButtonDisabled = false;
                  this.emailFound = false;                  
                }
                else
                {
                  // Anything error else

                  this.nextButtonDisabled = true;
                  this.emailFound = false;
                }
                
                this._loading.hideLoading();                              
              },
              complete: () => {
                this._loading.hideLoading();
              }          
            }
          );
        }
        
      });

      
    }  
         
  }



}
