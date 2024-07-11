import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { SeparatorElemComponent } from '../separator-elem/separator-elem.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OauthService } from '../oauth.service';
import { RespCheckEmailExists, RespDefault } from '../oauth-interfaces';
import { AppComponent } from '../app.component';
import { LoadingService } from '../loading.service';

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
    private appComponent: AppComponent,
    public _loading:LoadingService
  ) {}


  public myGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.email])   
  });
  nextButtonDisabled: boolean = true;

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
    this._loading.showLoading();

    if(this.myGroup.controls.email.valid){
      const element = event.target as HTMLInputElement;

      this.oAuthService.userEmailExists(element.value, null)
        .subscribe({
          next :  (res : RespDefault<RespCheckEmailExists>) => {                
            if(res && res.data?.userExists){
              this.nextButtonDisabled = false;
            }
            else{
              this.nextButtonDisabled = true;
              console.log('teste');
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
