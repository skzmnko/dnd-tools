import { Setting } from "obsidian";
import { i18n } from "src/services/LocalizationService";

export class CoreParametersComponent {
  private ac: number = 13;
  private hit_dice: string = "8d8+24";
  private speed: string = "30 ft.";
  private proficiency_bonus: number = 2;
  private initiativeInput: HTMLInputElement | null = null;
  private onProficiencyBonusChangeCallback: ((bonus: number) => void) | null =
    null;
  private onInitiativeUpdateCallback: ((initiative: number) => void) | null =
    null;

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("CORE_PARAMETERS.TITLE"),
      cls: "section-title",
    });

    new Setting(section)
      .setName(i18n.t("CORE_PARAMETERS.AC"))
      .setDesc(i18n.t("CORE_PARAMETERS.AC_DESC"))
      .addText((text) =>
        text
          .setPlaceholder("13")
          .setValue(this.ac.toString())
          .onChange((value) => (this.ac = Number(value) || 13)),
      );

    new Setting(section)
      .setName(i18n.t("CORE_PARAMETERS.HP"))
      .setDesc(i18n.t("CORE_PARAMETERS.HP_DESC"))
      .addText((text) =>
        text
          .setPlaceholder("CORE_PARAMETERS.HP_PLACEHOLDER")
          .setValue(this.hit_dice)
          .onChange((value) => (this.hit_dice = value)),
      );

    new Setting(section)
      .setName(i18n.t("CORE_PARAMETERS.SPEED"))
      .setDesc(i18n.t("CORE_PARAMETERS.SPEED_DESC"))
      .addText((text) =>
        text
          .setPlaceholder("CORE_PARAMETERS.SPEED_PLACEHOLDER")
          .setValue(this.speed)
          .onChange((value) => (this.speed = value)),
      );

    new Setting(section)
      .setName(i18n.t("CORE_PARAMETERS.INITIATIVE"))
      .setDesc(i18n.t("CORE_PARAMETERS.INITIATIVE_DESC"))
      .addText((text) => {
        this.initiativeInput = text.inputEl;
        text.setPlaceholder("+0").setValue("+0").setDisabled(true);
      });

    new Setting(section)
      .setName(i18n.t("CORE_PARAMETERS.PROFICIENCY_BONUS"))
      .setDesc(i18n.t("CORE_PARAMETERS.PROFICIENCY_BONUS_DESC"))
      .addText((text) =>
        text
          .setPlaceholder("2")
          .setValue(this.proficiency_bonus.toString())
          .onChange((value) => {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0) {
              this.proficiency_bonus = numValue;
              if (this.onProficiencyBonusChangeCallback) {
                this.onProficiencyBonusChangeCallback(numValue);
              }
            }
          }),
      );
  }

  updateInitiative(initiative: number): void {
    if (this.initiativeInput) {
      this.initiativeInput.value =
        initiative >= 0 ? `+${initiative}` : `${initiative}`;
    }
  }

  onProficiencyBonusChange(callback: (bonus: number) => void) {
    this.onProficiencyBonusChangeCallback = callback;
  }

  getAC(): number {
    return this.ac;
  }
  getHitDice(): string {
    return this.hit_dice;
  }
  getSpeed(): string {
    return this.speed;
  }
  getProficiencyBonus(): number {
    return this.proficiency_bonus;
  }
}
