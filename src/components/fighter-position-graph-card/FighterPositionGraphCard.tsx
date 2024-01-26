import './FighterPositionGraphCard.css'

import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'

import { Fighter } from '../../utils/types'
import { serverURL } from '../../utils/server'

interface FighterPositionGraphCardProps {
    fighter: Fighter
}

function FighterPositionGraphCard({ fighter }: FighterPositionGraphCardProps) {
    return (
        <Card className='fighter-position-graph-card'>
            <Card.Header>
                <Card.Title>{fighter.name}'s Position Graph</Card.Title>
            </Card.Header>
            <Card.Body>
                <Image className='fighter-position-graph-image' key={Date.now()} src={`${serverURL}/fighters/${fighter.id}/position_graph`} alt={`${fighter.name}'s Position Graph`} />
            </Card.Body>
        </Card>
    )
}

export default FighterPositionGraphCard