import AuthResponse from '../models/auth/AuthResponse';
import LoginRequest from '../models/auth/LoginRequest';
import apiService from './ApiService';

class AuthService {
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const authResponse = (
      await apiService.post<AuthResponse>('/auth/login', loginRequest, {
        withCredentials: true,
      })
    ).data;
    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout', {}, { withCredentials: true });
    apiService.defaults.headers.Authorization = null;
  }

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
