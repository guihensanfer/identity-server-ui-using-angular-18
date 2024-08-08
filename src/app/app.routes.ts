import { Routes } from '@angular/router';
import { SsoComponent } from './views/main/sso/sso.component';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './views/components/not-found/not-found.component';

export const routes: Routes = [    
  {
    path: ':lang/sso/:secret',
    component: SsoComponent
  },
  {
    path: 'sso/:secret',
    redirectTo: (queryParams) => {
      const secret = queryParams.params['secret'];

      return `${environment.defaultLanguage}/sso/${secret}`;
    }
  },  
  { 
    path: '**', 
    component: NotFoundComponent
  }
];
