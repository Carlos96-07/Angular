import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { ProductoCreate } from '../models/producto-create';
import { ProductoUpdate } from '../models/producto-update';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.apiUrl + '/api/Productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crearProducto(dto: ProductoCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/sp`, dto);
  }

  actualizarProducto(dto: ProductoUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/sp`, dto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sp/${id}`);
  }
}