import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {

  const url = req.url;


  if(!url.includes(environment.bomdevApiUrl) || url.includes(AuthService.LOGIN_ENDPOINT_PATH)){
    return next(req);
  }
  
  return from(inject(AuthService).login()).pipe(
    switchMap(accessToken => {            
      
      const newReq = req.clone({
        headers: req.headers
          .append('Authorization', `Bearer ${accessToken?.accessToken}`)          
      });              

      return next(newReq);
    })
  );
};
