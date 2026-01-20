import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UsuarioService } from '../../app/services/usuario.service';
import { UsuarioLogin } from '../../app/models/usuario-login';
import { UsuarioLoginResponse } from '../../app/models/usuario-login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkExistingSession();
  }

  /**
   * Inicializa el formulario de login
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  /**
   * Verifica si hay una sesión activa
   */
private checkExistingSession(): void {
  if (typeof window === 'undefined') return;

  const sessionId = localStorage.getItem('sessionId');

  if (sessionId) {
    this.router.navigate(['/dashboard']);
  }
}


  // Getters para validaciones
  get nombreUsuario() {
    return this.loginForm.get('nombreUsuario');
  }

  get contrasena() {
    return this.loginForm.get('contrasena');
  }

  /**
   * Obtiene mensajes de error personalizados
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return field === 'nombreUsuario' 
        ? 'El nombre de usuario es requerido' 
        : 'La contraseña es requerida';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    return '';
  }

  /**
   * Mostrar/ocultar contraseña
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    // Limpiar mensaje de error previo
    this.errorMessage = '';

    // Validar formulario
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    // Crear objeto de login
    const loginData: UsuarioLogin = {
      nombreUsuario: this.loginForm.value.nombreUsuario,
      contrasena: this.loginForm.value.contrasena
    };

    console.log('Intentando login con:', loginData.nombreUsuario);

    // Llamar al servicio de login
    this.usuarioService.login(loginData).subscribe({
      next: (response: UsuarioLoginResponse) => {
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
  }

  /**
   * Maneja el login exitoso
   */
  private handleLoginSuccess(response: UsuarioLoginResponse): void {
    console.log('Login exitoso:', response);

   if (typeof window !== 'undefined') {

  if (response.sessionId) {
    localStorage.setItem('sessionId', response.sessionId);
  }

  if (response.usuarioId) {
    localStorage.setItem('usuarioId', response.usuarioId.toString());
  }

  if (response.nombreCompleto) {
    localStorage.setItem('nombreCompleto', response.nombreCompleto);
  }

  if (response.token) {
    localStorage.setItem('token', response.token);
  }

}


    this.isLoading = false;

    // Redirigir a la página principal (inicio)
    this.router.navigate(['/dashboard']).then(() => {
      console.log('Redirigido a la página principal');
    });
  }

  /**
   * Maneja errores en el login
   */
  private handleLoginError(error: any): void {
    console.error('Error en login:', error);
    
    this.isLoading = false;

    // Determinar mensaje de error
    if (error.status === 401) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    } else if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.error?.mensaje) {
      this.errorMessage = error.error.mensaje;
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
    }

    // Limpiar el campo de contraseña por seguridad
    this.loginForm.patchValue({ contrasena: '' });
  }


    
}