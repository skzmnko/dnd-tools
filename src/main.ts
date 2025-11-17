// main.ts
import { Plugin } from 'obsidian';
import { EncounterManagerSettings, DEFAULT_SETTINGS } from 'src/models/Settings';
import { BestiaryService } from 'src/services/BestiaryService';
import { BestiaryPanel, BESTIARY_VIEW_TYPE } from 'src/components/panels/BestiaryPanel';
import { EncounterService } from 'src/services/EncounterService';
import { UIService } from 'src/services/UIService';
import { EncounterTypeModal } from 'src/components/modals/EncounterTypeModal';
import { DnDToolsSettingTab } from 'src/components/settings/DnDToolsSettingTab';
import { i18n } from 'src/services/LocalizationService';

export default class DnDToolsPlugin extends Plugin {
    settings!: EncounterManagerSettings;
    encounterService!: EncounterService;
    uiService!: UIService;
    bestiaryService!: BestiaryService;

    async onload() {
        console.log('Loading D&D Tools plugin...');
        await this.loadSettings();
        this.setupLocalization();
        
        try {
            this.encounterService = new EncounterService(this);
            this.uiService = new UIService(this.app);
            this.bestiaryService = new BestiaryService(this);
            await this.encounterService.initialize();
            await this.bestiaryService.initialize();

            this.addCommand({
                id: 'create-encounter',
                name: this.getLocalizedCommandName('Create new encounter', 'Создать новую встречу'),
                callback: () => {
                    new EncounterTypeModal(this.app, this).open();
                }
            });

            this.addCommand({
                id: 'open-bestiary',
                name: this.getLocalizedCommandName('Open Bestiary', 'Открыть Бестиарий'),
                callback: () => {
                    this.activateBestiaryView();
                }
            });

            this.addRibbonIcon('swords', this.getLocalizedCommandName('Encounter Manager', 'Менеджер встреч'), () => {
                new EncounterTypeModal(this.app, this).open();
            });

            this.addRibbonIcon('feather', this.getLocalizedCommandName('Open Bestiary', 'Открыть Бестиарий'), () => {
                this.activateBestiaryView();
            });

            this.addSettingTab(new DnDToolsSettingTab(this.app, this));
            this.registerView(
                BESTIARY_VIEW_TYPE,
                (leaf) => new BestiaryPanel(leaf, this.bestiaryService)
            );

            this.registerMarkdownCodeBlockProcessor('encounter', (source, el, ctx) => {
                this.uiService.renderEncounterBlock(source, el, (type: string) => 
                    this.encounterService.getEncounterTypeLabel(type)
                );
            });

            console.log('D&D Tools plugin loaded successfully');
        } catch (error) {
            console.error('Failed to load D&D Tools plugin:', error);
        }
    }

    private setupLocalization() {
        i18n.setLocale(this.settings.language);

        i18n.onLocaleChange(() => {
            this.refreshAllBestiaryViews();
        });
    }

    private refreshAllBestiaryViews() {
        this.app.workspace.getLeavesOfType(BESTIARY_VIEW_TYPE).forEach(leaf => {
            const view = leaf.view as BestiaryPanel;
            if (view && typeof (view as any).refreshLocalization === 'function') {
                (view as any).refreshLocalization();
            }
        });
    }

    private getLocalizedCommandName(enName: string, ruName: string): string {
        return this.settings.language === 'ru' ? ruName : enName;
    }

    async activateBestiaryView() {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(BESTIARY_VIEW_TYPE)[0];

        if (!leaf) {
            const rightLeaf = workspace.getRightLeaf(false);
            if (rightLeaf) {
                leaf = rightLeaf;
                await leaf.setViewState({
                    type: BESTIARY_VIEW_TYPE,
                    active: true,
                });
            } else {
                leaf = workspace.getLeaf('tab');
                await leaf.setViewState({
                    type: BESTIARY_VIEW_TYPE,
                    active: true,
                });
            }
        }

        workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    getEncountersFolderPath(): string {
        return `${this.manifest.dir}/encounters`;
    }

    onunload() {
        i18n.offLocaleChange(this.refreshAllBestiaryViews);
    }
}