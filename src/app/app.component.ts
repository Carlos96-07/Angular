import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs/operators';
import { UsuarioService } from '../app/app/services/usuario.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pos-cloud-app';
  isLoginRoute = false;
  nombreUsuario = '';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Detectar si estamos en la ruta de login
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginRoute = event.url === '/login';
        
        // Si no es login, cargar datos del usuario
        if (!this.isLoginRoute) {
          this.loadUserData();
        }
      });

    // Verificar ruta inicial
    this.isLoginRoute = this.router.url === '/login';
    if (!this.isLoginRoute) {
      this.loadUserData();
    }
  }

  /**
   * Carga los datos del usuario desde localStorage
   */
  private loadUserData(): void {
    if (typeof window === 'undefined') return; 

    const nombreCompleto = localStorage.getItem('nombreCompleto');
    this.nombreUsuario = nombreCompleto || 'Usuario';
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.usuarioService.logout().subscribe({
        next: () => {
          console.log('Logout exitoso');
          this.clearSessionAndRedirect();
        },
        error: (error) => {
          console.error('Error en logout:', error);
          this.clearSessionAndRedirect();
        }
      });
    }
  }

  /**
   * Limpia la sesión y redirige al login
   */
   private clearSessionAndRedirect(): void {
    if (typeof window !== 'undefined') {   
      localStorage.removeItem('sessionId');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('nombreCompleto');
      localStorage.removeItem('token');
    }

    this.router.navigate(['/login']);
  }
}