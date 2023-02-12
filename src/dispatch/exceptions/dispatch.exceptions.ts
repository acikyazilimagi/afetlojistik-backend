import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class InvalidDispatchException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Dispatch datası uygun degil!', data },
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      data
    );
  }
}

export class InvalidDispatchIntegrationException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Dispatch datası için uygun entegrasyon bulunamadı!', data },
      HttpStatus.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      data
    );
  }
}