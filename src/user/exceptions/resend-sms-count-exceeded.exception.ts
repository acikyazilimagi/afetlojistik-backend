import { HttpException, HttpStatus } from '@nestjs/common';

export default class ResendSmsCountExceededException extends HttpException {
  constructor() {
    super(
      'SMS limiti aşıldı. Lütfen 5 dakika sonra tekran deneyiniz.',
      HttpStatus.BAD_REQUEST
    );
  }
}
