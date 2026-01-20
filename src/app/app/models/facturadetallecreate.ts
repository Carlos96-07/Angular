export interface FacturaDetalleCreate {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  aplicaIVA: boolean;
}
