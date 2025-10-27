import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Character,
  CharacterIndexRecord,
  GoalValue,
  Library,
  Option,
  CUSTOM_STYLE_ID,
  CUSTOM_ROLE_ID
} from '@/types/models';
import { defaultLibrary } from '@/lib/defaults';
import { storage } from '@/utils/storage';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useLibrary } from './LibraryContext';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type CharacterContextValue = {
  character: Character;
  updateCharacter: (updater: (prev: Character) => Character) => void;
  resetCharacter: () => void;
  createCharacter: () => void;
  saveAsNew: () => void;
  duplicateCharacter: (id: string) => void;
  deleteCharacter: (id: string) => void;
  loadCharacter: (id: string) => void;
  list: CharacterIndexRecord[];
  saveState: SaveState;
  exportCharacter: (id: string) => string | undefined;
  importCharacter: (json: string) => { success: boolean; message?: string };
};

const CharacterContext = createContext<CharacterContextValue | undefined>(undefined);

const createInitialCharacter = (library: Library): Character => {
  const style = library.styles[0] ?? defaultLibrary.styles[0];
  const role = library.roles[0] ?? defaultLibrary.roles[0];
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    version: 1,
    createdAt: now,
    updatedAt: now,
    name: '',
    styleId: style?.id ?? 'style',
    roleId: role?.id ?? 'role',
    number: 3,
    goal: { type: 'preset', value: library.goals[0]?.id ?? 'goal-custom' },
    gearNotes: '',
    notes: ''
  };
};

const findOptionLabel = (options: Option[], id: string): string => {
  const match = options.find((option) => option.id === id);
  return match?.label ?? 'Unknown';
};

const resolveStyleLabel = (character: Character, library: Library): string => {
  if (character.styleId === CUSTOM_STYLE_ID) {
    return character.styleCustomLabel?.trim() || 'Custom Style';
  }
  const label = findOptionLabel(library.styles, character.styleId);
  if (label === 'Unknown' && character.styleCustomLabel) {
    return character.styleCustomLabel;
  }
  return label;
};

const resolveRoleLabel = (character: Character, library: Library): string => {
  if (character.roleId === CUSTOM_ROLE_ID) {
    return character.roleCustomLabel?.trim() || 'Custom Role';
  }
  const label = findOptionLabel(library.roles, character.roleId);
  if (label === 'Unknown' && character.roleCustomLabel) {
    return character.roleCustomLabel;
  }
  return label;
};

const makeIndexRecord = (
  character: Character,
  library: Library
): CharacterIndexRecord => ({
  id: character.id,
  name: character.name || 'Untitled Character',
  updatedAt: character.updatedAt,
  styleLabel: resolveStyleLabel(character, library),
  roleLabel: resolveRoleLabel(character, library),
  portraitThumb: character.portrait?.dataUrl
});

const parseCharacterJson = (json: string): Character | undefined => {
  try {
    const parsed = JSON.parse(json) as Character;
    if (parsed.version !== 1) return undefined;
    return parsed;
  } catch (error) {
    console.warn('Failed to parse character json', error);
    return undefined;
  }
};

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const { library } = useLibrary();
  const [character, setCharacter] = useState<Character>(() => {
    const list = storage.readCharacterList();
    if (list && list.length > 0) {
      const mostRecent = [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0];
      const stored = storage.readCharacter(mostRecent.id);
      if (stored) {
        return stored;
      }
    }
    return createInitialCharacter(library);
  });
  const [list, setList] = useState<CharacterIndexRecord[]>(() => storage.readCharacterList() ?? []);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const normalizeGoal = useCallback(
    (goal: GoalValue, currentLibrary: Library): GoalValue => {
      if (goal.type === 'preset') {
        const exists = currentLibrary.goals.some((g) => g.id === goal.value);
        if (!exists) {
          return { type: 'custom', value: goal.value };
        }
      }
      return goal;
    },
    []
  );

  useEffect(() => {
    setCharacter((prev) => ({ ...prev, goal: normalizeGoal(prev.goal, library) }));
  }, [library, normalizeGoal]);

  const debouncedSave = useDebouncedCallback((next: Character) => {
    try {
      setSaveState('saving');
      storage.saveCharacter(next);
      const indexRecord = makeIndexRecord(next, library);
      setList((prev) => {
        const others = prev.filter((item) => item.id !== next.id);
        const updated = [indexRecord, ...others];
        storage.saveCharacterList(updated);
        return updated;
      });
      setSaveState('saved');
    } catch (error) {
      console.error(error);
      setSaveState('error');
    }
  }, 500);

  useEffect(() => {
    debouncedSave(character);
  }, [character, debouncedSave]);

  useEffect(() => {
    if (saveState === 'saved') {
      const timeout = window.setTimeout(() => setSaveState('idle'), 2000);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [saveState]);

  const updateCharacter = useCallback((updater: (prev: Character) => Character) => {
    setCharacter((prev) => {
      const next = updater(prev);
      return { ...next, updatedAt: new Date().toISOString() };
    });
  }, []);

  const resetCharacter = useCallback(() => {
    setCharacter(createInitialCharacter(library));
  }, [library]);

  const createCharacter = useCallback(() => {
    const fresh = createInitialCharacter(library);
    setCharacter(fresh);
  }, [library]);

  const saveAsNew = useCallback(() => {
    setCharacter((prev) => {
      const now = new Date().toISOString();
      const fresh: Character = {
        ...prev,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      storage.saveCharacter(fresh);
      const indexRecord = makeIndexRecord(fresh, library);
      setList((current) => {
        const updated = [indexRecord, ...current];
        storage.saveCharacterList(updated);
        return updated;
      });
      return fresh;
    });
  }, [library]);

  const duplicateCharacter = useCallback(
    (id: string) => {
      const existing = storage.readCharacter(id);
      if (!existing) return;
      const now = new Date().toISOString();
      const duplicate: Character = {
        ...existing,
        id: uuidv4(),
        name: `${existing.name} (Copy)`,
        createdAt: now,
        updatedAt: now
      };
      storage.saveCharacter(duplicate);
      const indexRecord = makeIndexRecord(duplicate, library);
      setList((prev) => {
        const updated = [indexRecord, ...prev];
        storage.saveCharacterList(updated);
        return updated;
      });
      setCharacter(duplicate);
    },
    [library]
  );

  const deleteCharacter = useCallback((id: string) => {
    storage.deleteCharacter(id);
    setList((prev) => prev.filter((item) => item.id !== id));
    if (character.id === id) {
      setCharacter(createInitialCharacter(library));
    }
  }, [character.id, library]);

  const loadCharacter = useCallback((id: string) => {
    const stored = storage.readCharacter(id);
    if (stored) {
      setCharacter(stored);
    }
  }, []);

  const exportCharacter = useCallback(
    (id: string) => {
      const stored = storage.readCharacter(id);
      if (!stored) return undefined;
      return JSON.stringify(stored, null, 2);
    },
    []
  );

  const importCharacter = useCallback(
    (json: string) => {
      const parsed = parseCharacterJson(json);
      if (!parsed) {
        return { success: false, message: 'Invalid character JSON or schema version' };
      }
      const now = new Date().toISOString();
      const imported: Character = {
        ...parsed,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      storage.saveCharacter(imported);
      const indexRecord = makeIndexRecord(imported, library);
      setList((prev) => {
        const updated = [indexRecord, ...prev];
        storage.saveCharacterList(updated);
        return updated;
      });
      setCharacter(imported);
      return { success: true };
    },
    [library]
  );

  const value = useMemo(
    () => ({
      character,
      updateCharacter,
      resetCharacter,
      createCharacter,
      saveAsNew,
      duplicateCharacter,
      deleteCharacter,
      loadCharacter,
      list,
      saveState,
      exportCharacter,
      importCharacter
    }),
    [
      character,
      updateCharacter,
      resetCharacter,
      createCharacter,
      saveAsNew,
      duplicateCharacter,
      deleteCharacter,
      loadCharacter,
      list,
      saveState,
      exportCharacter,
      importCharacter
    ]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => {
  const ctx = useContext(CharacterContext);
  if (!ctx) {
    throw new Error('useCharacter must be used within CharacterProvider');
  }
  return ctx;
};
