import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

class ValidationException extends HttpException {
  constructor(e: ValidationError) {
    super(e, HttpStatus.BAD_REQUEST);
  }
}

export const ValidationPipeConfig: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    errors.map((e) => {
      throw new ValidationException(e);
    });
  },
};
