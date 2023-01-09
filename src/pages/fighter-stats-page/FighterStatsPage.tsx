import './FighterStatsPage.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import MainNavbar from '../../components/main-navbar/MainNavbar'
import { Fighter, Fight, CFTEvent } from '../../utils/types'
import { serverAPI } from '../../utils/server'

import { getActivityStreakDisplay, getAverageFighterFightTime, getFighterActivityStreak, getFighterDebut, getFighterLastActiveEvent, getFighterWinRate, getFighterWLStreak, 
    getFighterWLStreakDisplay, getFoughtFighters, getHighestRankedDefeated, getMaxFighterFightTime, getMaxFighterLossStreak, 
    getMaxFighterWinStreak, getMinFighterFightTime, getTotalFighterFights, getTotalFighterFightTime } from '../../stats/fighters'

import { formatPercent, formatSecondsToMinSec } from '../../utils/format'
import StatsListCard from '../../components/stats-list-card/StatsListCard'
import { useStompClient } from '../../hooks/hooks'

function FighterStatsPage() {
    const { fighterID } = useParams()

    const [fighter, setFighter] = useState<Fighter>()
    const [fights, setFights] = useState<Fight[]>([])
    const [events, setEvents] = useState<CFTEvent[]>([])

    const getFighter = async () => {
        try {
            const res = await serverAPI.get(`/fighters/${fighterID}`)
            const resData = res.data as Fighter

            setFighter(resData)

            const fightsRes = await serverAPI.get(`/fighters/${fighterID}/fights`)
            const fightsResData = fightsRes.data as Fight[]

            setFights(fightsResData)
        }
        catch(err) {
            console.error(err)
        }
    }

    const getEvents = async () => {
        try {
            const res = await serverAPI.get('/events')
            const resData = res.data as CFTEvent[]

            setEvents(resData)
        }
        catch(err) {
            console.error(err)
        }
    }

    const getFightPerformanceStats = (): Record<string, any> => {
        if(!fighter)
            return {}

        return {
            'Position': fighter.position || 'C',
            'Wins': fighter.stats.wins + ' W',
            'Losses': fighter.stats.losses + ' L',
            'Draws': fighter.stats.draws + ' D',
            'No Contests': fighter.stats.noContests + ' NC',
            'Total Completed Fights': getTotalFighterFights(fighter),
            'Wins - Losses': fighter.stats.wins - fighter.stats.losses,
            'Win Rate': formatPercent(getFighterWinRate(fighter)),
            'Current Win/Loss Streak': getFighterWLStreakDisplay(getFighterWLStreak(fighter, fights)),
            'Longest Win Streak': getFighterWLStreakDisplay(getMaxFighterWinStreak(fighter, fights)),
            'Longest Loss Streak': getFighterWLStreakDisplay(getMaxFighterLossStreak(fighter, fights)),
            'Highest Position Fighter Defeated': getHighestRankedDefeated(fighter, fights)?.name ?? 'N/A',
            'Total Fight Duration': formatSecondsToMinSec(getTotalFighterFightTime(fights)),
            'Longest Fight Duration': formatSecondsToMinSec(getMaxFighterFightTime(fights)),
            'Shortest Fight Duration': formatSecondsToMinSec(getMinFighterFightTime(fights)),
            'Average Fight Duration': formatSecondsToMinSec(getAverageFighterFightTime(fights))
        }
    }

    const getFoughtFighterList = (): Record<string, any> => {
        if(!fighter)
            return {}

        const fighters = getFoughtFighters(fighter, fights)
        const fighterList: Record<string, any> = {}
        
        fighters.forEach((fighter, ind) => fighterList[`Fighter ${ind + 1}`] = fighter)

        return fighterList
    }

    const getEventStats = (): Record<string, any> => {
        if(!fighter)
            return {}

        return {
            'Debut': getFighterDebut(fighter, events)?.name ?? 'N/A',
            'Last Event Active': getFighterLastActiveEvent(fighter, events)?.name ?? 'N/A',
            'Latest Activity Streak': getActivityStreakDisplay(getFighterActivityStreak(fighter, events))
        }
    }

    useEffect(() => {
        getFighter()
        getEvents()
    }, [])

    useStompClient({
        '/api/ws/fighters': () => getFighter(),
        '/api/ws/fights': () => getFighter(),
        '/api/ws/events': () => getEvents()
    })

    return (
        <div className='fighter-stats-page-container'>
            <MainNavbar />
            <div className='fighter-stats-page-content'>
                {
                    !fighter ?
                        <h1>Loading</h1>
                    :
                        <>
                            <h1>Statistics of {fighter.name}</h1>

                            <StatsListCard listName='Fight Performance Stats' statsList={getFightPerformanceStats()} />
                            <StatsListCard listName='Event Stats' statsList={getEventStats()} />
                            <StatsListCard listName='Fighters Fought' statsList={getFoughtFighterList()} />
                        </>
                }
            </div>
        </div>
    )
}

export default FighterStatsPage
