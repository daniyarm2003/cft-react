import './GeneralStatsPage.css'

import { useState, useEffect } from 'react'

import MainNavbar from '../../components/main-navbar/MainNavbar'
import StatsListCard from '../../components/stats-list-card/StatsListCard'
import { Fight, Fighter } from '../../utils/types'
import { serverAPI } from '../../utils/server'

import { getHighestTotalWinStreakFighter, getHighestWinStreakFighter, getHighestTotalLossStreakFighter, getLowestWinStreakFighter, 
    getMostActiveFighter, getMostLossFighter, getMostWinFighter, getLongestTimeFighter, getShortestTimeFighter, getLeastActiveFighter } from '../../stats/general'
import { useStompClient } from '../../hooks/hooks'

function GeneralStatsPage() {
    const [fighters, setFighters] = useState<Fighter[]>([])
    const [fights, setFights] = useState<Fight[]>([])

    const getData = async () => {
        try {
            const fighterRes = await serverAPI.get('/fighters')
            setFighters(fighterRes.data as Fighter[])

            const fightRes = await serverAPI.get('/fights')
            setFights(fightRes.data as Fight[])
        }
        catch(err) {
            console.error(err)
        }
    }

    useStompClient({
        '/api/ws/fighters': () => getData(),
        '/api/ws/fights': () => getData(),
        '/api/ws/events': () => getData()
    })

    const getFighterFights = (fighter: Fighter) =>
        fights.filter(fight => fight.fighters.map(fighter => fighter.id).includes(fighter.id))

    const fighterStats: Record<string, any> = {
        'Fighter with Most Wins': getMostWinFighter(fighters)?.name ?? 'N/A',
        'Fighter with Most Losses': getMostLossFighter(fighters)?.name ?? 'N/A',
        'Most Active Fighter': getMostActiveFighter(fighters)?.name ?? 'N/A',
        'Least Active Fighter': getLeastActiveFighter(fighters)?.name ?? 'N/A',
        'Highest Current Win Streak/Lowest Current Loss Streak': getHighestWinStreakFighter(fighters, getFighterFights)?.name ?? 'N/A',
        'Highest Current Loss Streak/Lowest Current Win Streak': getLowestWinStreakFighter(fighters, getFighterFights)?.name ?? 'N/A',
        'Highest Ever Win Streak': getHighestTotalWinStreakFighter(fighters, getFighterFights)?.name ?? 'N/A',
        'Highest Ever Loss Streak': getHighestTotalLossStreakFighter(fighters, getFighterFights)?.name ?? 'N/A',
        'Longest Total Time Fighting': getLongestTimeFighter(fighters, getFighterFights)?.name ?? 'N/A',
        'Shortest Total Time Fighting': getShortestTimeFighter(fighters, getFighterFights)?.name ?? 'N/A'
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className='general-stats-page-container'>
            <MainNavbar />
            <div className='general-stats-page-content'>
                <h1>CFT Statistics</h1>
                <StatsListCard listName='Fighter Stats' statsList={fighterStats} />
            </div>
        </div>
    )
}

export default GeneralStatsPage