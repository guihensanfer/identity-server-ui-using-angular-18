import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {    
  return next(req).pipe(
    catchError((error) => {

      if(environment.production){
        console.clear();
      }

      if(environment.catchPreflightedRequest && !req.headers.has('Authorization')){
        return throwError(() => new Error(environment.preflightedRequestErrorName));
      }
      

      return throwError(() => error);
    })
  );
};
