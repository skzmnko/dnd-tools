import { Setting } from 'obsidian';
import { CREATURE_SIZES, ALIGNMENTS } from 'src/constants/Constants';
import { i18n } from 'src/services/LocalizationService';

export class BasicFieldsComponent {
    private name: string = '';
    private type: string = '';
    private size: string = 'Medium';
    private alignment: string = 'No Alignment';
    private habitat: string = '';
    private languages: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('BASIC_FIELDS.TITLE'),
            cls: 'section-title'
        });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.NAME'))
            .setDesc(i18n.t('BASIC_FIELDS.NAME_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('BASIC_FIELDS.NAME_PLACEHOLDER'))
                .onChange(value => this.name = value));

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.TYPE'))
            .setDesc(i18n.t('BASIC_FIELDS.TYPE_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('BASIC_FIELDS.TYPE_PLACEHOLDER'))
                .onChange(value => this.type = value));

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.SIZE'))
            .setDesc(i18n.t('BASIC_FIELDS.SIZE_DESC'))
            .addDropdown(dropdown => {
                CREATURE_SIZES.forEach(size => {
                    dropdown.addOption(size.value, size.label);
                });
                dropdown.setValue(this.size)
                    .onChange(value => this.size = value);
            });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.ALIGNMENT'))
            .setDesc(i18n.t('BASIC_FIELDS.ALIGNMENT_DESC'))
            .addDropdown(dropdown => {
                ALIGNMENTS.forEach(alignment => {
                    dropdown.addOption(alignment.value, alignment.label);
                });
                dropdown.setValue(this.alignment)
                    .onChange(value => this.alignment = value);
            });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.HABITAT'))
            .setDesc(i18n.t('BASIC_FIELDS.HABITAT_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('BASIC_FIELDS.HABITAT_PLACEHOLDER'))
                .setValue(this.habitat)
                .onChange(value => this.habitat = value));

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.LANGUAGES'))
            .setDesc(i18n.t('BASIC_FIELDS.LANGUAGES_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('BASIC_FIELDS.LANGUAGES_PLACEHOLDER'))
                .setValue(this.languages)
                .onChange(value => this.languages = value);
                text.inputEl.addClass('languages-textarea');
                text.inputEl.addClass('fixed-textarea');
            });
        }

    getName(): string { return this.name; }
    getType(): string { return this.type; }
    getSize(): string { return this.size; }
    getAlignment(): string { return this.alignment; }
    getHabitat(): string { return this.habitat; }
    getLanguages(): string { return this.languages; }
}