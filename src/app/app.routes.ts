import { Routes } from '@angular/router';
import { SsoComponent } from './views/main/sso/sso.component';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './views/components/not-found/not-found.component';

export const routes: Routes = [    
  {
    path: 'sso/:lang/:secret',
    component: SsoComponent
  },
  {
    path: 'sso/:lang/:secret/:reset_password_flow',
    component: SsoComponent
  },
  {
    path: 'sso/:lang/:secret/:reset_password_flow/:user_email',
    component: SsoComponent
  },
  {
    path: 'sso/:secret',
    redirectTo: (queryParams) => {
      const secret = queryParams.params['secret'];

      return `sso/${environment.defaultLanguage}/${secret}`;
    }
  },  
  { 
    path: '**', 
    component: NotFoundComponent
  }
];
