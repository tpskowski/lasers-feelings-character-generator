import { FormEvent, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useCharacter } from '@/context/CharacterContext';
import { useLibrary } from '@/context/LibraryContext';
import { CUSTOM_ROLE_ID, CUSTOM_STYLE_ID, LFNumber, Option } from '@/types/models';
import { PortraitUploader } from './PortraitUploader';
import { PDFExportButton } from './PDFExportButton';
import { CustomOptionModal } from './CustomOptionModal';
import { uniformGear } from '@/lib/defaults';

const pdfTargetId = 'character-sheet-preview';

const optionButtonClass = (active: boolean, color?: string) =>
  clsx(
    'flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition',
    active
      ? 'border-transparent bg-primary-600 text-white shadow'
      : 'border-slate-300 bg-white text-slate-700 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
    color && !active && 'border-transparent'
  );

type CustomModalType = 'style' | 'role' | 'goal';

const modalTitles: Record<CustomModalType, string> = {
  style: 'Create Custom Style',
  role: 'Create Custom Role',
  goal: 'Create Custom Goal'
};

const modalDescriptions: Record<CustomModalType, string> = {
  style: 'Name a unique style for this character.',
  role: 'Name a unique role for this character.',
  goal: 'Describe what your character is striving for.'
};

const modalPlaceholders: Record<CustomModalType, string> = {
  style: 'Space Cowboy',
  role: 'Chief Problem Solver',
  goal: 'Chart their own destiny'
};

export const CharacterEditor = () => {
  const { character, updateCharacter, createCharacter, saveAsNew, list, importCharacter } = useCharacter();
  const { library } = useLibrary();
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ type: CustomModalType; initialValue: string } | null>(null);
  const currentExport = useMemo(() => JSON.stringify(character, null, 2), [character]);

  const setStyle = (option: Option) => {
    updateCharacter((prev) => ({ ...prev, styleId: option.id }));
  };

  const setRole = (option: Option) => {
    updateCharacter((prev) => ({ ...prev, roleId: option.id }));
  };

  const setNumber = (value: LFNumber) => {
    updateCharacter((prev) => ({ ...prev, number: value }));
  };

  const handleGoalPreset = (option: Option) => {
    updateCharacter((prev) => ({ ...prev, goal: { type: 'preset', value: option.id } }));
  };

  const handleGoalCustom = (value: string) => {
    const trimmed = value.trim();
    updateCharacter((prev) => ({ ...prev, goal: { type: 'custom', value: trimmed } }));
  };

  const openCustomModal = (type: CustomModalType) => {
    let initialValue = '';
    if (type === 'style') {
      initialValue = character.styleCustomLabel ?? '';
    } else if (type === 'role') {
      initialValue = character.roleCustomLabel ?? '';
    } else if (character.goal.type === 'custom') {
      initialValue = character.goal.value;
    }
    setModalState({ type, initialValue });
  };

  const closeModal = () => {
    setModalState(null);
  };

  const handleModalSubmit = (value: string) => {
    if (!modalState) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    if (modalState.type === 'style') {
      updateCharacter((prev) => ({
        ...prev,
        styleId: CUSTOM_STYLE_ID,
        styleCustomLabel: trimmed
      }));
    } else if (modalState.type === 'role') {
      updateCharacter((prev) => ({
        ...prev,
        roleId: CUSTOM_ROLE_ID,
        roleCustomLabel: trimmed
      }));
    } else {
      handleGoalCustom(trimmed);
    }
    setModalState(null);
  };

  const handleGearNotes = (value: string) => {
    updateCharacter((prev) => ({ ...prev, gearNotes: value }));
  };

  const handleNotes = (value: string) => {
    updateCharacter((prev) => ({ ...prev, notes: value }));
  };

  const handleName = (value: string) => {
    updateCharacter((prev) => ({ ...prev, name: value }));
  };

  const handleImport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!importJson.trim()) return;
    const result = importCharacter(importJson);
    if (result.success) {
      setImportStatus('Import successful! Switched to imported character.');
      setImportJson('');
    } else {
      setImportStatus(result.message ?? 'Import failed.');
    }
  };

  const availableStyles = library.styles;
  const availableRoles = library.roles;
  const availableGoals = library.goals;
  const customStyleLabel = character.styleCustomLabel?.trim() ?? '';
  const customRoleLabel = character.roleCustomLabel?.trim() ?? '';
  const customGoalLabel = character.goal.type === 'custom' ? character.goal.value.trim() : '';
  const modalType = modalState?.type ?? null;
  const modalTitle = modalType ? modalTitles[modalType] : '';
  const modalDescription = modalType ? modalDescriptions[modalType] : undefined;
  const modalPlaceholder = modalType ? modalPlaceholders[modalType] : undefined;

  return (
    <>
      <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Character Builder</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Fill out the form to build your Lasers &amp; Feelings character. Everything saves automatically.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={createCharacter}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            New Character
          </button>
          <button
            type="button"
            onClick={saveAsNew}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Save As
          </button>
          <PDFExportButton targetId={pdfTargetId} />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div id={pdfTargetId} className="space-y-10 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/10 print:bg-white">
          <section aria-labelledby="identity-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="identity-section" className="text-xl font-semibold">
                Identity
              </h2>
              <p className="text-sm text-slate-500">Required: Name, Style, Role, and Number.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <label className="space-y-1">
                  <span className="text-sm font-medium">Name</span>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(event) => handleName(event.target.value)}
                    placeholder="Captain Example"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                    required
                  />
                </label>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Number</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={character.number}
                      onChange={(event) => setNumber(Number(event.target.value) as LFNumber)}
                      aria-describedby="number-help"
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-primary-200 accent-primary-600"
                    />
                    <output className="min-w-[3rem] text-center text-lg font-semibold" aria-live="polite">
                      {character.number}
                    </output>
                  </div>
                  <p id="number-help" className="text-xs text-slate-500">
                    Pick 2-5. Low numbers favor LASERS (logic, precision). High numbers favor FEELINGS (passion, intuition).
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {character.portrait ? (
                  <img
                    src={character.portrait.dataUrl}
                    alt="Character portrait preview"
                    className="mx-auto h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center">Portrait appears here when added.</div>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="style-section" className="space-y-4">
            <h2 id="style-section" className="text-xl font-semibold">
              Style
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableStyles.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={optionButtonClass(character.styleId === option.id, option.color)}
                  style={
                    character.styleId !== option.id && option.color
                      ? { borderColor: option.color, color: option.color }
                      : undefined
                  }
                  onClick={() => setStyle(option)}
                  aria-pressed={character.styleId === option.id}
                >
                  {option.label}
                </button>
              ))}
              <button
                type="button"
                className={optionButtonClass(character.styleId === CUSTOM_STYLE_ID)}
                onClick={() => openCustomModal('style')}
                aria-pressed={character.styleId === CUSTOM_STYLE_ID}
              >
                {customStyleLabel || 'Custom'}
              </button>
            </div>
          </section>

          <section aria-labelledby="role-section" className="space-y-4">
            <h2 id="role-section" className="text-xl font-semibold">
              Role
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={optionButtonClass(character.roleId === option.id, option.color)}
                  style={
                    character.roleId !== option.id && option.color
                      ? { borderColor: option.color, color: option.color }
                      : undefined
                  }
                  onClick={() => setRole(option)}
                  aria-pressed={character.roleId === option.id}
                >
                  {option.label}
                </button>
              ))}
              <button
                type="button"
                className={optionButtonClass(character.roleId === CUSTOM_ROLE_ID)}
                onClick={() => openCustomModal('role')}
                aria-pressed={character.roleId === CUSTOM_ROLE_ID}
              >
                {customRoleLabel || 'Custom'}
              </button>
            </div>
          </section>

          <section aria-labelledby="goal-section" className="space-y-4">
            <h2 id="goal-section" className="text-xl font-semibold">
              Goal
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableGoals.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={optionButtonClass(
                    character.goal.type === 'preset' && character.goal.value === option.id,
                    option.color
                  )}
                  style={
                    !(character.goal.type === 'preset' && character.goal.value === option.id) && option.color
                      ? { borderColor: option.color, color: option.color }
                      : undefined
                  }
                  onClick={() => handleGoalPreset(option)}
                  aria-pressed={character.goal.type === 'preset' && character.goal.value === option.id}
                >
                  {option.label}
                </button>
              ))}
              <button
                type="button"
                className={optionButtonClass(character.goal.type === 'custom')}
                onClick={() => openCustomModal('goal')}
                aria-pressed={character.goal.type === 'custom'}
              >
                {customGoalLabel || 'Custom'}
              </button>
            </div>
          </section>

          <section aria-labelledby="gear-section" className="space-y-4">
            <h2 id="gear-section" className="text-xl font-semibold">
              Gear &amp; Notes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Standard Issue</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {uniformGear.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <label className="block text-sm">
                  <span className="font-medium">Extra Gear</span>
                  <textarea
                    value={character.gearNotes ?? ''}
                    onChange={(event) => handleGearNotes(event.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Jetpack, smuggled stims, etc."
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-medium">Notes</span>
                <textarea
                  value={character.notes ?? ''}
                  onChange={(event) => handleNotes(event.target.value)}
                  rows={8}
                  className="mt-1 h-full w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Allies, ship quirks, memorable quotes..."
                />
              </label>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <h3 className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Mechanics Reference</h3>
              <p className="mt-2">
                Roll <strong>LASERS</strong> (your number or under) when acting with logic, science, calm precision. Roll <strong>FEELINGS</strong> (your number or above) when acting with passion, intuition, diplomacy.
              </p>
              <p className="mt-2">
                When you roll exactly your number you gain <strong>LASER FEELINGS!</strong> Ask the GM a question and take +1 die to your next action.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <PortraitUploader
            portrait={character.portrait}
            onChange={(portrait) => updateCharacter((prev) => ({ ...prev, portrait }))}
          />
          <section aria-labelledby="export-section" className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 id="export-section" className="text-lg font-semibold">
                Import &amp; Export
              </h2>
              <span className="text-xs text-slate-500">JSON schema v1</span>
            </div>
            <div className="space-y-2">
              <label className="block text-sm">
                <span className="font-medium">Current Character JSON</span>
                <textarea
                  value={currentExport}
                  readOnly
                  rows={10}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <form onSubmit={handleImport} className="space-y-2">
                <label className="block text-sm">
                  <span className="font-medium">Paste Character JSON to Import</span>
                  <textarea
                    value={importJson}
                    onChange={(event) => setImportJson(event.target.value)}
                    rows={6}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                    placeholder={`{\n  "name": "Nova", ...\n}`}
                  />
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    Import JSON
                  </button>
                  {importStatus && <span className="text-xs text-slate-500">{importStatus}</span>}
                </div>
              </form>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold">Saved Characters</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              You currently have {list.length} saved {list.length === 1 ? 'character' : 'characters'}.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Open the Saves tab to duplicate, export, or delete characters.
            </p>
          </section>
        </div>
      </div>
    </div>
      <CustomOptionModal
        open={modalState !== null}
        title={modalTitle}
        description={modalDescription}
        placeholder={modalPlaceholder}
        initialValue={modalState?.initialValue ?? ''}
        confirmLabel="Save"
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};
