import { App, Modal, Setting, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CreatureModalStyles } from './CreatureModalStyles';
import { BasicFieldsComponent } from './components/BasicFieldsComponent';
import { CoreParametersComponent } from './components/CoreParametersComponent';
import { AbilityScoresComponent } from './components/AbilityScoresComponent';
import { AdditionalFieldsComponent } from './components/AdditionalFieldsComponent';
import { ImmunitiesComponent } from './components/ImmunitiesComponent';
import { TraitsComponent } from './components/TraitsComponent';
import { ActionsComponent } from './components/ActionsComponent';
import { BonusActionsComponent } from './components/BonusActionsComponent';
import { ReactionsComponent } from './components/ReactionsComponent';
import { LegendaryActionsComponent } from './components/LegendaryActionsComponent';

export class CreatureCreationModal extends Modal {
    private basicFields: BasicFieldsComponent;
    private coreParameters: CoreParametersComponent;
    private abilityScores: AbilityScoresComponent;
    private additionalFields: AdditionalFieldsComponent;
    private immunities: ImmunitiesComponent;
    private traits: TraitsComponent;
    private actions: ActionsComponent;
    private bonusActions: BonusActionsComponent;
    private reactions: ReactionsComponent;
    private legendaryActions: LegendaryActionsComponent;

    constructor(
        app: App, 
        private bestiaryService: any, 
        private onSave: (creature: Creature) => void
    ) {
        super(app);
        
        this.basicFields = new BasicFieldsComponent();
        this.coreParameters = new CoreParametersComponent();
        this.abilityScores = new AbilityScoresComponent();
        this.additionalFields = new AdditionalFieldsComponent();
        this.immunities = new ImmunitiesComponent();
        this.traits = new TraitsComponent();
        this.actions = new ActionsComponent();
        this.bonusActions = new BonusActionsComponent();
        this.reactions = new ReactionsComponent();
        this.legendaryActions = new LegendaryActionsComponent();
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Добавить существо в бестиарий' });

        this.applyStyles(contentEl);
        this.renderComponents(contentEl);
        this.renderSaveButtons(contentEl);
        
        // Устанавливаем связь между компонентами после рендера
        this.setupComponentConnections();
    }

    private applyStyles(contentEl: HTMLElement) {
        const style = contentEl.createEl('style');
        style.textContent = CreatureModalStyles;
    }

    private setupComponentConnections() {
        // При изменении бонуса мастерства обновляем спасброски
        this.coreParameters.onProficiencyBonusChange((bonus: number) => {
            this.abilityScores.setProficiencyBonus(bonus);
        });

        // При изменении характеристик обновляем инициативу
        this.abilityScores.onAbilityChange(() => {
            this.coreParameters.updateInitiative(this.abilityScores.getInitiative());
        });
    }

    private renderComponents(contentEl: HTMLElement) {
        // Общая информация
        this.basicFields.render(contentEl);

        // Основные параметры
        this.coreParameters.render(contentEl);

        // Характеристики и спасброски
        this.abilityScores.render(contentEl);

        // Дополнительные характеристики
        this.additionalFields.render(contentEl);

        // Иммунитеты и сопротивления
        this.immunities.render(contentEl);

        // Черты
        this.traits.render(contentEl);

        // Действия
        this.actions.render(contentEl);

        // Бонусные действия
        this.bonusActions.render(contentEl);

        // Реакции
        this.reactions.render(contentEl);

        // Легендарные действия
        this.legendaryActions.render(contentEl);
    }

    private renderSaveButtons(contentEl: HTMLElement) {
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Сохранить')
                .setCta()
                .onClick(() => this.saveCreature()))
            .addButton(btn => btn
                .setButtonText('Отмена')
                .onClick(() => this.close()));
    }

    private async saveCreature() {
        if (!this.basicFields.getName().trim()) {
            new Notice('Пожалуйста, введите имя существа');
            return;
        }

        const creatureData = {
            name: this.basicFields.getName(),
            type: this.basicFields.getType(),
            size: this.basicFields.getSize(),
            alignment: this.basicFields.getAlignment(),
            habitat: this.basicFields.getHabitat(),
            languages: this.basicFields.getLanguages(),
            ac: this.coreParameters.getAC(),
            hit_dice: this.coreParameters.getHitDice(),
            speed: this.coreParameters.getSpeed(),
            proficiency_bonus: this.coreParameters.getProficiencyBonus(),
            initiative: this.abilityScores.getInitiative(),
            characteristics: this.abilityScores.getCharacteristics(),
            saving_throws: this.abilityScores.calculateSavingThrows(),
            skills: this.additionalFields.getSkills(),
            senses: this.additionalFields.getSenses(),
            damage_resistances: this.immunities.getDamageResistances(),
            damage_vulnerabilities: this.immunities.getDamageVulnerabilities(),
            damage_immunities: this.immunities.getDamageImmunities(),
            condition_immunities: this.immunities.getConditionImmunities(),
            traits: this.traits.getTraits(),
            actions: this.actions.getActions(),
            bonus_actions: this.bonusActions.getBonusActions(),
            reactions: this.reactions.getReactions(),
            legendary_actions: this.legendaryActions.getLegendaryActions(),
            notes: this.additionalFields.getNotes()
        };

        try {
            const creature = await this.bestiaryService.createCreature(creatureData);
            this.onSave(creature);
            this.close();
            new Notice(`Существо "${creature.name}" добавлено в бестиарий!`);
        } catch (error) {
            console.error('Error creating creature:', error);
            new Notice('Ошибка при сохранении существа: ' + error.message);
        }
    }
}