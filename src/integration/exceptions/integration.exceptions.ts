import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export class IntegrationNotFoundException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.INTEGRATION.NOT_FOUND.message,
      ERROR_META_DATAS.INTEGRATION.NOT_FOUND.code,
      HttpStatus.NOT_FOUND,
      data
    );
  }
}
