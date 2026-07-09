import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { TranslationsKeys } from 'src/common/translation-keys/translations-keys';
import { FilesService } from './files.service';

import type { Response } from 'express';
import { fileFilter } from './helpers/file-filter.helper';
import { fileNamer } from './helpers/file-namer.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
  ) { }


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) throw new BadRequestException(TranslationsKeys.CANNOT_UPLOAD_FILE);

    const fileName = `${file.filename}`

    return {
      fileName
    }
  }

}
