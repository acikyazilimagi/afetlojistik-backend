import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export default class InvalidTokenException extends TMSException {
  constructor() {
    super(
      ERROR_META_DATAS.USER.INVALID_TOKEN.message,
      ERROR_META_DATAS.USER.INVALID_TOKEN.code,
      HttpStatus.UNAUTHORIZED
    );
  }
}
