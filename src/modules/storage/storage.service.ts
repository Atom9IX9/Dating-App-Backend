import { StorageFolder } from '@/common/storage/storage.constants';
import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';

@Injectable()
export class StorageService {
  private readonly uploadPath: string = join(process.cwd(), 'static');
  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private uploadFileTo(to: StorageFolder, fileName: string) {
    return join(this.uploadPath, to, fileName);
  }

  saveFile(file: Express.Multer.File, to: StorageFolder) {
    const filename = `${uuid()}${extname(file.originalname)}`;

    const dir = join(this.uploadPath, to);
    fs.mkdirSync(dir, { recursive: true });

    const fullPath = this.uploadFileTo(to, filename);

    fs.writeFileSync(fullPath, file.buffer);

    return {
      filename,
      path: fullPath,
      url: `/static/${to}/${filename}`,
    };
  }
}
