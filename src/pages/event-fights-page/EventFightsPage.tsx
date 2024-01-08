import MainNavbar from '../../components/main-navbar/MainNavbar'
import './EventFightsPage.css'

import { useParams } from 'react-router-dom'
import { fromWSUpdateObj, useCFTEvent, useStompClient } from '../../hooks/hooks'
import FightCard from '../../components/fight-card/FightCard'

import Button from 'react-bootstrap/Button'
import FightEditModal from '../../components/fight-edit-modal/FightEditModal'

import { useState } from 'react'
import { CFTEvent, Fight, Fighter } from '../../utils/types'
import { serverAPI } from '../../utils/server'
import ConfirmationModal from '../../components/confirmation-modal/ConfirmationModal'

import { CFT_EVENT_FIGHTS } from '../../utils/consts'

function EventFightsPage() {
    const { eventID } = useParams()

    const [cftEvent, cftEventErr, getCFTEvent] = useCFTEvent(eventID ?? '')

    const [showModal, setShowModal] = useState(false)
    const [curFight, setCurFight] = useState<Fight>()

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleAddFightClick = () => {
        setShowDeleteModal(false)

        setShowModal(true)
        setCurFight(undefined)
    }

    const handleEditFightClick = (fight: Fight) => {
        setShowDeleteModal(false)

        setShowModal(true)
        setCurFight(fight)
    }

    const handleDeleteFightClick = (fight: Fight) => {
        setShowModal(false)

        setShowDeleteModal(true)
        setCurFight(fight)
    }

    const handleAddSubmit = (fight: Fight, ...fighters: Fighter[]) => {
        const addFight = async () => {

            try {
                const res = await serverAPI.post('/fights', fight)
                const resData = res.data as Fight

                await serverAPI.put(`/fights/${resData.id}/set-fighters`, fighters)
                await serverAPI.put(`/events/${eventID}/add-fight`, resData)

                if(getCFTEvent)
                    await getCFTEvent()
            }
            catch(err) {
                console.error(err)
            }
        }

        addFight()
    }

    const handleEditSubmit = (fight: Fight, ...fighters: Fighter[]) => {
        const editFight = async () => {
            try {
                await serverAPI.put(`/fights/${fight.id}`, fight)
                await serverAPI.put(`/fights/${fight.id}/set-fighters`, fighters)

                if(getCFTEvent)
                    await getCFTEvent()
            }
            catch(err) {
                console.error(err)
            }
        }

        editFight()
    }

    const moveFightPosition = async(fight: Fight, posOffset: number) => {
        try {
            const updatedFight = { ...fight }
            updatedFight.fightNum = (updatedFight.fightNum ?? 0) + posOffset

            await serverAPI.put(`/fights/${fight.id}`, updatedFight)

            if(getCFTEvent)
                await getCFTEvent()
        }
        catch(err) {
            console.error(err)
        }
    }

    const handleDeleteSubmit = () => {
        const deleteFight = async () => {
            if(!curFight)
                return

            try {
                await serverAPI.delete(`/fights/${curFight.id}`)

                if(getCFTEvent)
                    await getCFTEvent()
            }
            catch(err) {
                console.error(err)
            }
        }

        deleteFight()
    }

    useStompClient({
        '/api/ws/events': fromWSUpdateObj<CFTEvent>(eventUpdate => {
            if(eventUpdate.data.id === eventID && getCFTEvent)
                getCFTEvent()
        }),
        '/api/ws/fights': () => {
            if(getCFTEvent)
                getCFTEvent()
        },
        '/api/ws/fighters': fromWSUpdateObj(fighterUpdate => {
            if(fighterUpdate.origin === 'FIGHTS' && getCFTEvent)
                getCFTEvent()
        })
    })

    return (
        <div className='event-fights-page-container'>
            <MainNavbar />
            <div className='event-fights-content'>
                {
                    !cftEvent ? 
                        cftEventErr ? 
                            <h1>An error has occurred</h1>
                        :
                            <h1>Loading...</h1>
                    :
                        <> 
                            <h1>{cftEvent.name} Fights</h1>
                            {
                                cftEvent.fights.length === CFT_EVENT_FIGHTS ?
                                    cftEvent.fights.map((fight, fightInd) => (
                                        <>
                                            <h3><u>
                                                {fightInd === 0 ?
                                                        'Main Event'
                                                : fightInd === 1 ?
                                                    'Co-Main Event'
                                                :
                                                    `Undercard Event #${cftEvent.fights.length - fightInd}`
                                                }
                                            </u></h3>
                                            <FightCard fight={fight} event={cftEvent} onEditClick={handleEditFightClick} onDeleteClick={handleDeleteFightClick} moveFightPosition={moveFightPosition} />
                                            {fightInd !== cftEvent.fights.length - 1 && <br />}
                                        </>
                                    ))
                                :
                                    cftEvent.fights.map(fight => 
                                        <FightCard fight={fight} event={cftEvent} onEditClick={handleEditFightClick} onDeleteClick={handleDeleteFightClick} moveFightPosition={moveFightPosition} />
                                )
                            }
                            <Button variant='secondary' size='lg' onClick={handleAddFightClick}>Add Fight</Button>
                        </>
                }
            </div>
            <FightEditModal fight={curFight} show={showModal} onHide={() => setShowModal(false)} onAddSubmit={handleAddSubmit} onEditSubmit={handleEditSubmit} />
            <ConfirmationModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} onConfirm={handleDeleteSubmit}>
                Are you sure you would like to delete this fight? This action cannot be undone.
            </ConfirmationModal>
        </div>
    )
}

export default EventFightsPage