import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export default class ValidationException extends HttpException {
  constructor(error: ValidationError) {
    super(
      {
        constraints: error.constraints,
        property: error.property,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
