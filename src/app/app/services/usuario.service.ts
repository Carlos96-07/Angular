import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioLogin } from '../models/usuario-login';
import { UsuarioLoginResponse } from '../models/usuario-login-response';
import { environment } from '../../../environments'
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = environment.apiUrl + '/api/usuarios'; 

  constructor(private http: HttpClient) {}

  login(payload: UsuarioLogin): Observable<UsuarioLoginResponse> {
    return this.http.post<UsuarioLoginResponse>(
      `${this.api}/login`,
      payload,
      { withCredentials: true } 
    );
  }

  registrar(payload: any) {
    return this.http.post(`${this.api}/registrar`, payload, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${this.api}/logout`, {}, { withCredentials: true });
  }
}
