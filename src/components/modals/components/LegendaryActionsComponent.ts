import { Setting, Notice } from "obsidian";
import { CreatureAction } from "src/models/Bestiary";
import { i18n } from "src/services/LocalizationService";

export class LegendaryActionsComponent {
  private legendary_actions: CreatureAction[] = [];
  private newLegendaryActionName: string = "";
  private newLegendaryActionDesc: string = "";

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("ACTIONS.LEGENDARY_ACTIONS"),
      cls: "section-title",
    });

    this.renderAddLegendaryActionForm(section);
    this.renderLegendaryActionsList(section);
  }

  private renderAddLegendaryActionForm(container: HTMLElement) {
    const addLegendaryActionContainer = container.createDiv({
      cls: "add-action-container",
    });

    new Setting(addLegendaryActionContainer)
      .setName(i18n.t("ACTIONS.LEGENDARY_ACTION_NAME"))
      .setDesc(i18n.t("ACTIONS.LEGENDARY_ACTION_NAME_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("ACTIONS.LEGENDARY_ACTION_NAME_PLACEHOLDER"))
          .onChange((value) => (this.newLegendaryActionName = value)),
      );

    new Setting(addLegendaryActionContainer)
      .setName(i18n.t("ACTIONS.LEGENDARY_ACTION_DESC"))
      .setDesc(i18n.t("ACTIONS.LEGENDARY_ACTION_DESC_DESC"))
      .addTextArea((text) => {
        text
          .setPlaceholder(i18n.t("ACTIONS.LEGENDARY_ACTION_DESC_PLACEHOLDER"))
          .onChange((value) => (this.newLegendaryActionDesc = value));
        text.inputEl.addClass("legendary-action-desc-textarea");
        text.inputEl.addClass("wide-textarea");
      });

    new Setting(addLegendaryActionContainer).addButton((btn) =>
      btn
        .setButtonText(i18n.t("ACTIONS.ADD_LEGENDARY_ACTION"))
        .setCta()
        .onClick(() => {
          if (!this.newLegendaryActionName.trim()) {
            new Notice(i18n.t("ACTIONS.LEGENDARY_VALIDATION"));
            return;
          }

          if (this.legendary_actions.length >= 10) {
            new Notice(i18n.t("ACTIONS.LEGENDARY_MAX_REACHED"));
            return;
          }

          const newLegendaryAction: CreatureAction = {
            name: this.newLegendaryActionName,
            desc: this.newLegendaryActionDesc,
          };

          this.legendary_actions.push(newLegendaryAction);

          this.newLegendaryActionName = "";
          this.newLegendaryActionDesc = "";

          const nameInput = addLegendaryActionContainer.querySelector(
            `input[placeholder="${i18n.t("ACTIONS.LEGENDARY_ACTION_NAME_PLACEHOLDER")}"]`,
          ) as HTMLInputElement;
          const descInput = addLegendaryActionContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (nameInput) nameInput.value = "";
          if (descInput) descInput.value = "";

          this.updateLegendaryActionsList(container);
          new Notice(
            i18n.t("ACTIONS.LEGENDARY_SUCCESS", {
              name: newLegendaryAction.name,
            }),
          );
        }),
    );
  }

  private renderLegendaryActionsList(container: HTMLElement) {
    const legendaryActionsListContainer = container.createDiv({
      cls: "actions-list-container",
    });
    legendaryActionsListContainer.createEl("div", {
      text: i18n.t("ACTIONS.ADDED_LEGENDARY_ACTIONS"),
      cls: "actions-list-title",
    });

    const legendaryActionsListEl = legendaryActionsListContainer.createDiv({
      cls: "actions-list",
      attr: { id: "legendary-actions-list" },
    });

    this.updateLegendaryActionsList(container);
  }

  private updateLegendaryActionsList(container: HTMLElement) {
    const legendaryActionsListEl = container.querySelector(
      "#legendary-actions-list",
    );
    if (!legendaryActionsListEl) return;

    legendaryActionsListEl.empty();

    if (this.legendary_actions.length === 0) {
      legendaryActionsListEl.createEl("div", {
        text: i18n.t("ACTIONS.NO_LEGENDARY_ACTIONS"),
        cls: "actions-empty",
      });
      return;
    }

    this.legendary_actions.forEach((legendaryAction, index) => {
      const legendaryActionItem = legendaryActionsListEl.createDiv({
        cls: "action-item",
      });

      const legendaryActionHeader = legendaryActionItem.createDiv({
        cls: "action-header",
      });
      legendaryActionHeader.createEl("strong", { text: legendaryAction.name });

      const legendaryActionDesc = legendaryActionItem.createDiv({
        cls: "action-desc",
      });
      legendaryActionDesc.setText(legendaryAction.desc);

      const removeBtn = legendaryActionItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "action-remove mod-warning",
      });

      removeBtn.addEventListener("click", () => {
        this.legendary_actions.splice(index, 1);
        this.updateLegendaryActionsList(container);
        new Notice(
          i18n.t("ACTIONS.LEGENDARY_DELETE_SUCCESS", {
            name: legendaryAction.name,
          }),
        );
      });
    });
  }

  getLegendaryActions(): CreatureAction[] {
    return this.legendary_actions;
  }
}
