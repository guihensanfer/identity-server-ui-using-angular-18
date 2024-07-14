import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckEmailExistsPost, CheckEmailExistsResp } from '../../interfaces/oauth/oauth-interfaces';
import { RespDefault } from '../../interfaces/default-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OauthService {  
  constructor(private http: HttpClient) {}

  userEmailExists(data:CheckEmailExistsPost, accessToken: string): Observable<RespDefault<CheckEmailExistsResp>>{    
    const _headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    
    return this.http.post<RespDefault<CheckEmailExistsResp>>(`${environment.bomdevApiUrl}/api/v1/oauth/user-check-email-exists`, data,
    {
      headers: _headers
    });
  } 
}
