import './FightHistoryPage.css'

import { useParams } from 'react-router-dom'
import MainNavbar from '../../components/main-navbar/MainNavbar'
import { Fight, Fighter } from '../../utils/types'

import { useState, useEffect } from 'react'
import { serverAPI } from '../../utils/server'
import FightCard from '../../components/fight-card/FightCard'
import { useStompClient } from '../../hooks/hooks'
import FighterImageDisplay from '../../components/fighter-image-display/FighterImageDisplay'

function FightHistoryPage() {
    const { fighterID } = useParams()

    const [fighter, setFighter] = useState<Fighter>()
    const [fights, setFights] = useState<Fight[]>([])

    const getFighter = async () => {
        try {
            const res = await serverAPI.get(`/fighters/${fighterID}`)
            const resData = res.data as Fighter

            const fightsRes = await serverAPI.get(`fighters/${fighterID}/fights`)
            const fightsResData = fightsRes.data as Fight[]

            setFighter(resData)
            setFights(fightsResData)
        }
        catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getFighter()
    }, [fighterID])

    useStompClient({
        '/api/ws/fighters': () => {
            getFighter()
        },
        '/api/ws/fights': () => {
            getFighter()
        },
        '/api/ws/events': () => {
            getFighter()
        }
    })

    return (
        <div className='fight-history-page-container'>
            <MainNavbar />
            <div className='fight-history-content'>
                {
                    !fighter ?
                        <h1>Loading...</h1>
                    :
                        <>
                            <h1>Fight History of {fighter.name}</h1>
                            <div>
                                <FighterImageDisplay className='fight-history-image' fighter={fighter} rounded fluid />
                            </div>
                            {
                                fights.map(fight => <FightCard fight={fight} />)
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default FightHistoryPage