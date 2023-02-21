import { TMSException } from '../../common/exceptions/tms.exception';

export class InvalidVerificationCodeException extends TMSException {
  constructor() {
    super('Doğrulama kodu hatalı.', 400, 400);
  }
}
