import './FeatureCard.css'

import { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import { Fighter, CFTEvent } from '../../utils/types'
import { serverAPI } from '../../utils/server'
import { useStompClient } from '../../hooks/hooks'
import FighterImageDisplay from '../fighter-image-display/FighterImageDisplay'

function FeatureCard() {
    const [champion, setChampion] = useState<Fighter>()
    const [curEvent, setCurEvent] = useState<CFTEvent>()

    const getChampion = async () => {
        try {
            const championRes = await serverAPI.get('/fighters/champion')
            setChampion(championRes.data as Fighter)
        }
        catch(err) {
            console.error(err)
        }
    }

    const getCurEvent = async () => {
        try {
            const curEventRes = await serverAPI.get('/events/current')
            setCurEvent(curEventRes.data as CFTEvent)
        }
        catch(err) {
            console.error(err)
        }
    }

    useStompClient({
        '/api/ws/fighters': () => getChampion(),
        '/api/ws/events': () => getCurEvent()
    })

    useEffect(() => {
        getChampion()
        getCurEvent()
    }, [])

    return (
        <Card className='feature-card-header'>
            <Card.Header>
                <Card.Title as='h2'>Featured</Card.Title>
            </Card.Header>
            <ListGroup variant='flush'>
                <ListGroup.Item className='feature-card-item'>
                    <FighterImageDisplay className='feature-card-champion-image' fighter={champion} rounded />
                    <br />
                    <h5>Current Champion: {champion?.name ?? 'Loading...'} {champion && <>({champion.stats.wins} W, {champion.stats.losses} L, {champion.stats.draws} D, {champion.stats.noContests} NC)</>}</h5>
                </ListGroup.Item>
                <ListGroup.Item className='feature-card-item'>
                    <h5>Current Event: {curEvent?.name ?? 'Loading...'}</h5>
                    <Button href={`/events/${curEvent?.id}/fights`} variant='secondary' disabled={!curEvent}>View Fights</Button>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default FeatureCard