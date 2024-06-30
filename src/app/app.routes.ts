import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SsoComponent } from './sso/sso.component';

export const routes: Routes = [
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: 'home', component: AppComponent },
    {
      path: 'sso/:lang',
      component: SsoComponent
    },
    { path: '**', component: AppComponent },
   // { path: '**', redirectTo: '/sso/pt-br' } // Redirect to another route if the lang does not exists
];
