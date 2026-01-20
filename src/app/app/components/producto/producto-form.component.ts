import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { ProductoCreate } from '../../models/producto-create';
import { ProductoUpdate } from '../../models/producto-update';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm!: FormGroup;
  esEdicion = false;
  productoId: number | null = null;
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productoId = +params['id'];
        this.esEdicion = true;
        this.cargarProducto();
      }
    });
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z0-9-]+$/),
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      precio: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      aplicaIVA: [true],
      cantidadInicial: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/)
      ]]
    });
  }

  cargarProducto(): void {
    if (!this.productoId) return;

    this.cargando = true;
    
    // Cargar todos los productos y buscar el específico
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        const producto = productos.find(p => p.productoId === this.productoId);
        
        if (producto) {
          this.productoForm.patchValue({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            aplicaIVA: producto.aplicaIVA
          });
          
          // En modo edición, no necesitamos cantidad inicial
          this.productoForm.get('cantidadInicial')?.clearValidators();
          this.productoForm.get('cantidadInicial')?.updateValueAndValidity();
        } else {
          this.mensajeError = 'Producto no encontrado';
        }
        
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar el producto. Por favor, intente nuevamente.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.esEdicion && this.productoId) {
      // Actualizar producto existente
      const productoData: ProductoUpdate = {
        productoId: this.productoId,
        codigo: this.productoForm.value.codigo,
        nombre: this.productoForm.value.nombre,
        precio: parseFloat(this.productoForm.value.precio),
        aplicaIVA: this.productoForm.value.aplicaIVA
      };

      this.productoService.actualizarProducto(productoData).subscribe({
        next: (response) => {
          if (response.codigo === 0) {
            this.mensajeExito = response.mensaje || 'Producto actualizado exitosamente';
            this.cargando = false;
            
            setTimeout(() => {
              this.router.navigate(['/producto']);
            }, 1500);
          } else {
            this.mensajeError = response.mensaje || 'Error al actualizar el producto';
            this.cargando = false;
          }
        },
        error: (err) => {
          this.mensajeError = 'Error al actualizar el producto. Por favor, intente nuevamente.';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
    } else {
      // Crear nuevo producto
      const productoData: ProductoCreate = {
        codigo: this.productoForm.value.codigo,
        nombre: this.productoForm.value.nombre,
        precio: parseFloat(this.productoForm.value.precio),
        aplicaIVA: this.productoForm.value.aplicaIVA,
        cantidadInicial: parseInt(this.productoForm.value.cantidadInicial)
      };

      this.productoService.crearProducto(productoData).subscribe({
        next: (response) => {
          if (response.codigo === 0) {
            this.mensajeExito = response.mensaje || 'Producto creado exitosamente';
            this.cargando = false;
            
            setTimeout(() => {
              this.router.navigate(['/producto']);
            }, 1500);
          } else {
            this.mensajeError = response.mensaje || 'Error al crear el producto';
            this.cargando = false;
          }
        },
        error: (err) => {
          this.mensajeError = 'Error al crear el producto. Por favor, intente nuevamente.';
          this.cargando = false;
          console.error('Error:', err);
        }
      });
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.productoForm.controls).forEach(key => {
      this.productoForm.get(key)?.markAsTouched();
    });
  }

  volver(): void {
    this.router.navigate(['/producto']);
  }

  // Getters para facilitar acceso a los controles
  get codigo() { return this.productoForm.get('codigo'); }
  get nombre() { return this.productoForm.get('nombre'); }
  get precio() { return this.productoForm.get('precio'); }
  get aplicaIVA() { return this.productoForm.get('aplicaIVA'); }
  get cantidadInicial() { return this.productoForm.get('cantidadInicial'); }
}