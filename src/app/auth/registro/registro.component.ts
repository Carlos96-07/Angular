import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../app/services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmarContrasena, ...payload } = this.registroForm.value;

      this.usuariosService.registrar(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.';
          console.error('Error en registro:', error);
        }
      });
    } else {
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
      });
    }
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registroForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }

  getPasswordMatchError(): string {
    if (this.registroForm.hasError('passwordMismatch') && 
        this.registroForm.get('confirmarContrasena')?.touched) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}