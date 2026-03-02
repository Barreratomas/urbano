/**
 * Servicio encargado de la gestión de autenticación.
 * Incluye inicio de sesión, cierre de sesión y refresco de tokens.
 */
import AuthResponse from '../models/auth/AuthResponse';
import LoginRequest from '../models/auth/LoginRequest';
import apiService from './ApiService';

class AuthService {
  /**
   * Realiza el inicio de sesión del usuario.
   * Almacena el token en las cabeceras por defecto de la API.
   */
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const authResponse = (
      await apiService.post<AuthResponse>('/auth/login', loginRequest, {
        withCredentials: true,
      })
    ).data;
    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }

  /**
   * Cierra la sesión del usuario tanto en el servidor como en el cliente.
   */
  async logout(): Promise<void> {
    await apiService.post('/auth/logout', {}, { withCredentials: true });
    apiService.defaults.headers.Authorization = null;
  }

  /**
   * Refresca el token de acceso utilizando la cookie de sesión.
   */
  async refresh(): Promise<AuthResponse> {
    const authResponse = (
      await apiService.post<AuthResponse>('/auth/refresh', {}, { withCredentials: true })
    ).data;
    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }
}

const authService = new AuthService();
export default authService;
