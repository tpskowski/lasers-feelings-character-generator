import { useState } from 'react';
import { useCharacter } from '@/context/CharacterContext';
import { formatDistanceToNow } from 'date-fns';

export const SavesList = () => {
  const { list, loadCharacter, deleteCharacter, duplicateCharacter, exportCharacter } = useCharacter();
  const [selectedExport, setSelectedExport] = useState<string>('');

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Saved Characters</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Load, duplicate, delete, or export characters stored in your browser.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Defaults and custom lists apply to the editor automatically.
        </p>
      </header>
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          You have no saved characters yet. Create one in the editor.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
                  {item.portraitThumb ? (
                    <img
                      src={item.portraitThumb}
                      alt="Portrait thumbnail"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      No portrait
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-slate-500">
                    {item.styleLabel} {item.roleLabel}
                  </p>
                  <p className="text-xs text-slate-400">
                    Updated {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => loadCharacter(item.id)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => duplicateCharacter(item.id)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exported = exportCharacter(item.id);
                    setSelectedExport(exported ?? '');
                  }}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => deleteCharacter(item.id)}
                  className="rounded-md border border-transparent bg-red-100 px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:bg-red-900/50 dark:text-red-200"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {selectedExport && (
        <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Exported JSON</h2>
            <button
              type="button"
              onClick={() => setSelectedExport('')}
              className="text-sm text-primary-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Clear
            </button>
          </div>
          <textarea
            value={selectedExport}
            readOnly
            rows={12}
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono focus:outline-none dark:border-slate-600 dark:bg-slate-900"
          />
        </section>
      )}
    </div>
  );
};
