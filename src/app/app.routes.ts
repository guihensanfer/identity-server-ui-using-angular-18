import { Routes } from '@angular/router';
import { SsoComponent } from './views/main/sso/sso.component';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './views/components/not-found/not-found.component';
import { OtpComponent } from './views/main/otp/otp.component';

export const routes: Routes = [    
    {
      path: 'sso/:lang/:secret',
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
