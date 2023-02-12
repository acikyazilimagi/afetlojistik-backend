import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import ValidationException from '../exceptions/validation.exception';

export const ValidationPipeConfig: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    errors.map((e) => {
      throw new ValidationException(e);
    });
  },
};
