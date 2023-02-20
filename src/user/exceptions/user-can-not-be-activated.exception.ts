import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export default class UserCanNotBeActivatedException extends TMSException {
  constructor() {
    super(
      ERROR_META_DATAS.USER.CAN_NOT_BE_ACTIVATED.message,
      ERROR_META_DATAS.USER.CAN_NOT_BE_ACTIVATED.code,
      HttpStatus.BAD_REQUEST
    );
  }
}
