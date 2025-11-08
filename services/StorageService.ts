export class StorageService {
    private plugin: any;

    constructor(plugin: any) {
        this.plugin = plugin;
    }

    async loadData(): Promise<any> {
        try {
            return await this.plugin.loadData();
        } catch (error) {
            console.error('Error loading data:', error);
            return {};
        }
    }

    async saveData(data: any): Promise<void> {
        try {
            await this.plugin.saveData(data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}