import './StatsListCard.css'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

interface StatsListCardProps {
    listName: string,
    statsList: Record<string, any>
}

function StatsListCard({ listName, statsList }: StatsListCardProps) {
    return (
        <Card className='stats-list-card'>
            <Card.Header>
                <Card.Title>{listName}</Card.Title>
            </Card.Header>
            <ListGroup variant='flush'>
                {
                    Object.entries(statsList).map(([statName, statValue]) => (
                        <ListGroup.Item className='stats-list-card-item'>{statName}: <i>{statValue}</i></ListGroup.Item>
                    ))
                }
            </ListGroup>
        </Card>
    )
}

export default StatsListCard