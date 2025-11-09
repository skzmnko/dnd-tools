import { Encounter, Participant } from 'src/models/Encounter';
import { StorageService } from 'src/services/StorageService';

export class EncounterService {
    private storage: StorageService;
    private encounters: Encounter[] = [];

    constructor(plugin: any) {
        this.storage = new StorageService(plugin);
    }

    async initialize(): Promise<void> {
        await this.loadEncounters();
    }

    async createEncounter(encounterData: Omit<Encounter, 'id' | 'created' | 'updated'>): Promise<Encounter> {
        const encounter: Encounter = {
            ...encounterData,
            id: this.generateId(),
            created: Date.now(),
            updated: Date.now()
        };

        this.encounters.push(encounter);
        await this.saveEncounters();
        
        return encounter;
    }

    async getEncounter(id: string): Promise<Encounter | undefined> {
        return this.encounters.find(enc => enc.id === id);
    }

    async updateEncounter(id: string, updates: Partial<Encounter>): Promise<Encounter | null> {
        const index = this.encounters.findIndex(enc => enc.id === id);
        if (index === -1) return null;

        this.encounters[index] = {
            ...this.encounters[index],
            ...updates,
            updated: Date.now()
        };

        await this.saveEncounters();
        return this.encounters[index];
    }

    async deleteEncounter(id: string): Promise<boolean> {
        const index = this.encounters.findIndex(enc => enc.id === id);
        if (index === -1) return false;

        this.encounters.splice(index, 1);
        await this.saveEncounters();
        return true;
    }

    getAllEncounters(): Encounter[] {
        return [...this.encounters];
    }

    getEncountersByType(type: Encounter['type']): Encounter[] {
        return this.encounters.filter(enc => enc.type === type);
    }

    private async loadEncounters(): Promise<void> {
        try {
            const today = new Date();
            console.log('Loading encounters for date:', today);
            const data = await this.storage.loadEncountersByDate(today);
            console.log('Loaded encounters data:', data);
            this.encounters = data?.encounters || [];
            console.log('Encounters loaded:', this.encounters.length);
        } catch (error) {
            console.error('Error loading encounters:', error);
            this.encounters = [];
        }
    }

    private async saveEncounters(): Promise<void> {
        try {
            const today = new Date();
            console.log('Saving encounters for date:', today);
            const data = {
                encounters: this.encounters,
                lastUpdated: Date.now(),
                date: today.toISOString()
            };
            await this.storage.saveEncountersByDate(today, data);
            console.log('Encounters saved successfully');
        } catch (error) {
            console.error('Error saving encounters:', error);
        }
    }

    // Метод для загрузки энкаунтеров за определенную дату
    async loadEncountersForDate(date: Date): Promise<Encounter[]> {
        const data = await this.storage.loadEncountersByDate(date);
        return data?.encounters || [];
    }

    generateId(): string {
        return 'enc_' + Math.random().toString(36).substr(2, 9);
    }

    generateParticipantId(): string {
        return 'part_' + Math.random().toString(36).substr(2, 9);
    }

    getEncounterTypeLabel(type: string): string {
        const typeLabels: { [key: string]: string } = {
            'combat': 'Сражение',
            'hazard': 'Опасная область',
            'chase': 'Погоня',
            'random': 'Случайные события'
        };
        return typeLabels[type] || type;
    }
}