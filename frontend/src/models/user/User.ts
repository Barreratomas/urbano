/**
 * Interfaz que representa a un usuario en el sistema.
 */
export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isActive: boolean;
}
