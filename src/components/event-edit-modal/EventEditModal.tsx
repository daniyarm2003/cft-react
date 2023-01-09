import './EditEventModal.css'

import { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { CFTEvent } from '../../utils/types'

interface ModalProps {
    cftEvent?: CFTEvent,
    show: boolean,
    onHide: () => void,
    onSubmit: (cftEvent: CFTEvent) => void
}

function EventEditModal({ cftEvent, show, onHide, onSubmit }: ModalProps) {
    const [name, setName] = useState('')

    useEffect(() => {
        setName(cftEvent?.name ?? '')
    }, [cftEvent])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onHide()

        if(!cftEvent)
            return

        const newEvent: CFTEvent = {
            id: cftEvent.id,
            name: name,
            date: cftEvent.date,
            fights: cftEvent.fights
        }

        onSubmit(newEvent)
        onHide()
    }

    return (
        <Modal contentClassName='edit-event-modal' show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title className='w-100' as='h3'>{cftEvent?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>
                    <Button type='submit'>Save Event</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default EventEditModal