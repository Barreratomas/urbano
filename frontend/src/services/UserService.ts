/**
 * Servicio encargado de la gestión de usuarios.
 * Permite realizar operaciones CRUD sobre los usuarios del sistema.
 */
import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  /**
   * Crea un nuevo usuario.
   */
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await apiService.post('/users', createUserRequest);
  }

  /**
   * Obtiene todos los usuarios que coincidan con los criterios de búsqueda.
   */
  async findAll(userQuery: UserQuery): Promise<User[]> {
    return (
      await apiService.get<User[]>('/users', {
        params: userQuery,
      })
    ).data;
  }

  /**
   * Busca un usuario específico por su ID.
   */
  async findOne(id: string): Promise<User> {
    return (await apiService.get<User>(`/users/${id}`)).data;
  }

  /**
   * Actualiza los datos de un usuario existente.
   */
  async update(id: string, updateUserRequest: UpdateUserRequest): Promise<User> {
    const { firstName, isActive, lastName, password, role, username } = updateUserRequest;
    return (
      await apiService.put<User>(`/users/${id}`, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        role: role || undefined,
        isActive,
        password: password || undefined,
      })
    ).data;
  }

  /**
   * Elimina un usuario del sistema por su ID.
   */
  async delete(id: string): Promise<void> {
    await apiService.delete(`/users/${id}`);
  }
}

const userService = new UserService();
export default userService;
