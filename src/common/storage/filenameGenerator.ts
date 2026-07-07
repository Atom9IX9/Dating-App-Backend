/*
 * FILE: src/common/storage/filenameGenerator.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { randomUUID } from 'crypto';

// Generate a unique file name and preserve the original extension.
export const generateFileName = (originalName: string) => {
  const ext = originalName.split('.').pop();
  return `${randomUUID()}.${ext}`;
};
