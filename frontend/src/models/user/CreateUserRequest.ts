/**
 * Estructura para la creación de un nuevo usuario.
 */
export default interface CreateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
}
