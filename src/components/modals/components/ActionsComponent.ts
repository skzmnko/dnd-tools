import { Setting, Notice } from "obsidian";
import { CreatureAction } from "src/models/Bestiary";
import { i18n } from "src/services/LocalizationService";

export class ActionsComponent {
  private actions: CreatureAction[] = [];
  private newActionName: string = "";
  private newActionDesc: string = "";

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("ACTIONS.TITLE"),
      cls: "section-title",
    });

    this.renderAddActionForm(section);
    this.renderActionsList(section);
  }

  private renderAddActionForm(container: HTMLElement) {
    const addActionContainer = container.createDiv({
      cls: "add-action-container",
    });

    new Setting(addActionContainer)
      .setName(i18n.t("ACTIONS.ACTION_NAME"))
      .setDesc(i18n.t("ACTIONS.ACTION_NAME_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("ACTIONS.ACTION_NAME_PLACEHOLDER"))
          .onChange((value) => (this.newActionName = value)),
      );

    new Setting(addActionContainer)
      .setName(i18n.t("ACTIONS.ACTION_DESC"))
      .setDesc(i18n.t("ACTIONS.ACTION_DESC_DESC"))
      .addTextArea((text) => {
        text
          .setPlaceholder(i18n.t("ACTIONS.ACTION_DESC_PLACEHOLDER"))
          .onChange((value) => (this.newActionDesc = value));
        text.inputEl.addClass("action-desc-textarea");
        text.inputEl.addClass("wide-textarea");
      });

    new Setting(addActionContainer).addButton((btn) =>
      btn
        .setButtonText(i18n.t("ACTIONS.ADD_ACTION"))
        .setCta()
        .onClick(() => {
          if (!this.newActionName.trim()) {
            new Notice(i18n.t("ACTIONS.VALIDATION"));
            return;
          }

          if (this.actions.length >= 10) {
            new Notice(i18n.t("ACTIONS.MAX_REACHED"));
            return;
          }

          const newAction: CreatureAction = {
            name: this.newActionName,
            desc: this.newActionDesc,
          };

          this.actions.push(newAction);

          this.newActionName = "";
          this.newActionDesc = "";

          const nameInput = addActionContainer.querySelector(
            `input[placeholder="${i18n.t("ACTIONS.ACTION_NAME_PLACEHOLDER")}"]`,
          ) as HTMLInputElement;
          const descInput = addActionContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (nameInput) nameInput.value = "";
          if (descInput) descInput.value = "";

          this.updateActionsList(container);
          new Notice(i18n.t("ACTIONS.SUCCESS", { name: newAction.name }));
        }),
    );
  }

  private renderActionsList(container: HTMLElement) {
    const actionsListContainer = container.createDiv({
      cls: "actions-list-container",
    });
    actionsListContainer.createEl("div", {
      text: i18n.t("ACTIONS.ADDED_ACTIONS"),
      cls: "actions-list-title",
    });

    const actionsListEl = actionsListContainer.createDiv({
      cls: "actions-list",
      attr: { id: "actions-list" },
    });

    this.updateActionsList(container);
  }

  private updateActionsList(container: HTMLElement) {
    const actionsListEl = container.querySelector("#actions-list");
    if (!actionsListEl) return;

    actionsListEl.empty();

    if (this.actions.length === 0) {
      actionsListEl.createEl("div", {
        text: i18n.t("ACTIONS.NO_ACTIONS"),
        cls: "actions-empty",
      });
      return;
    }

    this.actions.forEach((action, index) => {
      const actionItem = actionsListEl.createDiv({ cls: "action-item" });

      const actionHeader = actionItem.createDiv({ cls: "action-header" });
      actionHeader.createEl("strong", { text: action.name });

      const actionDesc = actionItem.createDiv({ cls: "action-desc" });
      actionDesc.setText(action.desc);

      const removeBtn = actionItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "action-remove mod-warning",
      });

      removeBtn.addEventListener("click", () => {
        this.actions.splice(index, 1);
        this.updateActionsList(container);
        new Notice(
          i18n
            .t("ACTIONS.SUCCESS", { name: action.name })
            .replace("added", "deleted"),
        );
      });
    });
  }

  getActions(): CreatureAction[] {
    return this.actions;
  }
}
