import { Routes } from '@angular/router';
import { SsoComponent } from './sso/sso.component';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './not-found/not-found.component';
import { OtpComponent } from './otp/otp.component';

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
