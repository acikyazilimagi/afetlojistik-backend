import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export class InvalidDispatchException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.DISPATCH.INVALID.message,
      ERROR_META_DATAS.DISPATCH.INVALID.code,
      HttpStatus.INTERNAL_SERVER_ERROR,
      data
    );
  }
}

export class InvalidDispatchIntegrationException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.DISPATCH.INVALID_INTEGRATION.message,
      ERROR_META_DATAS.DISPATCH.INVALID_INTEGRATION.code,
      HttpStatus.NOT_FOUND,
      data
    );
  }
}
