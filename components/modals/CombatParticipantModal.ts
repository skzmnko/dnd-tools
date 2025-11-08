import { App, Modal, Setting, Notice } from 'obsidian';
import { Participant } from '../../models/Encounter';

export class CombatParticipantModal extends Modal {
    parentModal: any; // Используем any чтобы избежать циклических зависимостей
    name: string = '';
    type: 'pc' | 'npc' | 'monster' | 'trap' = 'monster';
    hp: number = 30;
    maxHp: number = 30;
    ac: number = 13;

    constructor(app: App, parentModal: any) {
        super(app);
        this.parentModal = parentModal;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: 'Добавить участника' });

        // Имя участника
        new Setting(contentEl)
            .setName('Имя')
            .setDesc('Имя участника')
            .addText(text => text
                .setPlaceholder('Гоблин-воин')
                .onChange(value => {
                    this.name = value;
                }));

        // Тип участника
        new Setting(contentEl)
            .setName('Тип')
            .setDesc('Тип участника')
            .addDropdown(dropdown => dropdown
                .addOption('pc', 'Игрок')
                .addOption('npc', 'NPC')
                .addOption('monster', 'Монстр')
                .addOption('trap', 'Ловушка')
                .setValue(this.type)
                .onChange(value => {
                    this.type = value as any;
                }));

        // HP
        new Setting(contentEl)
            .setName('Текущие HP')
            .setDesc('Текущие очки здоровья')
            .addText(text => text
                .setPlaceholder('30')
                .setValue(this.hp.toString())
                .onChange(value => {
                    this.hp = Number(value) || 0;
                    this.maxHp = Math.max(this.maxHp, this.hp);
                }));

        // Max HP
        new Setting(contentEl)
            .setName('Максимальные HP')
            .setDesc('Максимальные очки здоровья')
            .addText(text => text
                .setPlaceholder('30')
                .setValue(this.maxHp.toString())
                .onChange(value => {
                    this.maxHp = Number(value) || 0;
                    this.hp = Math.min(this.hp, this.maxHp);
                }));

        // AC
        new Setting(contentEl)
            .setName('Класс брони (AC)')
            .setDesc('Класс брони')
            .addText(text => text
                .setPlaceholder('13')
                .setValue(this.ac.toString())
                .onChange(value => {
                    this.ac = Number(value) || 10;
                }));

        // Кнопки
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Добавить')
                .setCta()
                .onClick(() => {
                    if (!this.name.trim()) {
                        new Notice('Пожалуйста, введите имя участника');
                        return;
                    }

                    const participantData: Omit<Participant, 'id'> = {
                        name: this.name,
                        type: this.type,
                        hp: this.hp,
                        maxHp: this.maxHp,
                        ac: this.ac
                    };

                    this.parentModal.addParticipant(participantData);
                    this.close();
                }))
            .addButton(btn => btn
                .setButtonText('Отмена')
                .onClick(() => {
                    this.close();
                }));
    }
}