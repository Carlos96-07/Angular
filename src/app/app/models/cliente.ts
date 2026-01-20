export interface Cliente {
  clienteId: number;
  cedula: string;
  nombreCompleto: string;
  telefono: string;
  email: string;
  direccion: string;
  esInvitado: boolean;
  activo: boolean;
  fechaCreacion: string;
}
