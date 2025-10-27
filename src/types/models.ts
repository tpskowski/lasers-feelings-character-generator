export type LFNumber = 2 | 3 | 4 | 5;

export const CUSTOM_STYLE_ID = 'custom-style';
export const CUSTOM_ROLE_ID = 'custom-role';

export type GoalValue = {
  type: 'preset' | 'custom';
  value: string;
};

export type CharacterPortrait = {
  mime: 'image/jpeg' | 'image/png';
  dataUrl: string;
  width: number;
  height: number;
};

export type Character = {
  id: string;
  version: 1;
  createdAt: string;
  updatedAt: string;
  name: string;
  styleId: string;
  styleCustomLabel?: string;
  roleId: string;
  roleCustomLabel?: string;
  number: LFNumber;
  goal: GoalValue;
  gearNotes?: string;
  notes?: string;
  portrait?: CharacterPortrait;
};

export type OptionSource = 'default' | 'custom';

export type Option = {
  id: string;
  label: string;
  source: OptionSource;
  color?: string;
  description?: string;
};

export type Library = {
  styles: Option[];
  roles: Option[];
  goals: Option[];
};

export type CharacterIndexRecord = {
  id: string;
  name: string;
  updatedAt: string;
  styleLabel: string;
  roleLabel: string;
  portraitThumb?: string;
};
