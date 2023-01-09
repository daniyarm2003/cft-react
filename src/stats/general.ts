import { Fight, Fighter } from '../utils/types'
import * as FighterStats from './fighters'

const getCompareFuncMax = <T>(arr: T[], numFunc: (elem: T) => number, compareFunc: (first: number, second: number) => boolean) => {
    if(!arr.length)
        return

    let maxElem = arr[0]
    let maxCount = numFunc(maxElem)

    arr.slice(1).forEach(elem => {
        let curCount = numFunc(elem)

        if(compareFunc(curCount, maxCount)) {
            maxElem = elem
            maxCount = curCount
        }
    })

    return maxElem
}

const getMax = <T>(arr: T[], numFunc: (elem: T) => number) => getCompareFuncMax(arr, numFunc, (first, second) => first > second)
const getMin = <T>(arr: T[], numFunc: (elem: T) => number) => getCompareFuncMax(arr, numFunc, (first, second) => first < second)

export const getMostWinFighter = (fighters: Fighter[]) => getMax(fighters, fighter => fighter.stats.wins)
export const getMostLossFighter = (fighters: Fighter[]) => getMax(fighters, fighter => fighter.stats.losses)

export const getMostActiveFighter = (fighters: Fighter[]) => getMax(fighters, FighterStats.getTotalFighterFights)
export const getLeastActiveFighter = (fighters: Fighter[]) => getMin(fighters, FighterStats.getTotalFighterFights)

const getMaxFighterFight = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[], numFunc: (fighter: Fighter, fights: Fight[]) => number) => 
    getMax(fighters, fighter => numFunc(fighter, fightFunc(fighter)))

const getMinFighterFight = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[], numFunc: (fighter: Fighter, fights: Fight[]) => number) => 
    getMin(fighters, fighter => numFunc(fighter, fightFunc(fighter)))

export const getHighestWinStreakFighter = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[]) => 
    getMaxFighterFight(fighters, fightFunc, FighterStats.getFighterWLStreak)

export const getLowestWinStreakFighter = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[]) => 
    getMinFighterFight(fighters, fightFunc, FighterStats.getFighterWLStreak)

export const getHighestTotalWinStreakFighter = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[]) =>
    getMaxFighterFight(fighters, fightFunc, FighterStats.getMaxFighterWinStreak)

export const getHighestTotalLossStreakFighter = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[]) =>
    getMinFighterFight(fighters, fightFunc, FighterStats.getMaxFighterLossStreak)

export const getLongestTimeFighter = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[]) =>
    getMax(fighters, fighter => FighterStats.getTotalFighterFightTime(fightFunc(fighter)))

export const getShortestTimeFighter = (fighters: Fighter[], fightFunc: (fighter: Fighter) => Fight[]) =>
    getMin(fighters, fighter => FighterStats.getTotalFighterFightTime(fightFunc(fighter)))