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
    newFighter: boolean
}

export interface Fight {
    id: string,
    status: 'has_winner' | 'draw' | 'no_contest' | 'not_started',
    date: string,
    durationInSeconds: number,
    fighters: Fighter[],
    winner?: Fighter | null
}

export interface CFTEvent {
    id: string,
    name: string,
    date: string,
    fights: Fight[]
}

export interface DeletedFighter {
    id: string,
    fighterName: string,
    debutEvent: CFTEvent,
    finalEvent: CFTEvent
}

export type WSUpdateType = 'POST' | 'PUT' | 'PUT_INDIRECT' | 'DELETE'

export interface WSUpdate<T> {
    type: WSUpdateType,
    data: T
}