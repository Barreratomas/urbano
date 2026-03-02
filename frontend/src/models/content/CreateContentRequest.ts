/**
 * Estructura para la creación de un nuevo contenido.
 */
export default interface CreateContentRequest {
  name: string;
  description: string;
  image?: File;
}
