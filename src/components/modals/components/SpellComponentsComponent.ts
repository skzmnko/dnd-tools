import { Setting } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";

export class SpellComponentsComponent {
  private spellData: Partial<Spell>;
  private container: HTMLElement | null = null;
  private componentsContainer: HTMLElement | null = null;
  private verbalDescriptionContainer: HTMLElement | null = null;
  private materialDescriptionContainer: HTMLElement | null = null;

  constructor(spellData: Partial<Spell>) {
    this.spellData = spellData;
  }

  render(container: HTMLElement) {
    this.container = container;

    const section = container.createDiv({ cls: "creature-section" });

    section.createEl("h3", {
      text: i18n.t("SPELL_FIELDS.COMPONENTS"),
      cls: "section-title",
    });

    this.componentsContainer = section.createDiv("components-section");

    new Setting(this.componentsContainer)
      .setName(i18n.t("SPELL_FIELDS.VERBAL"))
      .setDesc(i18n.t("SPELL_FIELDS.VERBAL_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.components?.verbal || false)
          .onChange((value) => {
            if (!this.spellData.components)
              this.spellData.components = {
                verbal: false,
                somatic: false,
                material: false,
              };
            this.spellData.components.verbal = value;
            this.updateVerbalDescription();
          }),
      );

    this.verbalDescriptionContainer = this.componentsContainer.createDiv(
      "verbal-description-container",
    );
    this.updateVerbalDescription();

    new Setting(this.componentsContainer)
      .setName(i18n.t("SPELL_FIELDS.SOMATIC"))
      .setDesc(i18n.t("SPELL_FIELDS.SOMATIC_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.components?.somatic || false)
          .onChange((value) => {
            if (!this.spellData.components)
              this.spellData.components = {
                verbal: false,
                somatic: false,
                material: false,
              };
            this.spellData.components.somatic = value;
          }),
      );

    new Setting(this.componentsContainer)
      .setName(i18n.t("SPELL_FIELDS.MATERIAL"))
      .setDesc(i18n.t("SPELL_FIELDS.MATERIAL_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.components?.material || false)
          .onChange((value) => {
            if (!this.spellData.components)
              this.spellData.components = {
                verbal: false,
                somatic: false,
                material: false,
              };
            this.spellData.components.material = value;
            this.updateMaterialDescription();
          }),
      );

    this.materialDescriptionContainer = this.componentsContainer.createDiv(
      "material-description-container",
    );
    this.updateMaterialDescription();
  }

  private updateVerbalDescription() {
    if (!this.verbalDescriptionContainer) return;

    this.verbalDescriptionContainer.empty();

    if (this.spellData.components?.verbal) {
      this.verbalDescriptionContainer.style.display = "block";
      new Setting(this.verbalDescriptionContainer)
        .setName(i18n.t("SPELL_FIELDS.VERBAL_DESCRIPTION"))
        .setDesc(i18n.t("SPELL_FIELDS.VERBAL_DESCRIPTION_DESC"))
        .addTextArea((textarea) => {
          textarea
            .setPlaceholder(
              i18n.t("SPELL_FIELDS.VERBAL_DESCRIPTION_PLACEHOLDER"),
            )
            .setValue(this.spellData.components?.verbalDescription || "")
            .onChange((value) => {
              if (this.spellData.components) {
                this.spellData.components.verbalDescription = value;
              }
            });

          textarea.inputEl.rows = 3;
          textarea.inputEl.addClass("verbal-textarea");
          textarea.inputEl.addClass("fixed-textarea");
        });
    } else {
      this.verbalDescriptionContainer.style.display = "none";
    }
  }

  private updateMaterialDescription() {
    if (!this.materialDescriptionContainer) return;

    this.materialDescriptionContainer.empty();

    if (this.spellData.components?.material) {
      this.materialDescriptionContainer.style.display = "block";
      new Setting(this.materialDescriptionContainer)
        .setName(i18n.t("SPELL_FIELDS.MATERIAL_DESCRIPTION"))
        .setDesc(i18n.t("SPELL_FIELDS.MATERIAL_DESCRIPTION_DESC"))
        .addTextArea((textarea) => {
          textarea
            .setPlaceholder(
              i18n.t("SPELL_FIELDS.MATERIAL_DESCRIPTION_PLACEHOLDER"),
            )
            .setValue(this.spellData.components?.materialDescription || "")
            .onChange((value) => {
              if (this.spellData.components) {
                this.spellData.components.materialDescription = value;
              }
            });
          textarea.inputEl.rows = 3;
          textarea.inputEl.addClass("material-textarea");
          textarea.inputEl.addClass("fixed-textarea");
        });
    } else {
      this.materialDescriptionContainer.style.display = "none";
    }
  }
}
