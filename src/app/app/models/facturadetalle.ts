export interface FacturaDetalle {
  detalleId: number;
  productoId: number;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  iva: number;
  total: number;
}
