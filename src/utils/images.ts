import { CharacterPortrait } from '@/types/models';

const MAX_EDGE = 768;

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    image.src = url;
  });

export const resizeImage = async (file: File): Promise<CharacterPortrait> => {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  ctx.drawImage(image, 0, 0, width, height);
  const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mime, 0.92);
  return {
    mime,
    dataUrl,
    width,
    height
  };
};
