import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ERROR_MESSAGES } from '../../constants';
import { TMSException } from '../exceptions/tms.exception';
import ValidationException from '../exceptions/validation.exception';

const createTmsErrorResponse = (exception: TMSException) => {
  const error = exception?.constructor?.name;
  const { code, message, data, errorData } = exception;

  return {
    code,
    error,
    message,
    data,
    errorData,
  };
};

const createValidationErrorForResponse = (exception: ValidationException) => {
  const { code, error } = ERROR_MESSAGES.VALIDATION;
  const { constraints, property }: any = exception.getResponse();

  const rawConstraints = constraints
    ? Object.values(constraints)?.filter((obj) => obj)
    : [];

  const message: string = rawConstraints.join(', ');
  const details: { messages: any; path: string } = {
    messages: rawConstraints,
    path: property,
  };

  return {
    code,
    error,
    message,
    details,
  };
};

const createUnknownErrorResponse = (exception: HttpException) => {
  const { code, error, message } = ERROR_MESSAGES.UNKNOWN;
  const { message: detail, stack } = exception;

  return {
    code,
    error,
    message,
    detail,
    stack,
  };
};

const getOutputForError = (exception: HttpException) => {
  if (exception instanceof TMSException) {
    return createTmsErrorResponse(exception);
  }

  if (exception instanceof ValidationException) {
    return createValidationErrorForResponse(exception);
  }

  return createUnknownErrorResponse(exception);
};

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx?.getResponse();

    const status: HttpStatus =
      exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status);
    response.json(getOutputForError(exception));

    this.logger.error({
      ...exception?.response,
    });
  }
}
