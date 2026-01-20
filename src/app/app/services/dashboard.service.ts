import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.apiUrl;      
  private clientesUrl = `${this.baseUrl}/api/Clientes`;
  private productosUrl = `${this.baseUrl}/api/Productos`;
  private facturasUrl = `${this.baseUrl}/api/Facturacion`;


  constructor(private http: HttpClient) {}

  // CLIENTES
  getClientes(): Observable<any> {
    return this.http.get(this.clientesUrl);
  }

  // PRODUCTOS
  getProductos(): Observable<any> {
    return this.http.get(this.productosUrl);
  }

   // FACTURAS
  listarFacturas(): Observable<any> {
    return this.http.get(this.facturasUrl);
  }
}
