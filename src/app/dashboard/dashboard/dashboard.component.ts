import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { DashboardService } from '../../app/services/dashboard.service'; 


interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  trendIcon?: string;
  route?: string;
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

interface WeeklyData {
  day: string;
  value: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatTableModule,
    MatBadgeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  currentTime: string = '';

  // Tarjetas de estadísticas
  statCards: StatCard[] = [
    {
      title: 'Productos',
      value: 150,
      icon: 'inventory_2',
      color: '#3b82f6',
      trend: '+8',
      trendIcon: 'arrow_upward',
      route: '/producto'
    },
    {
      title: 'Clientes',
      value: 90,
      icon: 'people',
      color: '#f59e0b',
      trend: '+5',
      trendIcon: 'arrow_upward',
      route: '/cliente'
    },
    {
      title: 'Facturas',
      value: 23,
      icon: 'receipt_long',
      color: '#8b5cf6',
      trend: '+3',
      trendIcon: 'arrow_upward',
      route: '/facturas'
    }
  ];

  // Datos de ventas semanales
  weeklyData: WeeklyData[] = [
    { day: 'Lun', value: '₡45k', percentage: 65, color: '#3b82f6' },
    { day: 'Mar', value: '₡52k', percentage: 75, color: '#3b82f6' },
    { day: 'Mié', value: '₡38k', percentage: 55, color: '#3b82f6' },
    { day: 'Jue', value: '₡68k', percentage: 95, color: '#10b981' },
    { day: 'Vie', value: '₡71k', percentage: 100, color: '#10b981' },
    { day: 'Sáb', value: '₡42k', percentage: 60, color: '#8b5cf6' },
    { day: 'Dom', value: '₡35k', percentage: 50, color: '#8b5cf6' }
  ];

  // Actividades recientes
  recentActivities: RecentActivity[] = [
    {
      type: 'venta',
      description: 'Nueva venta registrada - Factura #1234',
      time: 'Hace 5 minutos',
      icon: 'shopping_cart',
      color: '#10b981'
    },
    {
      type: 'cliente',
      description: 'Nuevo cliente registrado: María González',
      time: 'Hace 15 minutos',
      icon: 'person_add',
      color: '#3b82f6'
    },
    {
      type: 'producto',
      description: 'Stock actualizado: Laptop HP',
      time: 'Hace 30 minutos',
      icon: 'inventory',
      color: '#f59e0b'
    },
    {
      type: 'factura',
      description: 'Factura #1233 enviada por correo',
      time: 'Hace 1 hora',
      icon: 'email',
      color: '#8b5cf6'
    },
    {
      type: 'pago',
      description: 'Pago recibido - Factura #1230',
      time: 'Hace 2 horas',
      icon: 'payments',
      color: '#10b981'
    }
  ];

  // Productos más vendidos
  topProducts = [
    { name: 'Laptop Dell Inspiron', sales: 45, revenue: '₡540,000' },
    { name: 'Mouse Logitech', sales: 32, revenue: '₡128,000' },
    { name: 'Teclado Mecánico', sales: 28, revenue: '₡168,000' },
    { name: 'Monitor LG 24"', sales: 21, revenue: '₡252,000' },
    { name: 'Webcam HD', sales: 18, revenue: '₡90,000' }
  ];

  constructor(private router: Router,

  private dashboardService: DashboardService

  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.loadClientesCount();
    this.loadProductosCount();
    this.loadFacturasCount();
    
    // Actualizar hora cada minuto
    setInterval(() => this.updateTime(), 60000);
  }


 /**
   * Carga datos del cliente
   */
 private loadClientesCount(): void {
    this.dashboardService.getClientes().subscribe({
      next: (clientes) => {
        const total = clientes?.length ?? 0;

        // Modificar solo la tarjeta Clientes
        const card = this.statCards.find(c => c.title === 'Clientes');
        if (card) {
          card.value = total;
        }
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
      }
    });
  }

   /**
   * Carga datos del productos
   */
 private loadProductosCount(): void {
    this.dashboardService.getProductos().subscribe({
      next: (producto) => {
        const total = producto?.length ?? 0;

        // Modificar solo la tarjeta Productos
        const card = this.statCards.find(c => c.title === 'Productos');
        if (card) {
          card.value = total;
        }
      },
      error: (err) => {
        console.error('Error cargando productos', err);
      }
    });
  }


    /**
   * Carga datos de las facturas
   */
 private loadFacturasCount(): void {
    this.dashboardService.listarFacturas().subscribe({
      next: (factura) => {
        const total = factura?.length ?? 0;

        // Modificar solo la tarjeta Facturas
        const card = this.statCards.find(c => c.title === 'Facturas');
        if (card) {
          card.value = total;
        }
      },
      error: (err) => {
        console.error('Error cargando facturas', err);
      }
    });
  }


  /**
   * Actualiza la hora actual
   */
  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Navega a una ruta específica
   */
  navigateTo(route: string | undefined): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  /**
   * Obtiene saludo según hora del día
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}