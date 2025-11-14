import { Setting } from 'obsidian';
import { i18n } from 'src/services/LocalizationService';

export class AbilityScoresComponent {
    private characteristics: number[] = [10, 10, 10, 10, 10, 10];
    private saving_throws_proficiency: boolean[] = [false, false, false, false, false, false];
    private proficiency_bonus: number = 2;
    private onAbilityChangeCallback: (() => void) | null = null;

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('ABILITY_SCORES.TITLE'),
            cls: 'section-title'
        });
        this.renderAbilities(section);
        this.renderSavingThrows(section);
    }

    private renderAbilities(container: HTMLElement) {

        const abilitiesContainer = container.createDiv({ cls: 'abilities-horizontal-container' });

        const abilities = [
            { index: 0, label: i18n.t('ABILITY_SCORES.ABILITIES.STR'), fullName: i18n.t('ABILITY_SCORES.ABILITIES.STR_FULL') },
            { index: 1, label: i18n.t('ABILITY_SCORES.ABILITIES.DEX'), fullName: i18n.t('ABILITY_SCORES.ABILITIES.DEX_FULL') },
            { index: 2, label: i18n.t('ABILITY_SCORES.ABILITIES.CON'), fullName: i18n.t('ABILITY_SCORES.ABILITIES.CON_FULL') },
            { index: 3, label: i18n.t('ABILITY_SCORES.ABILITIES.INT'), fullName: i18n.t('ABILITY_SCORES.ABILITIES.INT_FULL') },
            { index: 4, label: i18n.t('ABILITY_SCORES.ABILITIES.WIS'), fullName: i18n.t('ABILITY_SCORES.ABILITIES.WIS_FULL') },
            { index: 5, label: i18n.t('ABILITY_SCORES.ABILITIES.CHA'), fullName: i18n.t('ABILITY_SCORES.ABILITIES.CHA_FULL') }
        ];

        abilities.forEach(ability => this.renderAbilityColumn(abilitiesContainer, ability));
    }

    private renderAbilityColumn(container: HTMLElement, ability: any) {
        const abilityCol = container.createDiv({ cls: 'ability-column' });

        abilityCol.createEl('div', { 
            text: ability.label,
            cls: 'ability-label'
        });

        const input = abilityCol.createEl('input', {
            type: 'text',
            value: this.characteristics[ability.index].toString(),
            cls: 'ability-input'
        });

        input.title = ability.fullName;

        const modifierInput = abilityCol.createEl('input', {
            type: 'text',
            value: this.formatModifier(this.calculateModifier(this.characteristics[ability.index])),
            cls: 'ability-modifier-input'
        });

        modifierInput.setAttr('readonly', 'true');
        modifierInput.title = `${ability.fullName} ${i18n.t('ABILITY_SCORES.MODIFIER_HINT')}`;

        const updateModifier = () => {
            const value = input.value;
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                this.characteristics[ability.index] = numValue;
                const modifier = this.calculateModifier(numValue);
                modifierInput.value = this.formatModifier(modifier);
                
                if (this.onAbilityChangeCallback) {
                    this.onAbilityChangeCallback();
                }
                
                this.updateSavingThrowsDisplay();
            }
        };

        input.addEventListener('input', updateModifier);

        input.addEventListener('blur', (e) => {
            const value = (e.target as HTMLInputElement).value;
            const numValue = Number(value);
            if (isNaN(numValue) || value.trim() === '') {
                this.characteristics[ability.index] = 10;
                (e.target as HTMLInputElement).value = '10';
                const modifier = this.calculateModifier(10);
                modifierInput.value = this.formatModifier(modifier);
                
                if (this.onAbilityChangeCallback) {
                    this.onAbilityChangeCallback();
                }
                
                this.updateSavingThrowsDisplay();
            }
        });
    }

    private renderSavingThrows(container: HTMLElement) {
        const savingThrowsHeader = container.createEl('h3', { 
            text: i18n.t('ABILITY_SCORES.SAVING_THROWS'),
            cls: 'saving-throws-header'
        });
        savingThrowsHeader.style.textAlign = 'center';
        savingThrowsHeader.style.marginTop = '20px';

        const savingThrowsContainer = container.createDiv({ cls: 'saving-throws-container' });

        const savingThrows = [
            { index: 0, label: i18n.t('ABILITY_SCORES.ABILITIES.STR'), fullName: `${i18n.t('ABILITY_SCORES.SAVING_THROWS')} ${i18n.t('ABILITY_SCORES.ABILITIES.STR_FULL')}` },
            { index: 1, label: i18n.t('ABILITY_SCORES.ABILITIES.DEX'), fullName: `${i18n.t('ABILITY_SCORES.SAVING_THROWS')} ${i18n.t('ABILITY_SCORES.ABILITIES.DEX_FULL')}` },
            { index: 2, label: i18n.t('ABILITY_SCORES.ABILITIES.CON'), fullName: `${i18n.t('ABILITY_SCORES.SAVING_THROWS')} ${i18n.t('ABILITY_SCORES.ABILITIES.CON_FULL')}` },
            { index: 3, label: i18n.t('ABILITY_SCORES.ABILITIES.INT'), fullName: `${i18n.t('ABILITY_SCORES.SAVING_THROWS')} ${i18n.t('ABILITY_SCORES.ABILITIES.INT_FULL')}` },
            { index: 4, label: i18n.t('ABILITY_SCORES.ABILITIES.WIS'), fullName: `${i18n.t('ABILITY_SCORES.SAVING_THROWS')} ${i18n.t('ABILITY_SCORES.ABILITIES.WIS_FULL')}` },
            { index: 5, label: i18n.t('ABILITY_SCORES.ABILITIES.CHA'), fullName: `${i18n.t('ABILITY_SCORES.SAVING_THROWS')} ${i18n.t('ABILITY_SCORES.ABILITIES.CHA_FULL')}` }
        ];

        savingThrows.forEach(savingThrow => {
            const savingThrowCol = savingThrowsContainer.createDiv({ cls: 'saving-throw-column' });

            savingThrowCol.createEl('div', { 
                text: savingThrow.label,
                cls: 'saving-throw-label'
            });

            const savingThrowInput = savingThrowCol.createEl('input', {
                type: 'text',
                value: this.formatModifier(this.calculateSavingThrowValue(savingThrow.index)),
                cls: 'saving-throw-input'
            });

            savingThrowInput.setAttr('readonly', 'true');
            savingThrowInput.title = savingThrow.fullName;

            savingThrowInput.addEventListener('click', () => {
                this.toggleSavingThrowProficiency(savingThrow.index, savingThrowInput);
            });

            const hint = savingThrowCol.createEl('div', {
                text: i18n.t('ABILITY_SCORES.CLICK_HINT'),
                cls: 'saving-throw-hint'
            });
        });
    }

    private toggleSavingThrowProficiency(abilityIndex: number, inputElement: HTMLInputElement) {
        this.saving_throws_proficiency[abilityIndex] = !this.saving_throws_proficiency[abilityIndex];
        
        if (this.saving_throws_proficiency[abilityIndex]) {
            inputElement.addClass('saving-throw-active');
            inputElement.title += ` (${i18n.t('ABILITY_SCORES.PROFICIENCY_HINT')})`;
        } else {
            inputElement.removeClass('saving-throw-active');
            inputElement.title = inputElement.title.replace(` (${i18n.t('ABILITY_SCORES.PROFICIENCY_HINT')})`, '');
        }
        
        inputElement.value = this.formatModifier(this.calculateSavingThrowValue(abilityIndex));
    }

    calculateSavingThrows(): number[] {
        return this.characteristics.map((abilityScore, index) => {
            const baseModifier = this.calculateModifier(abilityScore);
            if (this.saving_throws_proficiency[index]) {
                return baseModifier + this.proficiency_bonus;
            }
            return baseModifier;
        });
    }

    private calculateSavingThrowValue(abilityIndex: number): number {
        const baseModifier = this.calculateModifier(this.characteristics[abilityIndex]);
        if (this.saving_throws_proficiency[abilityIndex]) {
            return baseModifier + this.proficiency_bonus;
        }
        return baseModifier;
    }

    private calculateModifier(abilityScore: number): number {
        return Math.floor((abilityScore - 10) / 2);
    }

    private formatModifier(modifier: number): string {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }

    getInitiative(): number {
        return this.calculateModifier(this.characteristics[1]);
    }

    private updateSavingThrowsDisplay(): void {
        const savingThrowInputs = document.querySelectorAll('.saving-throw-input');
        savingThrowInputs.forEach((input, index) => {
            if (index < this.saving_throws_proficiency.length) {
                (input as HTMLInputElement).value = this.formatModifier(this.calculateSavingThrowValue(index));
            }
        });
    }

    onAbilityChange(callback: () => void) {
        this.onAbilityChangeCallback = callback;
    }

    getCharacteristics(): number[] { return this.characteristics; }
    getSavingThrowsProficiency(): boolean[] { return this.saving_throws_proficiency; }
    setProficiencyBonus(bonus: number) { 
        this.proficiency_bonus = bonus; 
        this.updateSavingThrowsDisplay();
    }
}