import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class UserCanNotBeActivatedException extends TMSException {
  constructor() {
    super(
      'Kullanıcı giriş yapmadan aktif edilemez!',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}
