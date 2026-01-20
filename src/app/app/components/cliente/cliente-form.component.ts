import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ClienteCreate } from '../../models/cliente-create';
import { ClienteUpdate } from '../../models/cliente-update';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm!: FormGroup;
  esEdicion = false;
  clienteId: number | null = null;
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.esEdicion = true;
        this.cargarCliente();
      }
    });
  }

  inicializarFormulario(): void {
    this.clienteForm = this.fb.group({
      cedula: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.minLength(9)
      ]],
      nombreCompleto: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{4}-[0-9]{4}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      direccion: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  cargarCliente(): void {
    if (!this.clienteId) return;

    this.cargando = true;
    this.clienteService.getClientePorId(this.clienteId).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue({
          cedula: cliente.cedula,
          nombreCompleto: cliente.nombreCompleto,
          telefono: cliente.telefono,
          email: cliente.email,
          direccion: cliente.direccion
        });
        
        // Deshabilitar validación de cédula en modo edición
        this.clienteForm.get('cedula')?.clearValidators();
        this.clienteForm.get('cedula')?.updateValueAndValidity();
        
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar el cliente. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  guardarCliente(): void {
    if (this.clienteForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.esEdicion && this.clienteId) {
      // Actualizar cliente existente
      const clienteData: ClienteUpdate = {
        clienteId: this.clienteId,
        cedula: this.clienteForm.value.cedula,
        nombreCompleto: this.clienteForm.value.nombreCompleto,
        telefono: this.clienteForm.value.telefono,
        email: this.clienteForm.value.email,
        direccion: this.clienteForm.value.direccion
      };

      this.clienteService.actualizarCliente(clienteData).subscribe({
        next: () => {
          this.mensajeExito = 'Cliente actualizado exitosamente';
          this.cargando = false;
          
          setTimeout(() => {
            this.router.navigate(['/cliente']);
          }, 1500);
        },
        error: (err) => {
          this.mensajeError = 'Error al actualizar el cliente. Por favor, intente nuevamente.';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
    } else {
      // Crear nuevo cliente
      const clienteData: ClienteCreate = {
        cedula: this.clienteForm.value.cedula,
        nombreCompleto: this.clienteForm.value.nombreCompleto,
        telefono: this.clienteForm.value.telefono,
        email: this.clienteForm.value.email,
        direccion: this.clienteForm.value.direccion,
        fechaCreacion: new Date()
      };

      this.clienteService.crearCliente(clienteData).subscribe({
        next: () => {
          this.mensajeExito = 'Cliente creado exitosamente';
          this.cargando = false;
          
          setTimeout(() => {
            this.router.navigate(['/cliente']);
          }, 1500);
        },
        error: (err) => {
          this.mensajeError = 'Error al crear el cliente. Por favor, intente nuevamente.';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.clienteForm.get(key)?.markAsTouched();
    });
  }

  volver(): void {
    this.router.navigate(['/cliente']);
  }

  // Getters para facilitar acceso a los controles
  get cedula() { return this.clienteForm.get('cedula'); }
  get nombreCompleto() { return this.clienteForm.get('nombreCompleto'); }
  get telefono() { return this.clienteForm.get('telefono'); }
  get email() { return this.clienteForm.get('email'); }
  get direccion() { return this.clienteForm.get('direccion'); }
}