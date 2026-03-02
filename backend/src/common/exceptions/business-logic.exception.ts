/**
 * Excepciones de lógica de negocio personalizadas.
 */
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción base para errores de lógica de negocio.
 */
export class BusinessLogicException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

/**
 * Excepción lanzada cuando no se encuentra una entidad.
 */
export class EntityNotFoundException extends BusinessLogicException {
  constructor(entity: string, id: string | number) {
    super(`${entity} with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

/**
 * Excepción lanzada cuando se intenta crear un usuario que ya existe.
 */
export class UserAlreadyExistsException extends BusinessLogicException {
  constructor(username: string) {
    super(`User with username ${username} already exists`, HttpStatus.BAD_REQUEST);
  }
}
