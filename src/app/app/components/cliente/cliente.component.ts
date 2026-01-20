import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';

@Component({
  standalone: true,
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [
    CommonModule
  ]
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  cargando: boolean = false;
  error: string = '';
  busqueda: string = '';
  mostrarModalEliminar: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.error = '';
    
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los clientes. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  filtrarClientes(): void {
    const busquedaLower = this.busqueda.toLowerCase().trim();
    
    if (!busquedaLower) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombreCompleto.toLowerCase().includes(busquedaLower) ||
      cliente.cedula.includes(busquedaLower) ||
      cliente.email.toLowerCase().includes(busquedaLower) ||
      cliente.telefono.includes(busquedaLower)
    );
  }

  nuevoCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editarCliente(cliente: Cliente): void {
    this.router.navigate(['/clientes/editar', cliente.clienteId]);
  }

  confirmarEliminar(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar(): void {
    this.clienteSeleccionado = null;
    this.mostrarModalEliminar = false;
  }

  eliminarCliente(): void {
    if (!this.clienteSeleccionado) return;

    const clienteId = this.clienteSeleccionado.clienteId;
    
    this.clienteService.eliminarCliente(clienteId).subscribe({
      next: () => {
        this.cargarClientes();
        this.cancelarEliminar();
      },
      error: (err) => {
        this.error = 'Error al eliminar el cliente. Por favor, intente nuevamente.';
        console.error('Error:', err);
        this.cancelarEliminar();
      }
    });
  }

}