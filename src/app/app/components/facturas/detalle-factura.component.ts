import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FacturacionService } from '../../services/factura.service';
import { FacturaCompleta } from '../../models/facturaCompleta';

@Component({
  selector: 'app-detalle-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {
  factura: FacturaCompleta | null = null;
  cargando = false;
  error = '';
  
  constructor(
    private facturacionService: FacturacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarFactura(+id);
    }
  }

  cargarFactura(id: number): void {
    this.cargando = true;
    this.error = '';

    this.facturacionService.obtenerFacturaPorId(id).subscribe({
      next: (data) => {
        this.factura = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la factura. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/facturas']);
  }

  imprimir(): void {
    window.print();
  }

  formatearFecha(fecha: Date | null | undefined): string {
    if (!fecha) return 'N/A';
    
    const f = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return f.toLocaleDateString('es-CR', opciones);
  }
}