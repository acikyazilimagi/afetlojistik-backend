import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export default class CategoryNotFoundException extends TMSException {
  constructor() {
    super('Kategori bulunamadı', HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
