import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class IntegrationNotFoundException extends TMSException {
  constructor(data?: any) {
    super(
      'Entegrasyon bulunamadı',
      HttpStatus.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      data, 
    );
  }
}