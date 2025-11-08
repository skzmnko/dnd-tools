import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface EncounterManagerSettings {
  defaultHP: number;
  autoSave: boolean;
  roundTimer: number;
}

const DEFAULT_SETTINGS: EncounterManagerSettings = {
  defaultHP: 100,
  autoSave: true,
  roundTimer: 60
}

export default class EncounterManagerPlugin extends Plugin {
  settings!: EncounterManagerSettings;

  async onload() {
    await this.loadSettings();

    // Добавляем команду для создания нового энкаунтера
    this.addCommand({
      id: 'create-encounter',
      name: 'Create new encounter',
      callback: () => {
        new EncounterCreationModal(this.app, this).open();
      }
    });

    // Добавляем иконку в боковую панель
    this.addRibbonIcon('swords', 'Encounter Manager', () => {
      new EncounterManagerModal(this.app, this).open();
    });

    // Добавляем вкладку настроек
    this.addSettingTab(new EncounterManagerSettingTab(this.app, this));

    // Регистрируем код блок для отображения энкаунтеров
    this.registerMarkdownCodeBlockProcessor('encounter', (source, el, ctx) => {
      this.renderEncounterBlock(source, el, ctx);
    });

    console.log('Encounter Manager plugin loaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  renderEncounterBlock(source: string, el: HTMLElement, ctx: any) {
    const encounterData = JSON.parse(source);
    
    const container = el.createDiv({ cls: 'encounter-block' });
    const header = container.createDiv({ cls: 'encounter-header' });
    header.createEl('h3', { text: encounterData.name });
    
    const openBtn = header.createEl('button', { text: 'Open Encounter' });
    openBtn.addEventListener('click', () => {
      new EncounterViewModal(this.app, this, encounterData).open();
    });
  }
}

class EncounterCreationModal extends Modal {
  plugin: EncounterManagerPlugin;

  constructor(app: App, plugin: EncounterManagerPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Create New Encounter' });

    new Setting(contentEl)
      .setName('Encounter name')
      .setDesc('Name of the encounter')
      .addText(text => text
        .setPlaceholder('Goblin Ambush')
        .onChange(value => {
          // Сохраняем значение
        }));

    new Setting(contentEl)
      .setName('Description')
      .setDesc('Encounter description')
      .addTextArea(text => text
        .setPlaceholder('A group of goblins ambushes the party...')
        .onChange(value => {
          // Сохраняем значение
        }));

    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText('Create')
        .setCta()
        .onClick(() => {
          this.close();
          new Notice('Encounter created!');
        }));
  }
}

class EncounterManagerModal extends Modal {
  plugin: EncounterManagerPlugin;

  constructor(app: App, plugin: EncounterManagerPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Encounter Manager' });
    
    // Здесь будет логика отображения списка энкаунтеров
    contentEl.createEl('p', { text: 'Your encounter management interface will appear here.' });
  }
}

class EncounterViewModal extends Modal {
  plugin: EncounterManagerPlugin;
  encounterData: any;

  constructor(app: App, plugin: EncounterManagerPlugin, encounterData: any) {
    super(app);
    this.plugin = plugin;
    this.encounterData = encounterData;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: this.encounterData.name });
    
    // Здесь будет интерфейс управления боем
    this.renderCombatTracker(contentEl);
  }

  renderCombatTracker(container: HTMLElement) {
    const tracker = container.createDiv({ cls: 'combat-tracker' });
    
    // Пример отображения участников боя
    const participants = tracker.createDiv({ cls: 'participants' });
    participants.createEl('h3', { text: 'Combatants' });
    
    // Здесь будет логика отображения персонажей и монстров
  }
}

class EncounterManagerSettingTab extends PluginSettingTab {
  plugin: EncounterManagerPlugin;

  constructor(app: App, plugin: EncounterManagerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Encounter Manager Settings' });

    new Setting(containerEl)
      .setName('Default HP')
      .setDesc('Default hit points for new creatures')
      .addText(text => text
        .setPlaceholder('100')
        .setValue(this.plugin.settings.defaultHP.toString())
        .onChange(async (value) => {
          this.plugin.settings.defaultHP = Number(value);
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Auto-save encounters')
      .setDesc('Automatically save encounter state')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoSave)
        .onChange(async (value) => {
          this.plugin.settings.autoSave = value;
          await this.plugin.saveSettings();
        }));
  }
}