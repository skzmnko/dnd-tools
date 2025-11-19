import { Setting, Notice } from "obsidian";
import { CreatureAction } from "src/models/Bestiary";
import { i18n } from "src/services/LocalizationService";

export class BonusActionsComponent {
  private bonus_actions: CreatureAction[] = [];
  private newBonusActionName: string = "";
  private newBonusActionDesc: string = "";

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("ACTIONS.BONUS_ACTIONS"),
      cls: "section-title",
    });

    this.renderAddBonusActionForm(section);
    this.renderBonusActionsList(section);
  }

  private renderAddBonusActionForm(container: HTMLElement) {
    const addBonusActionContainer = container.createDiv({
      cls: "add-action-container",
    });

    new Setting(addBonusActionContainer)
      .setName(i18n.t("ACTIONS.BONUS_ACTION_NAME"))
      .setDesc(i18n.t("ACTIONS.BONUS_ACTION_NAME_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("ACTIONS.BONUS_ACTION_NAME_PLACEHOLDER"))
          .onChange((value) => (this.newBonusActionName = value)),
      );

    new Setting(addBonusActionContainer)
      .setName(i18n.t("ACTIONS.BONUS_ACTION_DESC"))
      .setDesc(i18n.t("ACTIONS.BONUS_ACTION_DESC_DESC"))
      .addTextArea((text) => {
        text
          .setPlaceholder(i18n.t("ACTIONS.BONUS_ACTION_DESC_PLACEHOLDER"))
          .onChange((value) => (this.newBonusActionDesc = value));
        text.inputEl.addClass("bonus-action-desc-textarea");
        text.inputEl.addClass("wide-textarea");
      });

    new Setting(addBonusActionContainer).addButton((btn) =>
      btn
        .setButtonText(i18n.t("ACTIONS.ADD_BONUS_ACTION"))
        .setCta()
        .onClick(() => {
          if (!this.newBonusActionName.trim()) {
            new Notice(i18n.t("ACTIONS.BONUS_VALIDATION"));
            return;
          }

          if (this.bonus_actions.length >= 10) {
            new Notice(i18n.t("ACTIONS.BONUS_MAX_REACHED"));
            return;
          }

          const newBonusAction: CreatureAction = {
            name: this.newBonusActionName,
            desc: this.newBonusActionDesc,
          };

          this.bonus_actions.push(newBonusAction);

          this.newBonusActionName = "";
          this.newBonusActionDesc = "";

          const nameInput = addBonusActionContainer.querySelector(
            "input",
          ) as HTMLInputElement;
          const descInput = addBonusActionContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (nameInput) nameInput.value = "";
          if (descInput) descInput.value = "";

          this.updateBonusActionsList(container);
          new Notice(
            i18n.t("ACTIONS.BONUS_SUCCESS", { name: newBonusAction.name }),
          );
        }),
    );
  }

  private renderBonusActionsList(container: HTMLElement) {
    const bonusActionsListContainer = container.createDiv({
      cls: "actions-list-container",
    });
    bonusActionsListContainer.createEl("div", {
      text: i18n.t("ACTIONS.ADDED_BONUS_ACTIONS"),
      cls: "actions-list-title",
    });

    const bonusActionsListEl = bonusActionsListContainer.createDiv({
      cls: "actions-list",
      attr: { id: "bonus-actions-list" },
    });

    this.updateBonusActionsList(container);
  }

  private updateBonusActionsList(container: HTMLElement) {
    const bonusActionsListEl = container.querySelector("#bonus-actions-list");
    if (!bonusActionsListEl) return;

    bonusActionsListEl.empty();

    if (this.bonus_actions.length === 0) {
      bonusActionsListEl.createEl("div", {
        text: i18n.t("ACTIONS.NO_BONUS_ACTIONS"),
        cls: "actions-empty",
      });
      return;
    }

    this.bonus_actions.forEach((bonusAction, index) => {
      const bonusActionItem = bonusActionsListEl.createDiv({
        cls: "action-item",
      });

      const bonusActionHeader = bonusActionItem.createDiv({
        cls: "action-header",
      });
      bonusActionHeader.createEl("strong", { text: bonusAction.name });

      const bonusActionDesc = bonusActionItem.createDiv({ cls: "action-desc" });
      bonusActionDesc.setText(bonusAction.desc);

      const removeBtn = bonusActionItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "action-remove mod-warning",
      });

      removeBtn.addEventListener("click", () => {
        this.bonus_actions.splice(index, 1);
        this.updateBonusActionsList(container);
        new Notice(
          i18n.t("ACTIONS.BONUS_DELETE_SUCCESS", { name: bonusAction.name }),
        );
      });
    });
  }

  getBonusActions(): CreatureAction[] {
    return this.bonus_actions;
  }
}
