import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import apiService from './ApiService';

class UserService {
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await apiService.post('/courses', createCourseRequest);
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses', { params: courseQuery })).data;
  }

  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/courses/${id}`)).data;
  }

  async favorite(id: string): Promise<void> {
    await apiService.post(`/courses/${id}/favorite`, {});
  }

  async unfavorite(id: string): Promise<void> {
    await apiService.delete(`/courses/${id}/favorite`);
  }

  async myFavorites(): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses/favorites')).data;
  }

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

  async enroll(id: string): Promise<void> {
    await apiService.post(`/courses/${id}/enroll`, {});
  }

  async unenroll(id: string): Promise<void> {
    await apiService.delete(`/courses/${id}/enroll`);
  }

  async myEnrollments(): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses/enrolled')).data;
  }

  async vote(id: string, value: number): Promise<void> {
    await apiService.post(`/courses/${id}/vote`, { value });
  }

  async ranking(): Promise<Course[]> {
    return (await apiService.get<Course[]>('/courses/ranking')).data;
  }

  async update(id: string, updateCourseRequest: UpdateCourseRequest): Promise<void> {
    await apiService.put(`/courses/${id}`, updateCourseRequest);
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/courses/${id}`);
  }
}

const courseService = new UserService();
export default courseService;
