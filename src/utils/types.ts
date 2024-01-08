export interface FighterStats {
    wins: number,
    losses: number,
    draws: number,
    noContests: number
}

export interface Fighter {
    id: string,
    name: string,
    position: number,
    positionChange: number,
    positionChangeText: string,
    stats: FighterStats,
    newFighter: boolean,
    location?: string,
    heightInBlocks?: number,
    lengthInBlocks?: number,
    team?: string,
    imageFileName?: string
}

export interface Fight {
    id: string,
    status: 'has_winner' | 'draw' | 'no_contest' | 'not_started',
    date: string,
    durationInSeconds: number,
    fighters: Fighter[],
    winner?: Fighter | null,
    fightNum?: number
}

export interface CFTEventSnapshotEntry {
    id: string,
    fighter?: Fighter,
    fighterName: string,
    position: number,
    wins: number,
    losses: number,
    draws: number,
    noContests: number,
    positionChange: number,
    newFighter: boolean
}

export interface CFTEventSnapshot {
    id: string,
    googleSheetURL?: string,
    snapshotEntries: CFTEventSnapshotEntry[],
    snapshotDate: string
}

export interface CFTEvent {
    id: string,
    name: string,
    date: string,
    fights: Fight[],
    nextFightNum?: number,
    snapshot?: CFTEventSnapshot
}

export interface DeletedFighter {
    id: string,
    fighterName: string,
    debutEvent: CFTEvent,
    finalEvent: CFTEvent
}

export type WSUpdateType = 'POST' | 'PUT' | 'DELETE'
export type WSUpdateOrigin = 'FIGHTERS' | 'FIGHTS' | 'EVENTS'

export interface WSUpdate<T> {
    origin: WSUpdateOrigin,
    type: WSUpdateType,
    data: T
}