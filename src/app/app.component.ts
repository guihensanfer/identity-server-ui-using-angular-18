import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    console.log(this.router.parseUrl(this.router.parseUrl(this.router.url).queryParams['lang']));
    this.route.paramMap.subscribe(params => {
      const lang = params.get('lang');
      
      if (lang) {
        this.translocoService.setActiveLang(lang);
      } else {
        // Redireciona para o idioma padrão se não houver parâmetro de idioma na URL
        this.router.navigate(['/sso/pt-br']);
      }
    });
  }

  title = 'identity-server-ui';


}
