import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FacturacionService } from '../../services/factura.service';
import { FacturaEncabezado } from '../../models/facturaencabezado';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturasComponent implements OnInit {
  facturas: FacturaEncabezado[] = [];
  facturasFiltradas: FacturaEncabezado[] = [];
  
  cargando = false;
  error = '';
  
  terminoBusqueda = '';
  
  // Estadísticas
  totalFacturas = 0;
  ventasHoy = 0;
  totalVentas = 0;

  constructor(
    private facturacionService: FacturacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.cargando = true;
    this.error = '';

    this.facturacionService.listarFacturas().subscribe({
      next: (data) => {
        this.facturas = data.sort((a, b) => b.facturaId - a.facturaId);
        this.facturasFiltradas = [...this.facturas];
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las facturas. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalFacturas = this.facturas.length;
    this.totalVentas = this.facturas.reduce((sum, f) => sum + f.total, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.ventasHoy = this.facturas.filter(f => {
      if (!f.fechaFactura) return false;
      const fechaFactura = new Date(f.fechaFactura);
      fechaFactura.setHours(0, 0, 0, 0);
      return fechaFactura.getTime() === hoy.getTime();
    }).length;
  }

  buscar(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino === '') {
      this.facturasFiltradas = [...this.facturas];
      return;
    }

    this.facturasFiltradas = this.facturas.filter(f => 
      f.numeroFactura.toLowerCase().includes(termino) ||
      f.cliente.toLowerCase().includes(termino) ||
      f.usuario.toLowerCase().includes(termino) ||
      f.total.toString().includes(termino)
    );
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscar();
  }

  verDetalle(facturaId: number): void {
    this.router.navigate(['/facturas', facturaId]);
  }

  nuevaFactura(): void {
    this.router.navigate(['/facturas/nueva']);
  }

  formatearFecha(fecha: Date | null | undefined): string {
    if (!fecha) return 'N/A';
    
    const f = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return f.toLocaleDateString('es-CR', opciones);
  }
}