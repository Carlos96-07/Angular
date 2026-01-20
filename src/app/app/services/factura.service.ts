import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';

import { FacturaCreate } from '../models/facturacreate';
import { FacturaCompleta } from '../models/facturaCompleta';
import { FacturaEncabezado } from '../models/facturaencabezado';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  private apiUrl = environment.apiUrl + '/api/facturacion';

  constructor(private http: HttpClient) {}

  // POST api/facturacion/crear
  crearFactura(dto: FacturaCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, dto);
  }

  obtenerFacturaPorId(id: number): Observable<FacturaCompleta> {
    return this.http.get<FacturaCompleta>(`${this.apiUrl}/${id}`);
  }

  listarFacturas(): Observable<FacturaEncabezado[]> {
    return this.http.get<FacturaEncabezado[]>(this.apiUrl);
  }
}
