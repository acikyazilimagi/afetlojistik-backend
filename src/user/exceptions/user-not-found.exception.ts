import { NotFoundException } from '@nestjs/common';

export default class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Kullanıcı Adı veya Şifre Hatalı!');
  }
}
