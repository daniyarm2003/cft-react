import './FighterEditModal.css'

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useEffect, useState } from 'react'
import { Fighter } from '../../utils/types'

interface ModalProps {
    fighter?: Fighter,
    show: boolean,
    onHide: () => void,
    onSubmit: (fighter: Fighter) => void
}

function FighterEditModal({ fighter, show, onHide, onSubmit }: ModalProps) {
    const [name, setName] = useState('')

    useEffect(() => {
        setName(fighter?.name ?? '')
    }, [fighter])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onHide()

        if(!fighter)
            return

        const newFighter: Fighter = {
            id: fighter.id,
            name: name,
            position: fighter.position,
            positionChangeText: '',
            newFighter: false,
            positionChange: -1,
            stats: {
                wins: 0,
                losses: 0,
                draws: 0,
                noContests: 0
            }
        }

        onSubmit(newFighter)
    }

    return (
        <Modal contentClassName='fighter-edit-modal' show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title className='w-100' as='h3'>Create New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Fighter Name</Form.Label>
                        <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>
                    <Button type='submit'>Save Fighter</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default FighterEditModal