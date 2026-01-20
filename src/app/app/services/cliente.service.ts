import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { ClienteCreate } from '../models/cliente-create';
import { ClienteUpdate } from '../models/cliente-update';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // 1. Inyección de dependencia moderna con inject()
  private http = inject(HttpClient); 
  
  // Usamos template literals para la URL base
  private apiUrl = `${environment.apiUrl}/api/Clientes`;

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  getClientePorCedula(cedula: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/cedula/${cedula}`);
  }

  // 2. Tipado estricto: POST devuelve el objeto Cliente creado
  crearCliente(dto: ClienteCreate): Observable<Cliente> { 
    return this.http.post<Cliente>(this.apiUrl, dto);
  }

  // 3. Tipado estricto: PUT no devuelve contenido, solo éxito (void)
  actualizarCliente(dto: ClienteUpdate): Observable<void> { 
    return this.http.put<void>(`${this.apiUrl}/${dto.clienteId}`, dto);
  }

  // 4. Tipado estricto: DELETE no devuelve contenido (void)
  eliminarCliente(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
