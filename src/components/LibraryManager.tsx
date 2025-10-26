import { FormEvent, useMemo, useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Option } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

type AccentForm = { label: string; color: string; description: string };
type GoalForm = { label: string; description: string };

const emptyAccent: AccentForm = { label: '', color: '#6366f1', description: '' };
const emptyGoal: GoalForm = { label: '', description: '' };

type OptionType = 'styles' | 'roles' | 'goals';

export const LibraryManager = () => {
  const { library, updateLibrary, showDefaults, setShowDefaults } = useLibrary();
  const [forms, setForms] = useState<{ styles: AccentForm; roles: AccentForm; goals: GoalForm }>(
    () => ({ styles: { ...emptyAccent }, roles: { ...emptyAccent }, goals: { ...emptyGoal } })
  );

  const handleSubmit = (type: OptionType) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = forms[type];
    if (!form.label.trim()) return;
    const option: Option = {
      id: uuidv4(),
      label: form.label.trim(),
      source: 'custom',
      color: 'color' in form ? form.color : undefined,
      description: form.description?.trim() || undefined
    };
    updateLibrary((prev) => ({
      ...prev,
      [type]: [...prev[type], option]
    }));
    setForms((prevState) => ({
      ...prevState,
      [type]: type === 'goals' ? { ...emptyGoal } : { ...emptyAccent }
    }));
  };

  const deleteCustomOption = (type: OptionType, id: string) => {
    updateLibrary((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id)
    }));
  };

  const lists = useMemo(
    () => [
      { type: 'styles' as OptionType, title: 'Styles', supportsColor: true },
      { type: 'roles' as OptionType, title: 'Roles', supportsColor: true },
      { type: 'goals' as OptionType, title: 'Goals', supportsColor: false }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Lists</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Add custom Styles, Roles, and Goals. Changes save locally and sync to the editor instantly.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showDefaults}
            onChange={(event) => setShowDefaults(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          Show default options
        </label>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {lists.map(({ type, title, supportsColor }) => {
          const options = library[type].filter((item) => (showDefaults ? true : item.source === 'custom'));
          const form = forms[type];
          return (
            <section
              key={type}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="text-xs text-slate-500">{options.length} shown</span>
              </div>
              <ul className="space-y-2">
                {options.map((option) => (
                  <li
                    key={option.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm dark:border-slate-600 dark:bg-slate-900/70"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium" style={option.color ? { color: option.color } : undefined}>
                        {option.label}
                      </span>
                      {option.description && <span className="text-xs text-slate-500">{option.description}</span>}
                      <span className="text-[11px] uppercase tracking-wide text-slate-400">{option.source}</span>
                    </div>
                    {option.source === 'custom' && (
                      <button
                        type="button"
                        onClick={() => deleteCustomOption(type, option.id)}
                        className="text-xs text-red-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
                {options.length === 0 && (
                  <li className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-600">
                    Nothing to show. Add a custom option below.
                  </li>
                )}
              </ul>
              <form onSubmit={handleSubmit(type)} className="space-y-3 rounded-lg border border-dashed border-slate-300 p-3 dark:border-slate-600">
                <h3 className="text-sm font-semibold">Add custom {title.slice(0, -1).toLowerCase()}</h3>
                <label className="block text-sm">
                  <span className="font-medium">Label</span>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(event) =>
                      setForms((prevState) => ({
                        ...prevState,
                        [type]: { ...prevState[type], label: event.target.value }
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900"
                    required
                  />
                </label>
                {supportsColor && 'color' in form && (
                  <label className="flex items-center justify-between text-sm">
                    <span className="font-medium">Accent Color</span>
                    <input
                      type="color"
                      value={form.color}
                      onChange={(event) =>
                        setForms((prevState) => ({
                          ...prevState,
                          [type]: { ...prevState[type], color: event.target.value }
                        }))
                      }
                      className="h-8 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0"
                    />
                  </label>
                )}
                <label className="block text-sm">
                  <span className="font-medium">Description (optional)</span>
                  <textarea
                    value={form.description ?? ''}
                    onChange={(event) =>
                      setForms((prevState) => ({
                        ...prevState,
                        [type]: { ...prevState[type], description: event.target.value }
                      }))
                    }
                    rows={3}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  Add
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
};
