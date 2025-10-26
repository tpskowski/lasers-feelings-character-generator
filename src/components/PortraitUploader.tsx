import { ChangeEvent, useRef, useState } from 'react';
import { CharacterPortrait } from '@/types/models';
import { resizeImage } from '@/utils/images';

export type PortraitUploaderProps = {
  portrait?: CharacterPortrait;
  onChange: (portrait?: CharacterPortrait) => void;
};

export const PortraitUploader = ({ portrait, onChange }: PortraitUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Please choose a PNG or JPEG image.');
      return;
    }
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image must be smaller than 2MB.');
      return;
    }
    try {
      const resized = await resizeImage(file);
      onChange(resized);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to process image. Please try a different file.');
    }
  };

  const removePortrait = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <section aria-labelledby="portrait-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="portrait-section" className="text-lg font-semibold">
          Portrait
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          Choose Image
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFile}
        className="sr-only"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-2 text-center text-sm text-slate-500 shadow-inner dark:border-slate-700 dark:bg-slate-800/60">
          {portrait ? (
            <img
              src={portrait.dataUrl}
              alt="Character portrait"
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <p>PNG or JPG up to 2MB. Images are resized to fit 768px.</p>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <p>
            Add a character portrait to personalize your sheet. The image is stored locally and never uploaded.
          </p>
          {portrait && (
            <button
              type="button"
              onClick={removePortrait}
              className="rounded-md border border-transparent bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-red-900/40 dark:text-red-200"
            >
              Remove portrait
            </button>
          )}
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </div>
      </div>
    </section>
  );
};
