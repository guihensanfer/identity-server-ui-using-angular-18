import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { SeparatorElemComponent } from '../separator-elem/separator-elem.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
    private translocoService: TranslocoService
  ) {}

  reativeForm = new FormGroup({
    email: new FormControl('')   
  });

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
  }  

  title = 'identity-server-ui';


}
