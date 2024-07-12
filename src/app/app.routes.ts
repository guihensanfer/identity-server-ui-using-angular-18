import { Routes } from '@angular/router';
import { SsoComponent } from './sso/sso.component';
import { environment } from '../environments/environment';

export const routes: Routes = [    
    {
      path: 'sso/:lang',
      component: SsoComponent
    },    
    { path: '**', redirectTo: '/sso/' + environment.defaultLanguage } // Redirect to another route if the lang does not exists
];
