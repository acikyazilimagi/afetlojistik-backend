import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export default class InvalidTokenException extends TMSException {
  constructor() {
    super('Geçersiz Token', HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
