import { FacturaEncabezado } from '../models/facturaencabezado';
import { FacturaDetalle } from '../models/facturadetalle';

export interface FacturaCompleta {
  encabezado: FacturaEncabezado;
  detalles: FacturaDetalle[];
}
