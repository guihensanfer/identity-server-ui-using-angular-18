import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { SeparatorElemComponent } from '../separator-elem/separator-elem.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OauthService } from '../services/oauth/oauth.service';
import { RespCheckEmailExists } from '../interfaces/oauth/oauth-interfaces';
import { LoadingService } from '../services/loading.service';
import { RespDefault } from '../interfaces/default-interfaces';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [TranslocoModule, CommonModule, RouterLink, RouterLinkActive, SeparatorElemComponent, ReactiveFormsModule,FormsModule],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.css'
})
export class SsoComponent  implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translocoService: TranslocoService,
    private oAuthService:OauthService,
    public _loading:LoadingService
  ) {}


  public myGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.email])   
  });
  nextButtonDisabled: boolean = true;
  emailFound:boolean = false;

  ngOnInit(): void {    
      const lang = this.route.snapshot.paramMap.get('lang');
      
      if (lang) {
        this.translocoService.setActiveLang(lang);
      } else {
        // Redireciona para o idioma padrão se não houver parâmetro de idioma na URL
        this.router.navigate(['/sso/pt-br']);
      }  
  }

  onSubmit() {
    // throw new Error('Method not implemented.');
    alert('teste');
  }  

  onChange(event: Event){
    

    if(this.myGroup.controls.email.valid){
      this._loading.showLoading();
      const element = event.target as HTMLInputElement;

      this.oAuthService.userEmailExists(element.value, null)
        .subscribe({
          next :  (res : RespDefault<RespCheckEmailExists>) => {                
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
            this.nextButtonDisabled = true;
            this._loading.hideLoading();
            console.log(err);
          },
          complete: () => {
            this._loading.hideLoading();
          }          
        }
      );
    }  
         
  }

  title = 'identity-server-ui';


}
