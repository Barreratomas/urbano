import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessLogicException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

export class EntityNotFoundException extends BusinessLogicException {
  constructor(entity: string, id: string | number) {
    super(`${entity} with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends BusinessLogicException {
  constructor(username: string) {
    super(`User with username ${username} already exists`, HttpStatus.BAD_REQUEST);
  }
}
