import User from '../user/User';

/**
 * Respuesta del servidor tras una autenticación exitosa.
 */
export default interface AuthResponse {
  token: string;
  user: User;
}
