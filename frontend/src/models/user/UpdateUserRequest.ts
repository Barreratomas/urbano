/**
 * Estructura para la actualización de un usuario existente.
 */
export default interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}
