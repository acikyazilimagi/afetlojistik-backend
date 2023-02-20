import { ERROR_META_DATAS } from 'src/constants';
import { TMSException } from '../../common/exceptions/tms.exception';

export default class InvalidVerificationCodeException extends TMSException {
  constructor() {
    super(
      ERROR_META_DATAS.USER.INVALID_VERIFICATION_CODE.message,
      ERROR_META_DATAS.USER.INVALID_VERIFICATION_CODE.code,
      400
    );
  }
}
