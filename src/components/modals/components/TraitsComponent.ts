import { Setting, Notice } from "obsidian";
import { CreatureTrait } from "src/models/Bestiary";
import { i18n } from "src/services/LocalizationService";

export class TraitsComponent {
  private traits: CreatureTrait[] = [];
  private newTraitName: string = "";
  private newTraitDesc: string = "";
  private usesSpells: boolean = false;
  private traitNameInput: HTMLInputElement | null = null;

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("TRAITS.TITLE"),
      cls: "section-title",
    });

    this.renderAddTraitForm(section);
    this.renderTraitsList(section);
  }

  private renderAddTraitForm(container: HTMLElement) {
    const addTraitContainer = container.createDiv({
      cls: "add-trait-container",
    });

    const nameSetting = new Setting(addTraitContainer)
      .setName(i18n.t("TRAITS.TRAIT_NAME"))
      .setDesc(i18n.t("TRAITS.TRAIT_NAME_DESC"))
      .addText((text) => {
        text
          .setPlaceholder(i18n.t("TRAITS.TRAIT_NAME_PLACEHOLDER"))
          .onChange((value) => (this.newTraitName = value));
        this.traitNameInput = text.inputEl;
      });

    new Setting(addTraitContainer)
      .setName(i18n.t("TRAITS.TRAIT_DESC"))
      .setDesc(i18n.t("TRAITS.TRAIT_DESC_DESC"))
      .addTextArea((text) => {
        text
          .setPlaceholder(i18n.t("TRAITS.TRAIT_DESC_PLACEHOLDER"))
          .onChange((value) => (this.newTraitDesc = value));
        text.inputEl.addClass("trait-desc-textarea");
        text.inputEl.addClass("wide-textarea");
      });

    new Setting(addTraitContainer)
      .setName(i18n.t("TRAITS.USES_SPELLS"))
      .setDesc(i18n.t("TRAITS.USES_SPELLS_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.usesSpells)
          .onChange((value) => this.onUsesSpellsChange(value)),
      );

    new Setting(addTraitContainer).addButton((btn) =>
      btn
        .setButtonText(i18n.t("TRAITS.ADD_TRAIT"))
        .setCta()
        .onClick(() => {
          if (!this.newTraitName.trim()) {
            new Notice(i18n.t("TRAITS.VALIDATION"));
            return;
          }

          if (this.traits.length >= 10) {
            new Notice(i18n.t("TRAITS.MAX_REACHED"));
            return;
          }

          const newTrait: CreatureTrait = {
            name: this.newTraitName,
            desc: this.newTraitDesc,
          };

          this.traits.push(newTrait);
          this.newTraitName = "";
          this.newTraitDesc = "";
          this.usesSpells = false;

          if (this.traitNameInput) {
            this.traitNameInput.value = "";
            this.traitNameInput.readOnly = false;
            this.traitNameInput.placeholder = i18n.t("TRAITS.TRAIT_NAME_PLACEHOLDER");
          }

          const descInput = addTraitContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (descInput) descInput.value = "";

          const toggleInput = addTraitContainer.querySelector(
            'input[type="checkbox"]',
          ) as HTMLInputElement;
          if (toggleInput) toggleInput.checked = false;

          this.updateTraitsList(container);
          new Notice(i18n.t("TRAITS.SUCCESS", { name: newTrait.name }));
        }),
    );
  }

  private onUsesSpellsChange(value: boolean) {
    this.usesSpells = value;

    if (this.traitNameInput) {
      if (value) {
        const spellTraitName = i18n.t("TRAITS.SPELLS_TRAIT_NAME");
        this.traitNameInput.value = spellTraitName;
        this.newTraitName = spellTraitName;
        this.traitNameInput.readOnly = true;
      } else {
        this.traitNameInput.value = "";
        this.newTraitName = "";
        this.traitNameInput.readOnly = false;
        this.traitNameInput.placeholder = i18n.t("TRAITS.TRAIT_NAME_PLACEHOLDER");
      }
    }
  }

  private renderTraitsList(container: HTMLElement) {
    const traitsListContainer = container.createDiv({
      cls: "traits-list-container",
    });
    traitsListContainer.createEl("div", {
      text: i18n.t("TRAITS.ADDED_TRAITS"),
      cls: "traits-list-title",
    });

    const traitsListEl = traitsListContainer.createDiv({
      cls: "traits-list",
      attr: { id: "traits-list" },
    });

    this.updateTraitsList(container);
  }

  private updateTraitsList(container: HTMLElement) {
    const traitsListEl = container.querySelector("#traits-list");
    if (!traitsListEl) return;

    traitsListEl.empty();

    if (this.traits.length === 0) {
      traitsListEl.createEl("div", {
        text: i18n.t("TRAITS.NO_TRAITS"),
        cls: "traits-empty",
      });
      return;
    }

    this.traits.forEach((trait, index) => {
      const traitItem = traitsListEl.createDiv({ cls: "trait-item" });

      const traitHeader = traitItem.createDiv({ cls: "trait-header" });
      traitHeader.createEl("strong", { text: trait.name });

      const traitDesc = traitItem.createDiv({ cls: "trait-desc" });
      traitDesc.setText(trait.desc);

      const removeBtn = traitItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "trait-remove mod-warning",
      });

      removeBtn.addEventListener("click", () => {
        this.traits.splice(index, 1);
        this.updateTraitsList(container);
        new Notice(i18n.t("TRAITS.DELETE_SUCCESS", { name: trait.name }));
      });
    });
  }

  getTraits(): CreatureTrait[] {
    return this.traits;
  }

  getUsesSpells(): boolean {
    return this.usesSpells;
  }
}