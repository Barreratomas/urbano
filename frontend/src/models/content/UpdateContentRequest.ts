/**
 * Estructura para la actualización de un contenido existente.
 */
export default interface UpdateContentRequest {
  name?: string;
  description?: string;
  image?: File;
}
