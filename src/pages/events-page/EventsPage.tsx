import './EventsPage.css'

import { serverAPI } from '../../utils/server'
import { useState, useEffect } from 'react'

import MainNavbar from '../../components/main-navbar/MainNavbar'
import { CFTEvent } from '../../utils/types'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import EventEditModal from '../../components/event-edit-modal/EventEditModal'
import EventAddModal from '../../components/event-add-modal/EventAddModal'
import ConfirmationModal from '../../components/confirmation-modal/ConfirmationModal'
import { useStompClient } from '../../hooks/hooks'
import Spinner from 'react-bootstrap/Spinner'

function EventsPage() {
    const [cftEvents, setCFTEvents] = useState<CFTEvent[]>()

    const [modalEvent, setModalEvent] = useState<CFTEvent>()
    const [modalShow, setModalShow] = useState(false)

    const [addModalShow, setAddModalShow] = useState(false)

    const [toDelete, setToDelete] = useState<CFTEvent>()
    const [deleteModalShow, setDeleteModalShow] = useState(false)

    const [addEventLoading, setAddEventLoading] = useState(false)

    const getCFTEvents = async () => {
        try {
            const res = await serverAPI.get('/events')
            const resData = res.data as CFTEvent[]

            setCFTEvents(resData)
        }
        catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getCFTEvents()
    }, [])

    useStompClient({
        '/api/ws/events': () => getCFTEvents()
    })

    const handleEditClick = (cftEvent: CFTEvent) => {
        setModalEvent(cftEvent)
        setModalShow(true)
    }

    const handleDeleteClick = (cftEvent: CFTEvent) => {
        setToDelete(cftEvent)
        setDeleteModalShow(true)
    }

    const handleModalSubmit = (cftEvent: CFTEvent) => {
        const updateCFTEvent = async () => {
            try {
                await serverAPI.put(`/events/${cftEvent.id}`, cftEvent)
                await getCFTEvents()
            }
            catch(err) {
                console.error(err)
            }
        }

        updateCFTEvent()
    }

    const handleAddModalSubmit = (cftEvent: CFTEvent) => {
        const addCFTEvent = async () => {
            try {
                setAddEventLoading(true)

                await serverAPI.post(`/events`, cftEvent)
                await getCFTEvents()
            }
            catch(err) {
                console.error(err)
            }

            setAddEventLoading(false)
        }

        addCFTEvent()
    }

    const handleEventDelete = () => {
        const deleteCFTEvent = async () => {
            if(!toDelete)
                return

            try {
                await serverAPI.delete(`/events/${toDelete.id}`)
                await getCFTEvents()
            }
            catch(err) {
                console.error(err)
            }
        }

        deleteCFTEvent()
    }

    return (
        <div className='events-page-container'>
            <MainNavbar />
            <div className='events-page-content'>
                <h1>CFT Events</h1>
                <div className='event-card-container'>
                    {
                        cftEvents &&
                        cftEvents.map(cftEvent => (
                            <Card className='event-card' key={cftEvent.id}>
                                <Card.Header>
                                    <Card.Title>{cftEvent.name}</Card.Title>
                                </Card.Header>
                                <Card.Body className='event-card-body'>
                                    <Button variant='secondary' onClick={() => handleEditClick(cftEvent)}>Edit Name</Button>
                                    <Button href={`/events/${cftEvent.id}/fights`} variant='secondary'>View Fights</Button>
                                    <Button href={`/events/${cftEvent.id}/snapshot`} variant='secondary' disabled={!cftEvent.snapshot}>View Snapshot</Button>
                                    <Button variant='danger' onClick={() => handleDeleteClick(cftEvent)}>Delete Event</Button>
                                </Card.Body>
                            </Card>
                        ))
                    }
                    <Card className='event-card cursor-pointer' onClick={() => setAddModalShow(!addEventLoading)}>
                        <Card.Body className='event-card-body'>
                            {
                                addEventLoading ?
                                    <Card.Body>
                                        <Spinner animation='border' />
                                    </Card.Body>
                                :
                                    <Card.Title as='h1'>+</Card.Title>
                            }
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <EventEditModal cftEvent={modalEvent} show={modalShow} onHide={() => setModalShow(false)} onSubmit={handleModalSubmit} />
            <EventAddModal show={addModalShow} onHide={() => setAddModalShow(false)} onSubmit={handleAddModalSubmit} />
            <ConfirmationModal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} onConfirm={handleEventDelete}>
                Are you sure you would like to delete this event? This action cannot be undone.
            </ConfirmationModal>
        </div>
    )
}

export default EventsPage