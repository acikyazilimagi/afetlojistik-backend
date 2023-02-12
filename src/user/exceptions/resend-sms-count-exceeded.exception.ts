import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export default class ResendSmsCountExceededException extends TMSException {
  constructor() {
    super(
      'SMS limiti aşıldı. Lütfen 5 dakika sonra tekran deneyiniz.',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}
