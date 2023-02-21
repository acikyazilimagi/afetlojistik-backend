import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class PhoneNumberAlreadyExistsException extends TMSException {
  constructor() {
    super(
      'Bu telefon numarası zaten mevcut!',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}
