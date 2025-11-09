import { App, MarkdownView, Editor } from 'obsidian';
import { Encounter } from 'src/models/Encounter';

export class UIService {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  insertEncounterToCurrentNote(encounter: Encounter): boolean {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView && activeView.editor) {
      const editor = activeView.editor;
      const encounterBlock = `\n\n\`\`\`encounter\n${JSON.stringify(encounter, null, 2)}\n\`\`\`\n\n`;
      editor.replaceSelection(encounterBlock);
      return true;
    }
    return false;
  }

  renderEncounterBlock(source: string, el: HTMLElement, getTypeLabel: (type: string) => string): void {
    try {
      const encounterData = JSON.parse(source);
      
      const container = el.createDiv({ cls: 'encounter-block' });
      const header = container.createDiv({ cls: 'encounter-header' });
      header.createEl('h3', { text: encounterData.name });
      
      const typeBadge = header.createSpan({ cls: 'encounter-type' });
      typeBadge.setText(getTypeLabel(encounterData.type));
      typeBadge.addClass(`encounter-type-${encounterData.type}`);
      
      const openBtn = header.createEl('button', { text: 'Открыть энкаунтер', cls: 'mod-cta' });
      openBtn.addEventListener('click', () => {
        // Здесь будет вызов модального окна просмотра
      });

      if (encounterData.description) {
        const description = container.createDiv({ cls: 'encounter-description' });
        description.setText(encounterData.description);
      }

      this.renderEncounterSpecificInfo(container, encounterData, getTypeLabel);

    } catch (error) {
      console.error('Error rendering encounter block:', error);
      el.setText('Error: Invalid encounter data');
    }
  }

  private renderEncounterSpecificInfo(container: HTMLElement, encounterData: any, getTypeLabel: (type: string) => string): void {
    const infoSection = container.createDiv({ cls: 'encounter-info' });
    
    switch (encounterData.type) {
      case 'combat':
        if (encounterData.difficulty) {
          infoSection.createEl('p', { text: `Сложность: ${encounterData.difficulty}` });
        }
        if (encounterData.environment) {
          infoSection.createEl('p', { text: `Локация: ${encounterData.environment}` });
        }
        if (encounterData.participants && encounterData.participants.length > 0) {
          const participantsSection = container.createDiv({ cls: 'encounter-participants' });
          participantsSection.createEl('h4', { text: 'Участники' });
          
          const participantList = participantsSection.createDiv({ cls: 'participant-list' });
          encounterData.participants.forEach((participant: any) => {
            const participantEl = participantList.createDiv({ cls: 'participant-item' });
            participantEl.setText(`${participant.name} (${participant.type}) - HP: ${participant.hp}/${participant.maxHp}`);
          });
        }
        break;
      // ... другие типы
    }
  }
}