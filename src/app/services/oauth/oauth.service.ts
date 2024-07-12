import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostCheckEmailExists, RespCheckEmailExists } from '../../interfaces/oauth/oauth-interfaces';
import { RespDefault } from '../../interfaces/default-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OauthService {  
  constructor(private http: HttpClient) {}

  userEmailExists(email: string, enabled: any): Observable<RespDefault<RespCheckEmailExists>>{
    const data : PostCheckEmailExists = {
      email: email,
      enabled: enabled
    };
    
    return this.http.post<RespDefault<RespCheckEmailExists>>(environment.bomdevApiUrl + '/api/v1/oauth/user-check-email-exists', data);
  } 
}
