import { Library, Option } from '@/types/models';

const defaultStyles: Option[] = [
  { id: 'alien', label: 'Alien', source: 'default', color: '#22d3ee' },
  { id: 'android', label: 'Android', source: 'default', color: '#e2e8f0' },
  { id: 'dangerous', label: 'Dangerous', source: 'default', color: '#f97316' },
  { id: 'heroic', label: 'Heroic', source: 'default', color: '#facc15' },
  { id: 'hot-shot', label: 'Hot-Shot', source: 'default', color: '#f87171' },
  { id: 'intrepid', label: 'Intrepid', source: 'default', color: '#4ade80' },
  { id: 'savvy', label: 'Savvy', source: 'default', color: '#818cf8' }
];

const defaultRoles: Option[] = [
  { id: 'doctor', label: 'Doctor', source: 'default', color: '#22d3ee' },
  { id: 'envoy', label: 'Envoy', source: 'default', color: '#f97316' },
  { id: 'engineer', label: 'Engineer', source: 'default', color: '#38bdf8' },
  { id: 'explorer', label: 'Explorer', source: 'default', color: '#a78bfa' },
  { id: 'pilot', label: 'Pilot', source: 'default', color: '#f59e0b' },
  { id: 'scientist', label: 'Scientist', source: 'default', color: '#4ade80' },
  { id: 'soldier', label: 'Soldier', source: 'default', color: '#f87171' }
];

const defaultGoals: Option[] = [
  { id: 'become-captain', label: 'Become Captain', source: 'default' },
  { id: 'meet-new-aliens', label: 'Meet New Aliens', source: 'default' },
  { id: 'shoot-bad-guys', label: 'Shoot Bad Guys', source: 'default' },
  { id: 'find-new-worlds', label: 'Find New Worlds', source: 'default' },
  { id: 'solve-weird-space-mysteries', label: 'Solve Weird Space Mysteries', source: 'default' },
  { id: 'prove-yourself', label: 'Prove Yourself', source: 'default' },
  { id: 'keep-being-awesome', label: 'Keep Being Awesome', source: 'default' }
];

export const defaultLibrary: Library = {
  styles: defaultStyles,
  roles: defaultRoles,
  goals: defaultGoals
};

export const uniformGear = [
  'Consortium uniform (vacc-suit)',
  'Multi-tool & translator device',
  'Variable-beam phase pistol (stun default)'
];
