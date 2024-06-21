import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: 'sso/:lang',
        children: [
          { path: '', component: AppComponent },          
          // Adicione outras rotas aqui
        ]
      },
      { path: '**', redirectTo: '/sso/pt-br' } // Redirect to another route if the lang does not exists
];
