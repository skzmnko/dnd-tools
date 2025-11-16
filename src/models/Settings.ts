export interface EncounterManagerSettings {
  defaultHP: number;
  autoSave: boolean;
  roundTimer: number;
  encountersFolder: string;
  language: 'en' | 'ru';
}

export const DEFAULT_SETTINGS: EncounterManagerSettings = {
  defaultHP: 100,
  autoSave: true,
  roundTimer: 60,
  encountersFolder: 'Encounters',
  language: 'en'
}