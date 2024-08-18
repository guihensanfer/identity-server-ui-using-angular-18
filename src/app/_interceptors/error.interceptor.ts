import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SharedDataService } from '../services/shared-data.service';
import { inject } from '@angular/core';
import { RespDefault } from '../interfaces/default-interfaces';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {    
  return next(req).pipe(
    catchError((error) => {

      if(environment.production){
        console.clear();
      }
      
      
      

      return throwError(() => error);
    })
  );
};

