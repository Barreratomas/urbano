/**
 * Estructura para la creación de un nuevo curso.
 */
export default interface CreateCourseRequest {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
}
