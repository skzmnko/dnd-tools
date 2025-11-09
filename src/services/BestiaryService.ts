import { Creature, BestiaryData } from 'src/models/Bestiary';
import { StorageService } from 'src/services/StorageService';

export class BestiaryService {
    private storage: StorageService;
    private creatures: Creature[] = [];

    constructor(plugin: any) {
        this.storage = new StorageService(plugin);
    }

    async initialize(): Promise<void> {
        await this.loadCreatures();
    }

    async createCreature(creatureData: Omit<Creature, 'id' | 'created' | 'updated'>): Promise<Creature> {
        const creature: Creature = {
            ...creatureData,
            id: this.generateId(),
            created: Date.now(),
            updated: Date.now()
        };

        this.creatures.push(creature);
        await this.saveCreatures();
        
        return creature;
    }

    async getCreature(id: string): Promise<Creature | undefined> {
        return this.creatures.find(creature => creature.id === id);
    }

    async updateCreature(id: string, updates: Partial<Creature>): Promise<Creature | null> {
        const index = this.creatures.findIndex(creature => creature.id === id);
        if (index === -1) return null;

        this.creatures[index] = {
            ...this.creatures[index],
            ...updates,
            updated: Date.now()
        };

        await this.saveCreatures();
        return this.creatures[index];
    }

    async deleteCreature(id: string): Promise<boolean> {
        const index = this.creatures.findIndex(creature => creature.id === id);
        if (index === -1) return false;

        this.creatures.splice(index, 1);
        await this.saveCreatures();
        return true;
    }

    getAllCreatures(): Creature[] {
        return [...this.creatures];
    }

    getCreaturesByType(type: string): Creature[] {
        return this.creatures.filter(creature => creature.type === type);
    }

    private async loadCreatures(): Promise<void> {
        try {
            const data = await this.storage.loadBestiaryData();
            this.creatures = data?.creatures || [];
            console.log('Creatures loaded:', this.creatures.length);
        } catch (error) {
            console.error('Error loading creatures:', error);
            this.creatures = [];
        }
    }

    private async saveCreatures(): Promise<void> {
        try {
            const data: BestiaryData = {
                creatures: this.creatures,
                lastUpdated: Date.now()
            };
            await this.storage.saveBestiaryData(data);
            console.log('Creatures saved successfully');
        } catch (error) {
            console.error('Error saving creatures:', error);
        }
    }

    generateId(): string {
        return 'creature_' + Math.random().toString(36).substr(2, 9);
    }
}