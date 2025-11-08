export interface Participant {
  id: string;
  name: string;
  type: 'pc' | 'npc' | 'monster' | 'trap';
  hp: number;
  maxHp: number;
  ac: number;
  initiative?: number;
  notes?: string;
}

export interface Encounter {
  id: string;
  name: string;
  description: string;
  type: 'combat' | 'hazard' | 'chase' | 'random';
  participants: Participant[];
  created: number;
  updated: number;
}

export interface CombatEncounter extends Encounter {
  type: 'combat';
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  environment: string;
}

export interface HazardEncounter extends Encounter {
  type: 'hazard';
  dangerLevel: string;
}

export interface ChaseEncounter extends Encounter {
  type: 'chase';
  complexity: string;
}

export interface RandomEncounter extends Encounter {
  type: 'random';
  eventType: string;
}

export type AnyEncounter = CombatEncounter | HazardEncounter | ChaseEncounter | RandomEncounter;