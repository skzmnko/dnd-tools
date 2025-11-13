import { Setting } from 'obsidian';

export class CoreParametersComponent {
    private ac: number = 13;
    private hit_dice: string = '8d8+24';
    private speed: string = '30 футов';
    private proficiency_bonus: number = 2;
    private initiativeInput: HTMLInputElement | null = null;
    private onProficiencyBonusChangeCallback: ((bonus: number) => void) | null = null;
    private onInitiativeUpdateCallback: ((initiative: number) => void) | null = null;

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Основные параметры' });

        new Setting(section)
            .setName('Класс брони (AC)')
            .setDesc('Класс брони')
            .addText(text => text
                .setPlaceholder('13')
                .setValue(this.ac.toString())
                .onChange(value => this.ac = Number(value) || 13));

        new Setting(section)
            .setName('Хиты (HP)')
            .setDesc('Хиты существа')
            .addText(text => text
                .setPlaceholder('8d8+24')
                .setValue(this.hit_dice)
                .onChange(value => this.hit_dice = value));

        new Setting(section)
            .setName('Скорость')
            .setDesc('Скорость перемещения')
            .addText(text => text
                .setPlaceholder('30 ft., fly 60 ft.')
                .setValue(this.speed)
                .onChange(value => this.speed = value));

        // Инициатива (только отображение)
        new Setting(section)
            .setName('Инициатива')
            .setDesc('Бонус инициативы (рассчитывается автоматически как модификатор ловкости)')
            .addText(text => {
                this.initiativeInput = text.inputEl;
                text.setPlaceholder('+0')
                    .setValue('+0')
                    .setDisabled(true);
            });

        new Setting(section)
            .setName('Бонус мастерства')
            .setDesc('Бонус мастерства существа')
            .addText(text => text
                .setPlaceholder('2')
                .setValue(this.proficiency_bonus.toString())
                .onChange(value => {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                        this.proficiency_bonus = numValue;
                        // Уведомляем об изменении бонуса мастерства
                        if (this.onProficiencyBonusChangeCallback) {
                            this.onProficiencyBonusChangeCallback(numValue);
                        }
                    }
                }));
    }

    // Метод для обновления инициативы
    updateInitiative(initiative: number): void {
        if (this.initiativeInput) {
            this.initiativeInput.value = initiative >= 0 ? `+${initiative}` : `${initiative}`;
        }
    }

    // Колбэк для изменения бонуса мастерства
    onProficiencyBonusChange(callback: (bonus: number) => void) {
        this.onProficiencyBonusChangeCallback = callback;
    }

    // Геттеры
    getAC(): number { return this.ac; }
    getHitDice(): string { return this.hit_dice; }
    getSpeed(): string { return this.speed; }
    getProficiencyBonus(): number { return this.proficiency_bonus; }
}