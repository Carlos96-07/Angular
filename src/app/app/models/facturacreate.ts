import { FacturaDetalleCreate } from '../models/facturadetallecreate';

export interface FacturaCreate {
  clienteId?: number | null;
  usuarioId: number;
  detalles: FacturaDetalleCreate[];

  // DetallesJson como en el backend:
  detallesJson?: string;
}
