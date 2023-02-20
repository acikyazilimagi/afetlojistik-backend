import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export default class PhoneNumberAlreadyExistsException extends TMSException {
  constructor() {
    super(
      ERROR_META_DATAS.SMS.RESEND_COUNT_EXCEEDED.message,
      ERROR_META_DATAS.SMS.RESEND_COUNT_EXCEEDED.code,
      HttpStatus.BAD_REQUEST
    );
  }
}
