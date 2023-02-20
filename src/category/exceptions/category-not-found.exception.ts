import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export default class CategoryNotFoundException extends TMSException {
  constructor() {
    super(
      ERROR_META_DATAS.CATEGORY.NOT_FOUND.message,
      ERROR_META_DATAS.CATEGORY.NOT_FOUND.code,
      HttpStatus.NOT_FOUND
    );
  }
}
