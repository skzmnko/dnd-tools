import { TFile, normalizePath } from 'obsidian';

export class StorageService {
    private plugin: any;

    constructor(plugin: any) {
        this.plugin = plugin;
    }

    async loadEncountersByDate(date: Date): Promise<any> {
        try {
            const fileName = this.getDateFileName(date);
            const filePath = this.getEncountersFilePath(fileName);
            
            // Проверяем существует ли файл
            const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                const content = await this.plugin.app.vault.read(file);
                return JSON.parse(content);
            }
            
            return { encounters: [], lastUpdated: Date.now() };
        } catch (error) {
            console.error('Error loading encounters by date:', error);
            return { encounters: [], lastUpdated: Date.now() };
        }
    }

    async saveEncountersByDate(date: Date, data: any): Promise<void> {
        try {
            const fileName = this.getDateFileName(date);
            const folderPath = this.getEncountersFolderPath();
            const filePath = this.getEncountersFilePath(fileName);
            
            // Создаем папку если не существует
            await this.ensureEncountersFolder();
            
            // Проверяем существует ли файл
            let file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                // Обновляем существующий файл
                await this.plugin.app.vault.modify(file, JSON.stringify(data, null, 2));
            } else {
                // Создаем новый файл
                file = await this.plugin.app.vault.create(filePath, JSON.stringify(data, null, 2));
            }
            
        } catch (error) {
            console.error('Error saving encounters by date:', error);
            throw error;
        }
    }

    private getDateFileName(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `encounters_${day}.${month}.${year}.json`;
    }

    private getEncountersFolderPath(): string {
        return normalizePath(`${this.plugin.manifest.dir}/encounters`);
    }

    private getEncountersFilePath(fileName: string): string {
        return normalizePath(`${this.getEncountersFolderPath()}/${fileName}`);
    }

    private async ensureEncountersFolder(): Promise<void> {
        const folderPath = this.getEncountersFolderPath();
        const folder = this.plugin.app.vault.getAbstractFileByPath(folderPath);
        
        if (!folder) {
            await this.plugin.app.vault.createFolder(folderPath);
        }
    }

    // Старые методы для обратной совместимости (можно удалить позже)
    async loadData(): Promise<any> {
        return await this.loadEncountersByDate(new Date());
    }

    async saveData(data: any): Promise<void> {
        await this.saveEncountersByDate(new Date(), data);
    }
}