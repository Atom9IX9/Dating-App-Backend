import { randomUUID } from 'crypto';

export const generateFileName = (originalName: string) => {
  const ext = originalName.split('.').pop();
  return `${randomUUID()}.${ext}`;
};