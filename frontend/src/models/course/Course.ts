/**
 * Interfaz que representa un curso en la plataforma.
 */
export default interface Course {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  isFavorite?: boolean;
  isEnrolled?: boolean;
  rating?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  language?: string;
}
