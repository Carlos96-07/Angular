import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FacturacionService } from '../../services/factura.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';
import { Cliente } from '../../models/cliente';
import { Producto } from '../../models/producto';
import { FacturaDetalleCreate } from '../../models/facturadetallecreate';
import { FacturaCreate } from '../../models/facturacreate';

interface DetalleFacturaUI {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  aplicaIVA: boolean;
  subtotal: number;
  iva: number;
  total: number;
}

@Component({
  selector: 'app-nueva-factura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './nueva-factura.component.html',
  styleUrls: ['./nueva-factura.component.css']
})
export class NuevaFacturaComponent implements OnInit {
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  
  clienteSeleccionado: Cliente | null = null;
  busquedaCliente = '';
  clientesFiltrados: Cliente[] = [];
  mostrarDropdownClientes = false;

  busquedaProducto = '';
  productosFiltrados: Producto[] = [];
  mostrarDropdownProductos = false;

  detalles: DetalleFacturaUI[] = [];
  
  cantidadProducto = 1;
  aplicaIVA = true;
  
  subtotalFactura = 0;
  ivaFactura = 0;
  totalFactura = 0;

  guardando = false;
  error = '';

  constructor(
    private facturacionService: FacturacionService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductos();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  onBusquedaClienteChange(): void {
    if (this.busquedaCliente.trim() === '') {
      this.clientesFiltrados = [];
      this.mostrarDropdownClientes = false;
      return;
    }

    const termino = this.busquedaCliente.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombreCompleto.toLowerCase().includes(termino) ||
      (c.cedula && c.cedula.includes(termino)) ||
      (c.email && c.email.toLowerCase().includes(termino))
    );
    this.mostrarDropdownClientes = true;
  }

  seleccionarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.busquedaCliente = cliente.nombreCompleto;
    this.mostrarDropdownClientes = false;
  }

  limpiarCliente(): void {
    this.clienteSeleccionado = null;
    this.busquedaCliente = '';
    this.clientesFiltrados = [];
  }

  onBusquedaProductoChange(): void {
    if (this.busquedaProducto.trim() === '') {
      this.productosFiltrados = [];
      this.mostrarDropdownProductos = false;
      return;
    }

    const termino = this.busquedaProducto.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      (p.codigo && p.codigo.toLowerCase().includes(termino))
    ).slice(0, 10);
    this.mostrarDropdownProductos = true;
  }

  agregarProducto(producto: Producto): void {
    // Verificar si ya existe en la lista
    const existe = this.detalles.find(d => d.productoId === producto.productoId);
    if (existe) {
      existe.cantidad += this.cantidadProducto;
      this.recalcularDetalle(existe);
    } else {
      const detalle: DetalleFacturaUI = {
        productoId: producto.productoId,
        productoNombre: producto.nombre,
        cantidad: this.cantidadProducto,
        precioUnitario: producto.precio,
        aplicaIVA: this.aplicaIVA,
        subtotal: 0,
        iva: 0,
        total: 0
      };
      this.recalcularDetalle(detalle);
      this.detalles.push(detalle);
    }

    this.recalcularTotales();
    this.limpiarFormProducto();
  }

  recalcularDetalle(detalle: DetalleFacturaUI): void {
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
    detalle.iva = detalle.aplicaIVA ? detalle.subtotal * 0.13 : 0;
    detalle.total = detalle.subtotal + detalle.iva;
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
    this.recalcularTotales();
  }

  modificarCantidad(detalle: DetalleFacturaUI, cambio: number): void {
    detalle.cantidad += cambio;
    if (detalle.cantidad < 1) {
      detalle.cantidad = 1;
    }
    this.recalcularDetalle(detalle);
    this.recalcularTotales();
  }

  toggleIVA(detalle: DetalleFacturaUI): void {
    detalle.aplicaIVA = !detalle.aplicaIVA;
    this.recalcularDetalle(detalle);
    this.recalcularTotales();
  }

  recalcularTotales(): void {
    this.subtotalFactura = this.detalles.reduce((sum, d) => sum + d.subtotal, 0);
    this.ivaFactura = this.detalles.reduce((sum, d) => sum + d.iva, 0);
    this.totalFactura = this.subtotalFactura + this.ivaFactura;
  }

  limpiarFormProducto(): void {
    this.busquedaProducto = '';
    this.productosFiltrados = [];
    this.mostrarDropdownProductos = false;
    this.cantidadProducto = 1;
  }

  guardarFactura(): void {
    if (this.detalles.length === 0) {
      this.error = 'Debe agregar al menos un producto a la factura';
      return;
    }

    this.guardando = true;
    this.error = '';

    const detallesCreate: FacturaDetalleCreate[] = this.detalles.map(d => ({
      productoId: d.productoId,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      aplicaIVA: d.aplicaIVA
    }));

    // Obtener usuarioId del localStorage o servicio de autenticación
    const usuarioId = 1; // Cambiar por el ID real del usuario

    const factura: FacturaCreate = {
      clienteId: this.clienteSeleccionado?.clienteId || null,
      usuarioId: usuarioId,
      detalles: detallesCreate
    };

    this.facturacionService.crearFactura(factura).subscribe({
      next: (response) => {
        this.guardando = false;
        this.router.navigate(['/facturas']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = 'Error al crear la factura. Por favor, intente nuevamente.';
        console.error('Error:', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/facturas']);
  }
}