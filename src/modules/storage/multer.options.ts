/*
 * FILE: src/modules/storage/multer.options.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { memoryStorage } from 'multer';

export const multerOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};