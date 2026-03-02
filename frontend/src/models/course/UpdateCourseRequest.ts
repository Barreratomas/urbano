/**
 * Estructura para la actualización de un curso existente.
 */
export default interface UpdateCourseRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}
