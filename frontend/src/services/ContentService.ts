import Content from '../models/content/Content';
import ContentQuery from '../models/content/ContentQuery';
import CreateContentRequest from '../models/content/CreateContentRequest';
import UpdateContentRequest from '../models/content/UpdateContentRequest';
import apiService from './ApiService';

class ContentService {
  async findAll(courseId: string, contentQuery: ContentQuery): Promise<Content[]> {
    return (
      await apiService.get<Content[]>(`/courses/${courseId}/contents`, {
        params: contentQuery,
      })
    ).data;
  }

  async save(courseId: string, createContentRequest: CreateContentRequest): Promise<void> {
    // if there is an image file we need to send multipart form
    if (createContentRequest.image) {
      const form = new FormData();
      form.append('name', createContentRequest.name);
      form.append('description', createContentRequest.description);
      form.append('image', createContentRequest.image);
      await apiService.post(`/courses/${courseId}/contents`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await apiService.post(`/courses/${courseId}/contents`, createContentRequest);
    }
  }

  async update(
    courseId: string,
    id: string,
    updateContentRequest: UpdateContentRequest,
  ): Promise<void> {
    if (updateContentRequest.image) {
      const form = new FormData();
      if (updateContentRequest.name) form.append('name', updateContentRequest.name);
      if (updateContentRequest.description)
        form.append('description', updateContentRequest.description);
      form.append('image', updateContentRequest.image);
      await apiService.put(`/courses/${courseId}/contents/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await apiService.put(`/courses/${courseId}/contents/${id}`, updateContentRequest);
    }
  }

  async delete(courseId: string, id: string): Promise<void> {
    await apiService.delete(`/courses/${courseId}/contents/${id}`);
  }
}

const contentService = new ContentService();
export default contentService;
