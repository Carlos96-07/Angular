import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  standalone: true,
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [
    CommonModule
  ]
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  cargando: boolean = false;
  error: string = '';
  busqueda: string = '';
  mostrarModalEliminar: boolean = false;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';
    
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  filtrarProductos(): void {
    const busquedaLower = this.busqueda.toLowerCase().trim();
    
    if (!busquedaLower) {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busquedaLower) ||
      producto.codigo.toLowerCase().includes(busquedaLower)
    );
  }

  nuevoProducto(): void {
    this.router.navigate(['/producto/nuevo']);
  }

  editarProducto(producto: Producto): void {
    this.router.navigate(['/producto/editar', producto.productoId]);
  }

  confirmarEliminar(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar(): void {
    this.productoSeleccionado = null;
    this.mostrarModalEliminar = false;
  }

  eliminarProducto(): void {
    if (!this.productoSeleccionado) return;

    const productoId = this.productoSeleccionado.productoId;
    
    this.productoService.eliminarProducto(productoId).subscribe({
      next: () => {
        this.cargarProductos();
        this.cancelarEliminar();
      },
      error: (err) => {
        this.error = 'Error al eliminar el producto. Por favor, intente nuevamente.';
        console.error('Error:', err);
        this.cancelarEliminar();
      }
    });
  }

  formatearPrecio(precio: number): string {
    return '₡' + precio.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
}