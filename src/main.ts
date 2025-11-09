import { Plugin } from 'obsidian';
import { EncounterManagerSettings, DEFAULT_SETTINGS } from 'src/models/Settings';
import { EncounterService } from 'src/services/EncounterService';
import { UIService } from 'src/services/UIService';
import { EncounterTypeModal } from 'src/components/modals/EncounterTypeModal';
import { EncounterManagerSettingTab } from 'src/components/settings/EncounterManagerSettingTab';

export default class EncounterManagerPlugin extends Plugin {
    settings!: EncounterManagerSettings;
    encounterService!: EncounterService;
    uiService!: UIService;

    async onload() {
        console.log('Loading Encounter Manager plugin...');
        
        await this.loadSettings();
        
        try {
            // Инициализация сервисов
            this.encounterService = new EncounterService(this);
            this.uiService = new UIService(this.app);
            
            await this.encounterService.initialize();

            // Команды и UI
            this.addCommand({
                id: 'create-encounter',
                name: 'Create new encounter',
                callback: () => {
                    new EncounterTypeModal(this.app, this).open();
                }
            });

            this.addRibbonIcon('swords', 'Encounter Manager', () => {
                new EncounterTypeModal(this.app, this).open();
            });

            this.addSettingTab(new EncounterManagerSettingTab(this.app, this));

            this.registerMarkdownCodeBlockProcessor('encounter', (source, el, ctx) => {
                this.uiService.renderEncounterBlock(source, el, (type: string) => 
                    this.encounterService.getEncounterTypeLabel(type)
                );
            });

            console.log('Encounter Manager plugin loaded successfully');
        } catch (error) {
            console.error('Failed to load Encounter Manager plugin:', error);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}