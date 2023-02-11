import { HttpException, HttpStatus } from '@nestjs/common';

export class TMSException extends HttpException {
  constructor(
    public message: any,
    public code: number,
    public statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public data?: any,
    public level?: any,
    public errorData?: any
  ) {
    super(message, statusCode);
  }
}
