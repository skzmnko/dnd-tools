import { Setting, TextAreaComponent } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";

export class SpellDescriptionComponent {
  private spellData: Partial<Spell>;
  private bestiaryService: any;
  private creatures: any[] = [];
  private selectedCreaturesContainer: HTMLElement | null = null;

  constructor(spellData: Partial<Spell>, bestiaryService?: any) {
    this.spellData = spellData;
    this.bestiaryService = bestiaryService;

    if (!this.spellData.summonedCreatures) {
      this.spellData.summonedCreatures = [];
    }
    if (this.spellData.summonCreature === undefined) {
      this.spellData.summonCreature = false;
    }
  }

  async render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });

    section.createEl("h3", {
      text: i18n.t("SPELL_FIELDS.DESCRIPTION"),
      cls: "section-title",
    });

    const descriptionContainer = section.createDiv("description-section");

    new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.MANA_COST"))
      .setDesc(i18n.t("SPELL_FIELDS.MANA_COST_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.manaCost || false)
          .onChange((value) => (this.spellData.manaCost = value)),
      );

    const descSetting = new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.DESCRIPTION"))
      .setDesc(i18n.t("SPELL_FIELDS.DESCRIPTION_DESC"));

    const textArea = new TextAreaComponent(descSetting.controlEl);
    textArea
      .setPlaceholder(i18n.t("SPELL_FIELDS.DESCRIPTION_PLACEHOLDER"))
      .setValue(this.spellData.description || "")
      .onChange((value) => (this.spellData.description = value));
    textArea.inputEl.style.width = "100%";
    textArea.inputEl.rows = 6;
    textArea.inputEl.addClass("spell-description-textarea");
    textArea.inputEl.addClass("fixed-textarea");

    const upgradeSetting = new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.SPELL_UPGRADE"))
      .setDesc(i18n.t("SPELL_FIELDS.SPELL_UPGRADE_DESC"));

    const upgradeTextArea = new TextAreaComponent(upgradeSetting.controlEl);
    upgradeTextArea
      .setPlaceholder(i18n.t("SPELL_FIELDS.SPELL_UPGRADE_PLACEHOLDER"))
      .setValue(this.spellData.spellUpgrade || "")
      .onChange((value) => (this.spellData.spellUpgrade = value));
    upgradeTextArea.inputEl.style.width = "100%";
    upgradeTextArea.inputEl.rows = 3;
    upgradeTextArea.inputEl.addClass("cantrip-upgrade-textarea");
    upgradeTextArea.inputEl.addClass("fixed-textarea");

    const summonSetting = new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.SUMMON_CREATURE"))
      .setDesc(i18n.t("SPELL_FIELDS.SUMMON_CREATURE_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.summonCreature || false)
          .onChange((value) => {
            this.spellData.summonCreature = value;
            this.updateSummonCreatureVisibility();
          }),
      );

    const summonContainer = descriptionContainer.createDiv(
      "summon-creature-container",
    );
    summonContainer.style.display = this.spellData.summonCreature
      ? "block"
      : "none";

    await this.loadCreatures();

    new Setting(summonContainer)
      .setName(i18n.t("SPELL_FIELDS.SELECT_SUMMON_CREATURE"))
      .setDesc("")
      .addDropdown((dropdown) => {
        dropdown.addOption("", i18n.t("SPELL_FIELDS.SELECT_SUMMON_CREATURE"));

        this.creatures.forEach((creature) => {
          dropdown.addOption(creature.id, creature.name);
        });

        dropdown.onChange((value: string) => {
          if (value && !this.spellData.summonedCreatures?.includes(value)) {
            this.spellData.summonedCreatures = [
              ...(this.spellData.summonedCreatures || []),
              value,
            ];
            this.updateSelectedCreaturesDisplay();
          }
          dropdown.setValue("");
        });
      });

    this.selectedCreaturesContainer = summonContainer.createDiv(
      "selected-creatures-container",
    );
    this.updateSelectedCreaturesDisplay();
  }

  private async loadCreatures() {
    try {
      if (this.bestiaryService) {
        await this.bestiaryService.initialize();
        this.creatures = this.bestiaryService.getAllCreatures();
        console.log("Loaded creatures for summoning:", this.creatures.length);
      }
    } catch (error) {
      console.error("Error loading creatures for summoning:", error);
      this.creatures = [];
    }
  }

  private updateSummonCreatureVisibility() {
    const summonContainer = this.selectedCreaturesContainer?.parentElement;
    if (summonContainer) {
      summonContainer.style.display = this.spellData.summonCreature
        ? "block"
        : "none";

      if (!this.spellData.summonCreature) {
        this.spellData.summonedCreatures = [];
        this.updateSelectedCreaturesDisplay();
      }
    }
  }

  private updateSelectedCreaturesDisplay() {
    if (!this.selectedCreaturesContainer) return;

    this.selectedCreaturesContainer.empty();

    if (
      !this.spellData.summonedCreatures ||
      this.spellData.summonedCreatures.length === 0
    ) {
      const emptyText = this.selectedCreaturesContainer.createDiv(
        "selected-values-empty",
      );
      emptyText.setText(i18n.t("SPELL_FIELDS.NO_CREATURE_SELECTED"));
      return;
    }

    this.selectedCreaturesContainer.createEl("div", {
      text: i18n.t("SPELL_FIELDS.SELECTED_SUMMON_CREATURE") + ":",
      cls: "selected-values-title",
    });

    const creaturesList = this.selectedCreaturesContainer.createDiv(
      "selected-values-list",
    );

    this.spellData.summonedCreatures.forEach((creatureId, index) => {
      const creature = this.creatures.find((c) => c.id === creatureId);
      if (creature) {
        const creatureItem = creaturesList.createDiv("selected-value-item");
        creatureItem.setText(creature.name);

        const removeBtn = creatureItem.createEl("button", {
          text: "×",
          cls: "selected-value-remove",
        });
        removeBtn.addEventListener("click", () => {
          this.spellData.summonedCreatures =
            this.spellData.summonedCreatures?.filter((id) => id !== creatureId);
          this.updateSelectedCreaturesDisplay();
        });
      }
    });
  }
}
