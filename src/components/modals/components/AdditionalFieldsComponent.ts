import { Setting } from 'obsidian';
import { i18n } from 'src/services/LocalizationService';

export class AdditionalFieldsComponent {
    private skills: string = '';
    private senses: string = '';
    private notes: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('ADDITIONAL_FIELDS.TITLE'),
            cls: 'section-title'
        });

        new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.SKILLS'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.SKILLS_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.SKILLS_PLACEHOLDER'))
                .setValue(this.skills)
                .onChange(value => this.skills = value);
                text.inputEl.addClass('skills-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.SENSES'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.SENSES_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.SENSES_PLACEHOLDER'))
                .setValue(this.senses)
                .onChange(value => this.senses = value);
            text.inputEl.addClass('senses-textarea');
            text.inputEl.addClass('fixed-textarea');
            });

        new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.NOTES'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.NOTES_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.NOTES_PLACEHOLDER'))
                .setValue(this.notes)
                .onChange(value => this.notes = value);
                text.inputEl.addClass('notes-textarea');
                text.inputEl.addClass('fixed-textarea');
            });
    }

    getSkills(): string { return this.skills; }
    getSenses(): string { return this.senses; }
    getNotes(): string { return this.notes; }
}