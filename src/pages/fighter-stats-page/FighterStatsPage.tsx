import './FighterStatsPage.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import MainNavbar from '../../components/main-navbar/MainNavbar'
import { Fighter, Fight, CFTEvent, CFTEventSnapshotEntry } from '../../utils/types'
import { serverAPI } from '../../utils/server'

import { getActivityStreakDisplay, getAverageFighterFightTime, getAverageFighterPosition, getFighterActivityStreak, getFighterDebut, getFighterLastActiveEvent, getFighterPositionDisplay, getFighterWinRate, getFighterWLStreak, 
    getFighterWLStreakDisplay, getFoughtFighters, getHighestRankedDefeated, getMaxFighterFightTime, getMaxFighterLossStreak, 
    getMaxFighterPosition, 
    getMaxFighterWinStreak, getMinFighterFightTime, getMinFighterPosition, getTotalFighterFights, getTotalFighterFightTime } from '../../stats/fighters'

import { formatPercent, formatSecondsToMinSec } from '../../utils/format'
import StatsListCard from '../../components/stats-list-card/StatsListCard'
import { useStompClient } from '../../hooks/hooks'
import FighterImageDisplay from '../../components/fighter-image-display/FighterImageDisplay'
import FighterPositionGraphCard from '../../components/fighter-position-graph-card/FighterPositionGraphCard'

function FighterStatsPage() {
    const { fighterID } = useParams()

    const [fighter, setFighter] = useState<Fighter>()
    const [fights, setFights] = useState<Fight[]>([])
    const [events, setEvents] = useState<CFTEvent[]>([])
    const [snapshotEntries, setSnapshotEntries] = useState<CFTEventSnapshotEntry[]>([])

    const [allFighters, setAllFighters] = useState<Fighter[]>([])

    const getFighter = async () => {
        try {
            const res = await serverAPI.get(`/fighters/${fighterID}`)
            const resData = res.data as Fighter

            setFighter(resData)

            const fightsRes = await serverAPI.get(`/fighters/${fighterID}/fights`)
            const fightsResData = fightsRes.data as Fight[]

            setFights(fightsResData)

            const snapshotEntriesRes = await serverAPI.get(`/fighters/${fighterID}/snapshots`)
            const snapshotEntriesResData = snapshotEntriesRes.data as CFTEventSnapshotEntry[]

            setSnapshotEntries(snapshotEntriesResData)
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

    const getAllFighters = async() => {
        try {
            const res = await serverAPI.get('/fighters')
            const resData = res.data as Fighter[]

            setAllFighters(resData)
        }
        catch(err) {
            console.error(err)
        }
    }

    const getFighterDetails = (): Record<string, any> => {
        if(!fighter)
            return {}

        return {
            'Location of Origin': fighter.location ?? 'None',
            'Height': fighter.heightInBlocks ? `${fighter.heightInBlocks} blocks` : 'Not Set',
            'Length/Width': fighter.lengthInBlocks ? `${fighter.lengthInBlocks} blocks` : 'Not Set',
            'Team': fighter.team ?? 'None'
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
            'Average Fight Duration': formatSecondsToMinSec(getAverageFighterFightTime(fights)),
            'Highest Position': getFighterPositionDisplay(getMinFighterPosition(snapshotEntries)),
            'Lowest Position': getFighterPositionDisplay(getMaxFighterPosition(snapshotEntries)),
            'Average Position': getFighterPositionDisplay(getAverageFighterPosition(snapshotEntries))
        }
    }

    const getFoughtFighterList = (): Record<string, any> => {
        if(!fighter)
            return {}

        const fighters = getFoughtFighters(fighter, fights)
        const fighterList: Record<string, any> = {}
        
        fighters.forEach((fighter, ind) => fighterList[`Fighter ${ind + 1}`] = fighter.name)

        return fighterList
    }

    const getNotFoughtFighterList = (): Record<string, any> => {
        if(!fighter)
            return {}

        const fighterIds = new Set(getFoughtFighters(fighter, fights).map(fighter => fighter.id))

        const fighterList: Record<string, any> = {}
        let fighterNum = 1

        for(const otherFighter of allFighters) {
            if(otherFighter.id === fighter.id || fighterIds.has(otherFighter.id)) {
                continue
            }

            fighterList[`Fighter ${fighterNum++}`] = otherFighter.name
        }

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
        getAllFighters()
    }, [])

    useStompClient({
        '/api/ws/fighters': () => {
            getFighter()
            getAllFighters()
        },
        '/api/ws/fights': () => {
            getFighter()
            getAllFighters()
        },
        '/api/ws/events': () => {
            getEvents()
            getAllFighters()
        }
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
                            <div className='fighter-stats-image-container'>
                                <FighterImageDisplay className='fighter-stats-image' fighter={fighter} rounded fluid />
                            </div>
                            <FighterPositionGraphCard fighter={fighter} />
                            <StatsListCard listName='Fighter Details' statsList={getFighterDetails()} />
                            <StatsListCard listName='Fight Performance Stats' statsList={getFightPerformanceStats()} />
                            <StatsListCard listName='Event Stats' statsList={getEventStats()} />
                            <StatsListCard listName='Fighters Fought' statsList={getFoughtFighterList()} />
                            <StatsListCard listName='Fighters Not Fought' statsList={getNotFoughtFighterList()} />
                        </>
                }
            </div>
        </div>
    )
}

export default FighterStatsPage
