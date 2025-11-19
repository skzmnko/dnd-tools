import { Setting, Notice } from "obsidian";
import { CreatureAction } from "src/models/Bestiary";
import { i18n } from "src/services/LocalizationService";

export class ReactionsComponent {
  private reactions: CreatureAction[] = [];
  private newReactionName: string = "";
  private newReactionDesc: string = "";

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("ACTIONS.REACTIONS"),
      cls: "section-title",
    });

    this.renderAddReactionForm(section);
    this.renderReactionsList(section);
  }

  private renderAddReactionForm(container: HTMLElement) {
    const addReactionContainer = container.createDiv({
      cls: "add-action-container",
    });

    new Setting(addReactionContainer)
      .setName(i18n.t("ACTIONS.REACTION_NAME"))
      .setDesc(i18n.t("ACTIONS.REACTION_NAME_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("ACTIONS.REACTION_NAME_PLACEHOLDER"))
          .onChange((value) => (this.newReactionName = value)),
      );

    new Setting(addReactionContainer)
      .setName(i18n.t("ACTIONS.REACTION_DESC"))
      .setDesc(i18n.t("ACTIONS.REACTION_DESC_DESC"))
      .addTextArea((text) => {
        text
          .setPlaceholder(i18n.t("ACTIONS.REACTION_DESC_PLACEHOLDER"))
          .onChange((value) => (this.newReactionDesc = value));
        text.inputEl.addClass("reaction-desc-textarea");
        text.inputEl.addClass("wide-textarea");
      });

    new Setting(addReactionContainer).addButton((btn) =>
      btn
        .setButtonText(i18n.t("ACTIONS.ADD_REACTION"))
        .setCta()
        .onClick(() => {
          if (!this.newReactionName.trim()) {
            new Notice(i18n.t("ACTIONS.REACTION_VALIDATION"));
            return;
          }

          if (this.reactions.length >= 10) {
            new Notice(i18n.t("ACTIONS.REACTION_MAX_REACHED"));
            return;
          }

          const newReaction: CreatureAction = {
            name: this.newReactionName,
            desc: this.newReactionDesc,
          };

          this.reactions.push(newReaction);

          this.newReactionName = "";
          this.newReactionDesc = "";

          const nameInput = addReactionContainer.querySelector(
            `input[placeholder="${i18n.t("ACTIONS.REACTION_NAME_PLACEHOLDER")}"]`,
          ) as HTMLInputElement;
          const descInput = addReactionContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (nameInput) nameInput.value = "";
          if (descInput) descInput.value = "";

          this.updateReactionsList(container);
          new Notice(
            i18n.t("ACTIONS.REACTION_SUCCESS", { name: newReaction.name }),
          );
        }),
    );
  }

  private renderReactionsList(container: HTMLElement) {
    const reactionsListContainer = container.createDiv({
      cls: "actions-list-container",
    });
    reactionsListContainer.createEl("div", {
      text: i18n.t("ACTIONS.ADDED_REACTIONS"),
      cls: "actions-list-title",
    });

    const reactionsListEl = reactionsListContainer.createDiv({
      cls: "actions-list",
      attr: { id: "reactions-list" },
    });

    this.updateReactionsList(container);
  }

  private updateReactionsList(container: HTMLElement) {
    const reactionsListEl = container.querySelector("#reactions-list");
    if (!reactionsListEl) return;

    reactionsListEl.empty();

    if (this.reactions.length === 0) {
      reactionsListEl.createEl("div", {
        text: i18n.t("ACTIONS.NO_REACTIONS"),
        cls: "actions-empty",
      });
      return;
    }

    this.reactions.forEach((reaction, index) => {
      const reactionItem = reactionsListEl.createDiv({ cls: "action-item" });

      const reactionHeader = reactionItem.createDiv({ cls: "action-header" });
      reactionHeader.createEl("strong", { text: reaction.name });

      const reactionDesc = reactionItem.createDiv({ cls: "action-desc" });
      reactionDesc.setText(reaction.desc);

      const removeBtn = reactionItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "action-remove mod-warning",
      });

      removeBtn.addEventListener("click", () => {
        this.reactions.splice(index, 1);
        this.updateReactionsList(container);
        new Notice(
          i18n.t("ACTIONS.REACTION_DELETE_SUCCESS", { name: reaction.name }),
        );
      });
    });
  }

  getReactions(): CreatureAction[] {
    return this.reactions;
  }
}
