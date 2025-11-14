import { Setting, Notice } from 'obsidian';
import { CreatureTrait } from 'src/models/Bestiary';
import { i18n } from 'src/services/LocalizationService';

export class TraitsComponent {
    private traits: CreatureTrait[] = [];
    private newTraitName: string = '';
    private newTraitDesc: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('TRAITS.TITLE'),
            cls: 'section-title'
        });

        this.renderAddTraitForm(section);
        this.renderTraitsList(section);
    }

    private renderAddTraitForm(container: HTMLElement) {
        const addTraitContainer = container.createDiv({ cls: 'add-trait-container' });
        
        new Setting(addTraitContainer)
            .setName(i18n.t('TRAITS.TRAIT_NAME'))
            .setDesc(i18n.t('TRAITS.TRAIT_NAME_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('TRAITS.TRAIT_NAME_PLACEHOLDER'))
                .onChange(value => this.newTraitName = value));

        new Setting(addTraitContainer)
            .setName(i18n.t('TRAITS.TRAIT_DESC'))
            .setDesc(i18n.t('TRAITS.TRAIT_DESC_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('TRAITS.TRAIT_DESC_PLACEHOLDER'))
                .onChange(value => this.newTraitDesc = value);
                text.inputEl.addClass('trait-desc-textarea');
                text.inputEl.addClass('wide-textarea');
        });

        new Setting(addTraitContainer)
            .addButton(btn => btn
                .setButtonText(i18n.t('TRAITS.ADD_TRAIT'))
                .setCta()
                .onClick(() => {
                    if (!this.newTraitName.trim()) {
                        new Notice(i18n.t('TRAITS.VALIDATION'));
                        return;
                    }

                    if (this.traits.length >= 10) {
                        new Notice(i18n.t('TRAITS.MAX_REACHED'));
                        return;
                    }

                    const newTrait: CreatureTrait = {
                        name: this.newTraitName,
                        desc: this.newTraitDesc
                    };

                    this.traits.push(newTrait);
                    
                    this.newTraitName = '';
                    this.newTraitDesc = '';
                    
                    const nameInput = addTraitContainer.querySelector(`input[placeholder="${i18n.t('TRAITS.TRAIT_NAME')}"]`) as HTMLInputElement;
                    const descInput = addTraitContainer.querySelector('textarea') as HTMLTextAreaElement;
                    if (nameInput) nameInput.value = '';
                    if (descInput) descInput.value = '';

                    this.updateTraitsList(container);
                    new Notice(i18n.t('TRAITS.SUCCESS', { name: newTrait.name }));
                }));
    }

    private renderTraitsList(container: HTMLElement) {
        const traitsListContainer = container.createDiv({ cls: 'traits-list-container' });
        traitsListContainer.createEl('div', { 
            text: i18n.t('TRAITS.ADDED_TRAITS'),
            cls: 'traits-list-title'
        });
        
        const traitsListEl = traitsListContainer.createDiv({ 
            cls: 'traits-list',
            attr: { id: 'traits-list' }
        });
        
        this.updateTraitsList(container);
    }

    private updateTraitsList(container: HTMLElement) {
        const traitsListEl = container.querySelector('#traits-list');
        if (!traitsListEl) return;
        
        traitsListEl.empty();
        
        if (this.traits.length === 0) {
            traitsListEl.createEl('div', { 
                text: i18n.t('TRAITS.NO_TRAITS'),
                cls: 'traits-empty'
            });
            return;
        }
        
        this.traits.forEach((trait, index) => {
            const traitItem = traitsListEl.createDiv({ cls: 'trait-item' });
            
            const traitHeader = traitItem.createDiv({ cls: 'trait-header' });
            traitHeader.createEl('strong', { text: trait.name });
            
            const traitDesc = traitItem.createDiv({ cls: 'trait-desc' });
            traitDesc.setText(trait.desc);
            
            const removeBtn = traitItem.createEl('button', {
                text: i18n.t('COMMON.DELETE'),
                cls: 'trait-remove mod-warning'
            });
            
            removeBtn.addEventListener('click', () => {
                this.traits.splice(index, 1);
                this.updateTraitsList(container);
                new Notice(i18n.t('TRAITS.DELETE_SUCCESS', { name: trait.name }));
            });
        });
    }

    // Геттеры
    getTraits(): CreatureTrait[] { return this.traits; }
}