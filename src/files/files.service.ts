import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { TranslationsKeys } from 'src/common/translation-keys/translations-keys';

@Injectable()
export class FilesService {

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(TranslationsKeys.FILE_NOT_FOUND);
    }

    return path;
  }

  uploadFile(file: Express.Multer.File) {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    };
  }

}
