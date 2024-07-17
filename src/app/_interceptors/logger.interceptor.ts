import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {

  if(req.url.includes('auth/login')){
    return next(req);
  }
  
  return from(inject(AuthService).getAuthToken()).pipe(
    switchMap(accessToken => {      
      
      const newReq = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${accessToken?.accessToken}`)
      });

      return next(newReq);
    })
  );
};
