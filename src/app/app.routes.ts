import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SsoComponent } from './sso/sso.component';

export const routes: Routes = [
    {
      path: '',
      component: AppComponent
    },
    {
      path: 'sso/:lang',
      component: SsoComponent
    },
   // { path: '**', redirectTo: '/sso/pt-br' } // Redirect to another route if the lang does not exists
];
