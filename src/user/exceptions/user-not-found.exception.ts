import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class UserNotFoundException extends TMSException {
  constructor() {
    super(
      'Kullanıcı adı veya doğrulama kodu hatalı!',
      HttpStatus.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}
