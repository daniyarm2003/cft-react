import './FightCard.css'

import { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { CFTEvent, Fight, Fighter } from '../../utils/types'
import { serverAPI } from '../../utils/server'

interface FightCardProps {
    fight: Fight,
    event?: CFTEvent,
    onEditClick?: (fight: Fight) => void,
    onDeleteClick?: (fight: Fight) => void
}

type FightPrediction = {
    hasPrediction: false
} | {
    hasPrediction: true,
    winner: Fighter
    probability: number
}

function FightCard({ fight, event, onEditClick, onDeleteClick }: FightCardProps) {
    const [fighter1, fighter2] = fight.fighters

    const [eventName, setEventName] = useState(event?.name ?? 'Loading...')
    const [fightPrediction, setFightPrediction] = useState<FightPrediction>()

    const shouldPredict = fight.status === 'not_started' && fighter1 && fighter2 && window.localStorage.getItem('disableAIPredictions') !== 'true'

    useEffect(() => {
        const getEventName = async () => {
            try {
                const res = await serverAPI.get(`/fights/${fight.id}/event`)
                const fightEvent = res.data as CFTEvent

                setEventName(fightEvent.name)
            }
            catch(err) {
                console.error(err)
            }
        }

        const getAIPrediction = async () => {
            if(!shouldPredict) {
                setFightPrediction(undefined)
                return
            }

            try {
                const res = await serverAPI.get(`/fights/${fight.id}/predict-winner`)
                const prediction = res.data as FightPrediction

                setFightPrediction(prediction)
            }
            catch(err) {
                setFightPrediction(undefined)
                console.error(err)
            }
        }

        if(!event)
            getEventName()

        getAIPrediction()
        
    }, [event, fight.id, shouldPredict])

    const fightStatus = fight.status

    const getTimeString = () => {
        const minutes = Math.floor(fight.durationInSeconds / 60)
        const seconds = fight.durationInSeconds % 60

        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const getPredictionText = () => {
        if(!shouldPredict)
            return

        else if(!fightPrediction)
            return 'AI Prediction: Loading...'
        
        else if(!fightPrediction.hasPrediction)
            return 'AI Prediction: N/A'
        
        return `AI Prediction: ${fightPrediction.winner.name} is more likely to win, with a ${(100 * fightPrediction.probability).toFixed(2)}% chance of winning`
    }

    const predictionText = getPredictionText()

    const statusTexts = {
        'has_winner': () => `${fight.winner?.name ?? deletedFighterName} defeated ${fight.winner?.id === fighter1?.id ? fighter2?.name ?? deletedFighterName : fighter1?.name ?? deletedFighterName} after ${getTimeString()}`,
        'draw': () => 'The fight resulted in a draw after ' + getTimeString(),
        'no_contest': () => 'No contest after ' + getTimeString(),
        'not_started': () => 'The fight has not started' + (predictionText ? ` (${predictionText})` : '')
    }

    const deletedFighterName = 'Deleted Fighter'

    return (
        <Card className='fight-card'>
            <Card.Header>
                <Card.Title as='h3'>{fighter1?.name ?? deletedFighterName} vs {fighter2?.name ?? deletedFighterName}</Card.Title>
                <Card.Subtitle className='text-muted'>{statusTexts[fightStatus]()}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                {
                    fighter1 && <>
                        <Card.Text as='h5'>{fighter1.name} Stats</Card.Text>
                        <Card.Text>Rank: {fighter1.position || 'C'} ({fighter1.stats.wins} W, {fighter1.stats.losses} L, {fighter1.stats.draws} D, {fighter1.stats.noContests} NC)</Card.Text>
                    </>
                }
                {
                    fighter2 && <>
                        <Card.Text as='h5'>{fighter2.name} Stats</Card.Text>
                        <Card.Text>Rank: {fighter2.position || 'C'} ({fighter2.stats.wins} W, {fighter2.stats.losses} L, {fighter2.stats.draws} D, {fighter2.stats.noContests} NC)</Card.Text>
                    </>
                }
                { (onEditClick || onDeleteClick) && <div className='fight-card-button-row'>
                    { onEditClick && <Button variant='secondary' size='lg' onClick={() => onEditClick(fight)}>Edit Fight</Button> }
                    { onDeleteClick && <Button variant='danger' size='lg' onClick={() => onDeleteClick(fight)}>Delete Fight</Button> }
                </div> }
            </Card.Body>
            <Card.Footer>
                <Card.Text>Event: {eventName}</Card.Text>
            </Card.Footer>
        </Card>
    )
}

export default FightCard