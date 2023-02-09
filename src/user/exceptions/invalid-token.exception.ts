import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidTokenException extends HttpException {
  constructor() {
    super('Geçersiz Token', HttpStatus.UNAUTHORIZED);
  }
}
