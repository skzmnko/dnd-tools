import { Setting, Notice } from "obsidian";
import {
  DAMAGE_TYPES,
  CONDITIONS,
  DamageTypeKey,
  ConditionKey,
} from "src/constants/Constants";
import { i18n } from "src/services/LocalizationService";

export class ImmunitiesComponent {
  private damage_resistances: DamageTypeKey[] = [];
  private damage_vulnerabilities: DamageTypeKey[] = [];
  private damage_immunities: DamageTypeKey[] = [];
  private condition_immunities: ConditionKey[] = [];

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("IMMUNITIES.TITLE"),
      cls: "section-title",
    });

    this.renderDamageResistances(section);
    this.renderDamageVulnerabilities(section);
    this.renderDamageImmunities(section);
    this.renderConditionImmunities(section);
  }

  private renderDamageResistances(container: HTMLElement) {
    new Setting(container)
      .setName(i18n.t("IMMUNITIES.DAMAGE_RESISTANCES"))
      .setDesc(i18n.t("IMMUNITIES.DAMAGE_RESISTANCES_DESC"))
      .addDropdown((dropdown) => {
        dropdown.setDisabled(false);
        dropdown.addOption("", i18n.t("IMMUNITIES.SELECT_DAMAGE"));

        const damageTypes = i18n.getGameDataCategory("DAMAGE_TYPES");
        DAMAGE_TYPES.forEach((damageType: DamageTypeKey) => {
          dropdown.addOption(damageType, damageTypes[damageType] || damageType);
        });

        dropdown.onChange((value: string) => {
          if (
            value &&
            !this.damage_resistances.includes(value as DamageTypeKey)
          ) {
            this.damage_resistances.push(value as DamageTypeKey);
            this.updateSelectedValues(
              container,
              "damage-resistances-list",
              this.damage_resistances,
              "damage",
            );
          }
          dropdown.setValue("");
        });
      });

    this.renderSelectedValuesList(
      container,
      "damage-resistances-list",
      i18n.t("IMMUNITIES.SELECTED_RESISTANCES"),
      this.damage_resistances,
      "damage",
    );
  }

  private renderDamageVulnerabilities(container: HTMLElement) {
    new Setting(container)
      .setName(i18n.t("IMMUNITIES.DAMAGE_VULNERABILITIES"))
      .setDesc(i18n.t("IMMUNITIES.DAMAGE_VULNERABILITIES_DESC"))
      .addDropdown((dropdown) => {
        dropdown.setDisabled(false);
        dropdown.addOption("", i18n.t("IMMUNITIES.SELECT_DAMAGE"));

        const damageTypes = i18n.getGameDataCategory("DAMAGE_TYPES");
        DAMAGE_TYPES.forEach((damageType: DamageTypeKey) => {
          dropdown.addOption(damageType, damageTypes[damageType] || damageType);
        });

        dropdown.onChange((value: string) => {
          if (
            value &&
            !this.damage_vulnerabilities.includes(value as DamageTypeKey)
          ) {
            this.damage_vulnerabilities.push(value as DamageTypeKey);
            this.updateSelectedValues(
              container,
              "damage-vulnerabilities-list",
              this.damage_vulnerabilities,
              "damage",
            );
          }
          dropdown.setValue("");
        });
      });

    this.renderSelectedValuesList(
      container,
      "damage-vulnerabilities-list",
      i18n.t("IMMUNITIES.SELECTED_VULNERABILITIES"),
      this.damage_vulnerabilities,
      "damage",
    );
  }

  private renderDamageImmunities(container: HTMLElement) {
    new Setting(container)
      .setName(i18n.t("IMMUNITIES.DAMAGE_IMMUNITIES"))
      .setDesc(i18n.t("IMMUNITIES.DAMAGE_IMMUNITIES_DESC"))
      .addDropdown((dropdown) => {
        dropdown.setDisabled(false);
        dropdown.addOption("", i18n.t("IMMUNITIES.SELECT_DAMAGE"));

        const damageTypes = i18n.getGameDataCategory("DAMAGE_TYPES");
        DAMAGE_TYPES.forEach((damageType: DamageTypeKey) => {
          dropdown.addOption(damageType, damageTypes[damageType] || damageType);
        });

        dropdown.onChange((value: string) => {
          if (
            value &&
            !this.damage_immunities.includes(value as DamageTypeKey)
          ) {
            this.damage_immunities.push(value as DamageTypeKey);
            this.updateSelectedValues(
              container,
              "damage-immunities-list",
              this.damage_immunities,
              "damage",
            );
          }
          dropdown.setValue("");
        });
      });

    this.renderSelectedValuesList(
      container,
      "damage-immunities-list",
      i18n.t("IMMUNITIES.SELECTED_DAMAGE_IMMUNITIES"),
      this.damage_immunities,
      "damage",
    );
  }

  private renderConditionImmunities(container: HTMLElement) {
    new Setting(container)
      .setName(i18n.t("IMMUNITIES.CONDITION_IMMUNITIES"))
      .setDesc(i18n.t("IMMUNITIES.CONDITION_IMMUNITIES_DESC"))
      .addDropdown((dropdown) => {
        dropdown.setDisabled(false);
        dropdown.addOption("", i18n.t("IMMUNITIES.SELECT_CONDITION"));

        const conditions = i18n.getGameDataCategory("CONDITIONS");
        CONDITIONS.forEach((condition: ConditionKey) => {
          dropdown.addOption(condition, conditions[condition] || condition);
        });

        dropdown.onChange((value: string) => {
          if (
            value &&
            !this.condition_immunities.includes(value as ConditionKey)
          ) {
            this.condition_immunities.push(value as ConditionKey);
            this.updateSelectedValues(
              container,
              "condition-immunities-list",
              this.condition_immunities,
              "condition",
            );
          }
          dropdown.setValue("");
        });
      });

    this.renderSelectedValuesList(
      container,
      "condition-immunities-list",
      i18n.t("IMMUNITIES.SELECTED_CONDITION_IMMUNITIES"),
      this.condition_immunities,
      "condition",
    );
  }

  private renderSelectedValuesList(
    container: HTMLElement,
    listId: string,
    title: string,
    values: (DamageTypeKey | ConditionKey)[],
    type: "damage" | "condition",
  ) {
    const listContainer = container.createDiv({
      cls: "selected-values-container",
    });
    listContainer.createEl("div", {
      text: title,
      cls: "selected-values-title",
    });

    const listEl = listContainer.createDiv({
      cls: "selected-values-list",
      attr: { id: listId },
    });

    this.updateSelectedValues(container, listId, values, type);
  }

  private updateSelectedValues(
    container: HTMLElement,
    listId: string,
    values: (DamageTypeKey | ConditionKey)[],
    type: "damage" | "condition",
  ) {
    const listEl = container.querySelector(`#${listId}`);
    if (!listEl) return;

    listEl.empty();

    if (values.length === 0) {
      listEl.createEl("div", {
        text: i18n.t("IMMUNITIES.NOT_SELECTED"),
        cls: "selected-values-empty",
      });
      return;
    }

    values.forEach((value, index) => {
      const valueItem = listEl.createDiv({ cls: "selected-value-item" });

      const displayName =
        type === "damage"
          ? i18n.getDamageType(value as DamageTypeKey)
          : i18n.getCondition(value as ConditionKey);

      valueItem.createEl("span", { text: displayName });

      const removeBtn = valueItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "selected-value-remove",
      });

      removeBtn.addEventListener("click", () => {
        values.splice(index, 1);
        this.updateSelectedValues(container, listId, values, type);
      });
    });
  }

  getDamageResistances(): DamageTypeKey[] {
    return this.damage_resistances;
  }
  getDamageVulnerabilities(): DamageTypeKey[] {
    return this.damage_vulnerabilities;
  }
  getDamageImmunities(): DamageTypeKey[] {
    return this.damage_immunities;
  }
  getConditionImmunities(): ConditionKey[] {
    return this.condition_immunities;
  }
}
