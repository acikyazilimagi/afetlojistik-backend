import { NotFoundException } from '@nestjs/common';

export default class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Kullanıcı adı veya doğrulama kodu hatalı!');
  }
}
