import './FightEditModal.css'

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

import React, { useState, useEffect } from 'react'

import { Fight, Fighter } from '../../utils/types'
import { serverAPI } from '../../utils/server'

interface ModalProps {
    fight?: Fight
    show: boolean,
    onHide: () => void,
    onAddSubmit: (fight: Fight, ...fighters: Fighter[]) => void,
    onEditSubmit: (fight: Fight, ...fighters: Fighter[]) => void
}

type FightStatusType = 'has_winner' | 'draw' | 'no_contest' | 'not_started'

function FightEditModal({ fight, show, onHide, onAddSubmit, onEditSubmit }: ModalProps) {
    const [fighter1, setFighter1] = useState<Fighter>()
    const [fighter2, setFighter2] = useState<Fighter>()

    const [allFighters, setAllFighters] = useState<Fighter[]>([])

    const [fightStatus, setFightStatus] = useState<FightStatusType>('not_started')

    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    const [winner, setWinner] = useState<Fighter>()

    const statusMap: Record<FightStatusType, string> = {
        'has_winner': 'Has Winner',
        'draw': 'Draw',
        'no_contest': 'No Contest',
        'not_started': 'Not Started'
    }

    const statusTextToID = (statusText: string) => {
        return statusText.toLowerCase().split(/\s+/).join('_') as FightStatusType
    }

    useEffect(() => {
        setFighter1(fight?.fighters[0])
        setFighter2(fight?.fighters[1])

        if(fight)
            setFightStatus(fight.status)

        setMinutes(Math.floor((fight?.durationInSeconds ?? 0) / 60))
        setSeconds((fight?.durationInSeconds ?? 0) % 60)

        setWinner(fight?.winner === null ? undefined : fight?.winner)

    }, [fight])

    useEffect(() => {
        const getFighters = async () => {
            try {
                const res = await serverAPI.get('/fighters')
                const resData = res.data as Fighter[]

                setAllFighters(resData)
            }
            catch(err) {
                console.error(err)
            }
        }

        getFighters()
    }, [])

    const handleFighterSelectChange = (selectedIndex: number, forFighter: 'fighter1' | 'fighter2') => {
        if(selectedIndex === 0)
            return

        const selectedFighter = allFighters.filter(fighter => fighter.id !== (forFighter === 'fighter1' ? fighter2?.id : fighter1?.id))[selectedIndex - 1]

        const cb1 = forFighter === 'fighter1' ? setFighter1 : setFighter2
        const cb2 = forFighter === 'fighter1' ? setFighter2 : setFighter1

        const fightersEqual = selectedFighter.id === (forFighter === 'fighter1' ? fighter2 : fighter1)?.id

        cb1(selectedFighter)

        if(fightersEqual)
            cb2(undefined)

        setWinner(undefined)
    }

    const handleFightStatusChange = (newStatus: FightStatusType) => {
        setFightStatus(newStatus)
        setWinner(undefined)
    }

    const handleWinnerSelectChange = (selectedIndex: number) => {
        if(selectedIndex < 1 || selectedIndex > 2)
            return
        
        setWinner(selectedIndex === 1 ? fighter1 : fighter2)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onHide()

        if(!fighter1 || !fighter2)
            return

        const date = new Date()

        const dateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
        const timeString = `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`

        const newFight: Fight = {
            id: fight?.id ?? '',
            status: fightStatus,
            date: fight?.date ?? `${dateString} ${timeString}`,
            durationInSeconds: (minutes ?? 0) * 60 + (seconds ?? 0),
            fighters: [],
            winner: fightStatus === 'has_winner' ? winner : null
        }

        const cb = fight ? onEditSubmit : onAddSubmit

        cb(newFight, fighter1, fighter2)
    }

    return (
        <Modal contentClassName='fight-edit-modal' show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title className='w-100' as='h3'>{fight ? 'Edit Fight' : 'Add Fight'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className='mb-3'>
                        <Form.Group as={Col}>
                            <Form.Label>Fighter 1</Form.Label>
                            <Form.Select value={fighter1?.name ?? ''} onChange={e => handleFighterSelectChange(e.target.selectedIndex, 'fighter1')} required>
                                <option />
                                {
                                    allFighters.filter(fighter => fighter.id !== fighter2?.id).map(fighter => <option>{fighter.name}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Fighter 2</Form.Label>
                            <Form.Select value={fighter2?.name ?? ''} onChange={e => handleFighterSelectChange(e.target.selectedIndex, 'fighter2')} required>
                                <option />
                                {
                                    allFighters.filter(fighter => fighter.id !== fighter1?.id).map(fighter => <option>{fighter.name}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Form.Group className='mb-3'>
                        <Form.Label>Fight Status</Form.Label>
                        <Form.Select value={statusMap[fightStatus]} onChange={e => handleFightStatusChange(statusTextToID(e.target.value))} required>
                            <option>Not Started</option>
                            <option>Has Winner</option>
                            <option>Draw</option>
                            <option>No Contest</option>
                        </Form.Select>
                    </Form.Group>
                    {
                        fighter1 && fighter2 &&
                        <>
                            {
                                fightStatus !== 'not_started' &&
                                <Form.Group className='mb-3'>
                                    <Form.Label>Fight Duration</Form.Label>
                                    <InputGroup>
                                        <Form.Control placeholder='Minutes' type='number' min={0} required value={minutes} onChange={e => setMinutes(parseInt(e.target.value))} />
                                        <InputGroup.Text>:</InputGroup.Text>
                                        <Form.Control placeholder='Seconds' type='number' min={0} max={59} value={seconds} required onChange={e => setSeconds(parseInt(e.target.value))} />
                                    </InputGroup>
                                </Form.Group>
                            }
                            {
                                fightStatus === 'has_winner' &&
                                <Form.Group className='mb-3'>
                                    <Form.Label>Winner</Form.Label>
                                    <Form.Select value={winner?.name ?? ''} required onChange={e => handleWinnerSelectChange(e.target.selectedIndex)}>
                                        <option />
                                        <option>{fighter1.name}</option>
                                        <option>{fighter2.name}</option>
                                    </Form.Select>
                                </Form.Group>
                            }
                            <Button type='submit'>{fight ? 'Edit Fight' : 'Add Fight'}</Button>
                        </>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default FightEditModal