import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CreatureCreationModal } from 'src/components/modals/CreatureCreationModal';
import { i18n } from 'src/services/LocalizationService';

export const BESTIARY_VIEW_TYPE = 'bestiary-view';

export class BestiaryPanel extends ItemView {
    bestiaryService: any;
    creatures: Creature[] = [];

    constructor(leaf: WorkspaceLeaf, bestiaryService: any) {
        super(leaf);
        this.bestiaryService = bestiaryService;
    }

    getViewType(): string {
        return BESTIARY_VIEW_TYPE;
    }

    getDisplayText(): string {
        return i18n.t('BESTIARY.TITLE');
    }

    getIcon(): string {
        return 'dragon';
    }

    async onOpen() {
        await this.loadCreatures();
        this.render();
    }

    async onClose() {
    }

    async loadCreatures() {
        this.creatures = this.bestiaryService.getAllCreatures();
    }

    render() {
        const container = this.containerEl.children[1];
        container.empty();
        const header = container.createDiv({ cls: 'bestiary-header' });
        header.createEl('h2', { text: i18n.t('BESTIARY.TITLE') });

        const addButton = header.createEl('button', { 
            text: i18n.t('BESTIARY.ADD_CREATURE'),
            cls: 'mod-cta'
        });
        addButton.addEventListener('click', () => {
            this.openCreatureCreationModal();
        });

        const creaturesList = container.createDiv({ cls: 'bestiary-list' });

        if (this.creatures.length === 0) {
            creaturesList.createEl('p', { 
                text: i18n.t('BESTIARY.NO_CREATURES'),
                cls: 'bestiary-empty'
            });
            return;
        }

        const sortedCreatures = [...this.creatures].sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        const groupedCreatures = this.groupCreaturesByFirstLetter(sortedCreatures);
        
        this.renderGroupedCreaturesList(creaturesList, groupedCreatures);
    }

    private groupCreaturesByFirstLetter(creatures: Creature[]): Map<string, Creature[]> {
        const groups = new Map<string, Creature[]>();
        
        creatures.forEach(creature => {
            const firstLetter = creature.name.charAt(0).toUpperCase();
            if (!groups.has(firstLetter)) {
                groups.set(firstLetter, []);
            }
            groups.get(firstLetter)!.push(creature);
        });
        
        return groups;
    }

    private renderGroupedCreaturesList(container: HTMLElement, groupedCreatures: Map<string, Creature[]>) {
        const sortedLetters = Array.from(groupedCreatures.keys()).sort();

        sortedLetters.forEach(letter => {
            const creatures = groupedCreatures.get(letter)!;
            const letterSection = container.createDiv({ cls: 'bestiary-letter-section' });
            letterSection.createEl('h3', { 
                text: letter,
                cls: 'bestiary-letter-header'
            });

            const creaturesContainer = letterSection.createDiv({ cls: 'bestiary-creatures-container' });
            
            creatures.forEach(creature => {
                this.renderCreatureListItem(creaturesContainer, creature);
            });
        });
    }

    renderCreatureListItem(container: HTMLElement, creature: Creature) {
        const creatureEl = container.createDiv({ cls: 'creature-list-item' });
        
        const nameRow = creatureEl.createDiv({ cls: 'creature-name-row' });
        const nameLink = nameRow.createEl('a', { 
            text: creature.name,
            cls: 'creature-name-link'
        });
        
        nameLink.addEventListener('click', () => {
            new Notice(i18n.t('BESTIARY.VIEW_IN_PROGRESS'));
        });

        const detailsRow = creatureEl.createDiv({ cls: 'creature-details-row' });
        const detailsText = i18n.t('BESTIARY.CREATURE_DETAILS', {
            type: creature.type,
            size: creature.size,
            bonus: creature.proficiency_bonus.toString()
        });
        detailsRow.createEl('span', { 
            text: detailsText,
            cls: 'creature-details'
        });
        
        const actions = creatureEl.createDiv({ cls: 'creature-actions' });
        const editBtn = actions.createEl('button', { 
            text: i18n.t('BESTIARY.EDIT'),
            cls: 'mod-secondary'
        });
        editBtn.addEventListener('click', () => {
            new Notice(i18n.t('BESTIARY.EDIT_IN_PROGRESS'));
        });

        const deleteBtn = actions.createEl('button', { 
            text: i18n.t('BESTIARY.DELETE'),
            cls: 'mod-warning'
        });
        deleteBtn.addEventListener('click', async () => {
            const success = await this.bestiaryService.deleteCreature(creature.id);
            if (success) {
                new Notice(i18n.t('BESTIARY.DELETE_SUCCESS', { name: creature.name }));
                await this.loadCreatures();
                this.render();
            }
        });
    }

    openCreatureCreationModal() {
        const onSave = async (creature: Creature) => {
            await this.loadCreatures();
            this.render();
        };

        new CreatureCreationModal(this.app, this.bestiaryService, onSave).open();
    }
}