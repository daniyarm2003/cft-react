import { CFTEvent } from '../../utils/types'
import './EventAddModal.css'

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useState } from 'react'

interface ModalProps {
    show: boolean,
    onHide: () => void,
    onSubmit: (cftEvent: CFTEvent) => void
}

function EventAddModal({ show, onHide, onSubmit }: ModalProps) {
    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onHide()

        const date = new Date()

        const dateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
        const timeString = `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`

        const newEvent: CFTEvent = {
            id: '',
            name: name,
            date: `${dateString} ${timeString}`,
            fights: []
        }

        onSubmit(newEvent)
    }

    return (
        <Modal contentClassName='event-add-modal' show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title className='w-100' as='h3'>Create New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>
                    <Button type='submit'>Add Event</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default EventAddModal