/**
 * Servicio encargado de la gestión de cursos y sus contenidos.
 * Maneja operaciones CRUD, favoritos, inscripciones, calendario y valoraciones.
 */
import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import apiService from './ApiService';

class CourseService {
  /**
   * Crea un nuevo curso.
   */
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await apiService.post('/courses', createCourseRequest);
  }

  /**
   * Obtiene un listado de cursos según los filtros proporcionados.
   */
  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses', { params: courseQuery })).data;
  }

  /**
   * Obtiene un curso específico por su ID.
   */
  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/courses/${id}`)).data;
  }

  /**
   * Agrega un curso a los favoritos del usuario.
   */
  async favorite(id: string): Promise<void> {
    await apiService.post(`/courses/${id}/favorite`, {});
  }

  /**
   * Elimina un curso de los favoritos del usuario.
   */
  async unfavorite(id: string): Promise<void> {
    await apiService.delete(`/courses/${id}/favorite`);
  }

  /**
   * Obtiene la lista de cursos favoritos del usuario logueado.
   */
  async myFavorites(): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses/favorites')).data;
  }

  /**
   * Obtiene el calendario de cursos programados.
   */
  async getCalendar(params?: {
    start?: string;
    end?: string;
  }): Promise<Array<{ date: string; courses: Course[] }>> {
    return (
      await apiService.get<Array<{ date: string; courses: Course[] }>>('/courses/calendar', {
        params,
      })
    ).data;
  }

  /**
   * Inscribe al usuario en un curso.
   */
  async enroll(id: string): Promise<void> {
    await apiService.post(`/courses/${id}/enroll`, {});
  }

  /**
   * Desinscribe al usuario de un curso.
   */
  async unenroll(id: string): Promise<void> {
    await apiService.delete(`/courses/${id}/enroll`);
  }

  /**
   * Obtiene los cursos en los que el usuario está inscrito.
   */
  async myEnrollments(): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses/enrolled')).data;
  }

  /**
   * Emite un voto/valoración para un curso específico.
   */
  async vote(id: string, value: number): Promise<void> {
    await apiService.post(`/courses/${id}/vote`, { value });
  }

  /**
   * Obtiene el ranking de cursos mejor valorados.
   */
  async ranking(): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses/ranking')).data;
  }

  /**
   * Actualiza la información de un curso existente.
   */
  async update(id: string, updateCourseRequest: UpdateCourseRequest): Promise<void> {
    await apiService.put(`/courses/${id}`, updateCourseRequest);
  }

  /**
   * Elimina un curso permanentemente.
   */
  async delete(id: string): Promise<void> {
    await apiService.delete(`/courses/${id}`);
  }
}

const courseService = new CourseService();
export default courseService;
