import { Character, CharacterIndexRecord, Library } from '@/types/models';

const LIBRARY_KEY = 'lf.library.v1';
const CHARACTERS_KEY = 'lf.characters.v1';
const CHARACTER_KEY_PREFIX = 'lf.character.';

const getCharacterKey = (id: string) => `${CHARACTER_KEY_PREFIX}${id}.v1`;

export const storage = {
  saveLibrary(library: Library) {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  },
  readLibrary(): Library | undefined {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as Library;
    } catch (error) {
      console.warn('Failed to parse library from storage', error);
      return undefined;
    }
  },
  saveCharacterList(list: CharacterIndexRecord[]) {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(list));
  },
  readCharacterList(): CharacterIndexRecord[] | undefined {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as CharacterIndexRecord[];
    } catch (error) {
      console.warn('Failed to parse character list from storage', error);
      return undefined;
    }
  },
  saveCharacter(character: Character) {
    localStorage.setItem(getCharacterKey(character.id), JSON.stringify(character));
  },
  readCharacter(id: string): Character | undefined {
    const raw = localStorage.getItem(getCharacterKey(id));
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as Character;
    } catch (error) {
      console.warn('Failed to parse character from storage', error);
      return undefined;
    }
  },
  deleteCharacter(id: string) {
    localStorage.removeItem(getCharacterKey(id));
    const list = storage.readCharacterList();
    if (!list) return;
    const nextList = list.filter((item) => item.id !== id);
    storage.saveCharacterList(nextList);
  }
};
