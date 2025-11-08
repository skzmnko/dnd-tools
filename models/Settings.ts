export interface EncounterManagerSettings {
  defaultHP: number;
  autoSave: boolean;
  roundTimer: number;
  encountersFolder: string;
}

export const DEFAULT_SETTINGS: EncounterManagerSettings = {
  defaultHP: 100,
  autoSave: true,
  roundTimer: 60,
  encountersFolder: 'Encounters'
}