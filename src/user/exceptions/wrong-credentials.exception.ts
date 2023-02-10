import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super('Kullanıcı Adı veya Doğrulama Kodu Hatalı!', HttpStatus.UNAUTHORIZED);
  }
}
