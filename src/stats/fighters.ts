import { Fighter, Fight, CFTEvent, CFTEventSnapshotEntry } from '../utils/types'

export const getFighterWLStreak = (fighter: Fighter, fights: Fight[]) => {
    const finishedFights = fights.filter(fight => fight.status !== 'not_started').reverse()

    if(!finishedFights.length)
        return 0
    
    const lastFight = finishedFights[0]

    if(lastFight.status !== 'has_winner' || !lastFight.winner)
        return 0

    const lastFightWon = lastFight.winner.id === fighter.id
    let count = 0

    for(const fight of finishedFights) {
        if(fight.status !== 'has_winner')
            break
        
        const isWin = fight.winner?.id === fighter.id

        if(isWin !== lastFightWon)
            break

        count += isWin ? 1 : -1
    }

    return count
}

export const getTotalFighterFights = (fighter: Fighter) => Object.values(fighter.stats).reduce((prev, next) => prev + next, 0) as number

export const getFighterWinRate = (fighter: Fighter) => getTotalFighterFights(fighter) !== 0 ? fighter.stats.wins / getTotalFighterFights(fighter) : 0

const getMaxFighterWLStreaks = (fighter: Fighter, fights: Fight[]): [number, number] => {
    const finishedFights = fights.filter(fight => fight.status !== 'not_started')

    if(!finishedFights.length)
        return [0, 0]

    let maxWins = 0, maxLosses = 0, wins = 0, losses = 0

    finishedFights.forEach(fight => {
        if(fight.status !== 'has_winner') {
            wins = 0
            losses = 0

            return
        }

        const isWin = fight.winner?.id === fighter.id

        wins = isWin ? wins + 1 : 0
        losses = !isWin ? losses + 1 : 0

        maxWins = Math.max(maxWins, wins)
        maxLosses = Math.max(maxLosses, losses)
    })

    return [maxWins, -maxLosses]
}

const getMaxFighterWLStreak = (fighter: Fighter, fights: Fight[], streakType: 'win' | 'loss') => getMaxFighterWLStreaks(fighter, fights)[streakType === 'win' ? 0 : 1]

export const getMaxFighterWinStreak = (fighter: Fighter, fights: Fight[]) => getMaxFighterWLStreak(fighter, fights, 'win')
export const getMaxFighterLossStreak = (fighter: Fighter, fights: Fight[]) => getMaxFighterWLStreak(fighter, fights, 'loss')

export const getFighterWLStreakDisplay = (wlStreak: number) => {
    if(!wlStreak)
        return 'None'

    return `${Math.abs(wlStreak)} ${wlStreak > 0 ? 'W' : 'L'}`
}

export const getTotalFighterFightTime = (fights: Fight[]) => fights.filter(fight => fight.status !== 'not_started').reduce((prev, next) => prev + next.durationInSeconds, 0)

export const getMaxFighterFightTime = (fights: Fight[]) => 
    fights.filter(fight => fight.status !== 'not_started').length ? Math.max(...fights.filter(fight => fight.status !== 'not_started').map(fight => fight.durationInSeconds)) : 0

export const getMinFighterFightTime = (fights: Fight[]) => 
    fights.filter(fight => fight.status !== 'not_started').length ? Math.min(...fights.filter(fight => fight.status !== 'not_started').map(fight => fight.durationInSeconds)) : 0

export const getAverageFighterFightTime = (fights: Fight[]) => 
    fights.filter(fight => fight.status !== 'not_started').length ? Math.floor(getTotalFighterFightTime(fights) / fights.filter(fight => fight.status !== 'not_started').length) : 0

export const getHighestRankedDefeated = (fighter: Fighter, fights: Fight[]): Fighter | undefined => {
    const defeated = fights.filter(fight => fight.status === 'has_winner' && fight.winner?.id === fighter.id && fight.fighters.length === 2)
        .map(fight => fight.fighters[0].id === fighter.id ? fight.fighters[1] : fight.fighters[0])

    let highestRanked: Fighter | undefined = undefined
    let highestRank = Infinity

    defeated.forEach(defFighter => {
        if(defFighter.position < highestRank) {
            highestRank = defFighter.position
            highestRanked = defFighter
        }
    })

    return highestRanked
}

const eventContainsFighter = (cftEvent: CFTEvent, fighter: Fighter, fightFilter?: (fight: Fight) => boolean) => 
    cftEvent.fights.filter(fight => fight.fighters.map(fighter => fighter.id).includes(fighter.id) && (fightFilter ? fightFilter(fight) : true)).length !== 0

export const getFighterDebut = (fighter: Fighter, events: CFTEvent[]) => 
    events.filter(cftEvent => eventContainsFighter(cftEvent, fighter))[0]

export const getFighterLastActiveEvent = (fighter: Fighter, events: CFTEvent[]) => 
    events.filter(cftEvent => eventContainsFighter(cftEvent, fighter, fight => fight.status !== 'not_started')).reverse()[0]

export const getFighterActivityStreak = (fighter: Fighter, events: CFTEvent[]) => {
    if(!events.length || !getTotalFighterFights(fighter))
        return 0

    const inLastEvent = eventContainsFighter(events[events.length - 1], fighter)
    let streak = 1
    
    for(let i = events.length - 2; i > -1; i--) {
        if(eventContainsFighter(events[i], fighter) === inLastEvent)
            streak++

        else
            break
    }

    return streak * (inLastEvent ? 1 : -1)
}

export const getActivityStreakDisplay = (streak: number) => {
    if(!streak)
        return 'N/A'

    return `${streak > 0 ? 'Active' : 'Inactive'} for ${Math.abs(streak)} Events`
}

export const getFoughtFighters = (fighter: Fighter, fights: Fight[]) => {
    const otherFighterList = fights.filter(fight => fight.fighters.length === 2)
        .map(fight => fight.fighters[0].id === fighter.id ? fight.fighters[1] : fight.fighters[0])

    const idSet = new Set<string>()
    const foughtFighters: Fighter[] = []

    for(const otherFighter of otherFighterList) {
        if(idSet.has(otherFighter.id)) {
            continue;
        }

        foughtFighters.push(otherFighter)
        idSet.add(otherFighter.id)
    }

    return foughtFighters
}

export const getMinFighterPosition = (snapshotEntries: CFTEventSnapshotEntry[]) => {
    if(snapshotEntries.length === 0) {
        return null
    }

    return Math.min(...snapshotEntries.map(entry => entry.position))
}

export const getMaxFighterPosition = (snapshotEntries: CFTEventSnapshotEntry[]) => {
    if(snapshotEntries.length === 0) {
        return null
    }

    return Math.max(...snapshotEntries.map(entry => entry.position))
}

export const getAverageFighterPosition = (snapshotEntries: CFTEventSnapshotEntry[]) => {
    if(snapshotEntries.length === 0) {
        return null
    }

    const positionSum = snapshotEntries.reduce((prev, next) => prev + next.position, 0)
    return positionSum / snapshotEntries.length
}

export const getFighterPositionDisplay = (position: number | null) => {
    if(position === null) {
        return 'N/A'
    }

    else if(position === 0) {
        return 'C'
    }

    return Math.round(position)
}