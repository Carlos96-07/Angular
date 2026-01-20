export interface FacturaEncabezado {
  facturaId: number;
  numeroFactura: string;
  cliente: string;
  usuario: string;
  subtotal: number;
  iva?: number | null;
  total: number;
  fechaFactura?: Date | null;
}
