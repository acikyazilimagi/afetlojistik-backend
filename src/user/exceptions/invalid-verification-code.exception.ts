import { TMSException } from '../../common/exceptions/tms.exception';

export default class InvalidVerificationCodeException extends TMSException {
  constructor() {
    super('Doğrulama kodu hatalı.', 400, 400);
  }
}
