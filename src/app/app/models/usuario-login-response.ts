export interface UsuarioLoginResponse {
  usuarioId: number;
  nombreCompleto: string;
  token?: string;      
  sessionId?: string;
}
