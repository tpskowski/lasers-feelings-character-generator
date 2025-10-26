import { useCharacter } from '@/context/CharacterContext';
import { useEffect, useState } from 'react';

export const SaveToast = () => {
  const { saveState } = useCharacter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (saveState === 'saving') {
      setMessage('Saving…');
    } else if (saveState === 'saved') {
      setMessage('Saved');
    } else if (saveState === 'error') {
      setMessage('Save failed');
    }
  }, [saveState]);

  if (saveState === 'idle') return null;

  const bgClass =
    saveState === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-slate-900 text-white dark:bg-slate-700';

  return (
    <div
      aria-live="polite"
      role="status"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm shadow-lg ${bgClass}`}
    >
      {message}
    </div>
  );
};
