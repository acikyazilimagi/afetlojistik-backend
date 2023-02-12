import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class WrongCredentialsException extends TMSException {
  constructor() {
    super(
      'Kullanıcı Adı veya Doğrulama Kodu Hatalı!',
      HttpStatus.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }
}
