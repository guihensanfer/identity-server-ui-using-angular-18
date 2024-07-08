import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostCheckEmailExists, RespCheckEmailExists } from './oauth-interfaces';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  userEmailExists(email: string, enabled: boolean): Observable<RespCheckEmailExists>{
    const data : PostCheckEmailExists = {
      email: email,
      enabled: enabled
    };
    
    return this.http.post<RespCheckEmailExists>(this.apiUrl + '/api/v1/oauth/user-email-exists', data);
  } 
}
