import { HttpException, HttpStatus } from '@nestjs/common';

export class IntegrationNotFoundException extends HttpException {
  constructor(data?: any) {
    super({ message: 'Entegrasyon bulunamadı', data }, HttpStatus.NOT_FOUND);
  }
}