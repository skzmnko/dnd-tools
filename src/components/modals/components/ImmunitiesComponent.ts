import { Setting, Notice } from 'obsidian';
import { DAMAGE_TYPES, CONDITION_NAMES, DamageType } from 'src/constants/Constants';
import { i18n } from 'src/services/LocalizationService';

export class ImmunitiesComponent {
    private damage_resistances: string[] = [];
    private damage_vulnerabilities: string[] = [];
    private damage_immunities: string[] = [];
    private condition_immunities: string[] = [];

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('IMMUNITIES.TITLE'),
            cls: 'section-title'
        });

        this.renderDamageResistances(section);
        this.renderDamageVulnerabilities(section);
        this.renderDamageImmunities(section);
        this.renderConditionImmunities(section);
    }

    private renderDamageResistances(container: HTMLElement) {
        new Setting(container)
            .setName(i18n.t('IMMUNITIES.DAMAGE_RESISTANCES'))
            .setDesc(i18n.t('IMMUNITIES.DAMAGE_RESISTANCES_DESC'))
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', i18n.t('IMMUNITIES.SELECT_DAMAGE'));
                
                DAMAGE_TYPES.forEach((damageType: DamageType) => {
                    dropdown.addOption(damageType, damageType);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.damage_resistances.includes(value)) {
                        this.damage_resistances.push(value);
                        this.updateSelectedValues(container, 'damage-resistances-list', this.damage_resistances);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'damage-resistances-list', i18n.t('IMMUNITIES.SELECTED_RESISTANCES'), this.damage_resistances);
    }

    private renderDamageVulnerabilities(container: HTMLElement) {
        new Setting(container)
            .setName(i18n.t('IMMUNITIES.DAMAGE_VULNERABILITIES'))
            .setDesc(i18n.t('IMMUNITIES.DAMAGE_VULNERABILITIES_DESC'))
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', i18n.t('IMMUNITIES.SELECT_DAMAGE'));
                
                DAMAGE_TYPES.forEach((damageType: DamageType) => {
                    dropdown.addOption(damageType, damageType);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.damage_vulnerabilities.includes(value)) {
                        this.damage_vulnerabilities.push(value);
                        this.updateSelectedValues(container, 'damage-vulnerabilities-list', this.damage_vulnerabilities);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'damage-vulnerabilities-list', i18n.t('IMMUNITIES.SELECTED_VULNERABILITIES'), this.damage_vulnerabilities);
    }

    private renderDamageImmunities(container: HTMLElement) {
        new Setting(container)
            .setName(i18n.t('IMMUNITIES.DAMAGE_IMMUNITIES'))
            .setDesc(i18n.t('IMMUNITIES.DAMAGE_IMMUNITIES_DESC'))
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', i18n.t('IMMUNITIES.SELECT_DAMAGE'));
                
                DAMAGE_TYPES.forEach((damageType: DamageType) => {
                    dropdown.addOption(damageType, damageType);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.damage_immunities.includes(value)) {
                        this.damage_immunities.push(value);
                        this.updateSelectedValues(container, 'damage-immunities-list', this.damage_immunities);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'damage-immunities-list', i18n.t('IMMUNITIES.SELECTED_DAMAGE_IMMUNITIES'), this.damage_immunities);
    }

    private renderConditionImmunities(container: HTMLElement) {
        new Setting(container)
            .setName(i18n.t('IMMUNITIES.CONDITION_IMMUNITIES'))
            .setDesc(i18n.t('IMMUNITIES.CONDITION_IMMUNITIES_DESC'))
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', i18n.t('IMMUNITIES.SELECT_CONDITION'));
                
                CONDITION_NAMES.forEach((condition: string) => {
                    dropdown.addOption(condition, condition);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.condition_immunities.includes(value)) {
                        this.condition_immunities.push(value);
                        this.updateSelectedValues(container, 'condition-immunities-list', this.condition_immunities);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'condition-immunities-list', i18n.t('IMMUNITIES.SELECTED_CONDITION_IMMUNITIES'), this.condition_immunities);
    }

    private renderSelectedValuesList(container: HTMLElement, listId: string, title: string, values: string[]) {
        const listContainer = container.createDiv({ cls: 'selected-values-container' });
        listContainer.createEl('div', { 
            text: title,
            cls: 'selected-values-title'
        });
        
        const listEl = listContainer.createDiv({ 
            cls: 'selected-values-list',
            attr: { id: listId }
        });
        
        this.updateSelectedValues(container, listId, values);
    }

    private updateSelectedValues(container: HTMLElement, listId: string, values: string[]) {
        const listEl = container.querySelector(`#${listId}`);
        if (!listEl) return;
        
        listEl.empty();
        
        if (values.length === 0) {
            listEl.createEl('div', { 
                text: i18n.t('IMMUNITIES.NOT_SELECTED'),
                cls: 'selected-values-empty'
            });
            return;
        }
        
        values.forEach((value, index) => {
            const valueItem = listEl.createDiv({ cls: 'selected-value-item' });
            valueItem.createEl('span', { text: value });
            
            const removeBtn = valueItem.createEl('button', {
                text: i18n.t('COMMON.DELETE'),
                cls: 'selected-value-remove'
            });
            
            removeBtn.addEventListener('click', () => {
                values.splice(index, 1);
                this.updateSelectedValues(container, listId, values);
            });
        });
    }

    getDamageResistances(): string[] { return this.damage_resistances; }
    getDamageVulnerabilities(): string[] { return this.damage_vulnerabilities; }
    getDamageImmunities(): string[] { return this.damage_immunities; }
    getConditionImmunities(): string[] { return this.condition_immunities; }
}