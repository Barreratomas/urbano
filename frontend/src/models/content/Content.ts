/**
 * Interfaz que representa un contenido o lección dentro de un curso.
 */
export default interface Content {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  imageUrl?: string;
}
