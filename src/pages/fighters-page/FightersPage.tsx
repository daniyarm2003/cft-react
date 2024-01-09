import 'bootstrap/dist/css/bootstrap.css'

import MainNavbar from '../../components/main-navbar/MainNavbar'
import './FightersPage.css'

import Table from 'react-bootstrap/Table'

import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { useEffect, useState } from 'react'
import { Fighter } from '../../utils/types'
import { serverAPI } from '../../utils/server'
import FighterEditModal from '../../components/fighter-edit-modal/FighterEditModal'
import ConfirmationModal from '../../components/confirmation-modal/ConfirmationModal'
import { useStompClient } from '../../hooks/hooks'

import FighterImageDisplay from '../../components/fighter-image-display/FighterImageDisplay'

function FightersPage() {
    const [fighters, setFighters] = useState<Fighter[]>([])

    const [showEditFighter, setShowEditFighter] = useState(false)
    const [curFighter, setCurFighter] = useState<Fighter>()

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [toDelete, setToDelete] = useState<Fighter>()

    const getFighters = async () => {
        try {
            const res = await serverAPI.get('/fighters')
            const resData = res.data as Fighter[]

            setFighters(resData)
        }
        catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getFighters()
    }, [])

    useStompClient({
        '/api/ws/fighters': () => getFighters(),
        '/api/ws/fights': () => getFighters()
    })

    const handleAddFighterSubmit = (fighter: Fighter, imageFile?: File) => {
        const addFighter = async () => {
            try {
                const newFighterRes = await serverAPI.post('/fighters', fighter)

                if(imageFile) {
                    const formData = new FormData()
                    formData.set('file', imageFile)

                    await serverAPI.put(`/fighters/${newFighterRes.data.id}/image`, formData)
                }
            }
            catch(err) {
                console.error(err)
            }
            finally {
                await getFighters()
            }
        }

        addFighter()
    }

    const handleEditFighterSubmit = (fighter: Fighter, deleteImage: boolean, imageFile?: File) => {
        const editFighter = async () => {
            try {
                await serverAPI.put(`/fighters/${fighter.id}`, fighter)

                if(imageFile) {
                    const formData = new FormData()
                    formData.set('file', imageFile)

                    await serverAPI.put(`/fighters/${fighter.id}/image`, formData)
                }
                else if(deleteImage && fighter?.imageFileName) {
                    await serverAPI.delete(`/fighters/${fighter.id}/image`)
                }
            }
            catch(err) {
                console.error(err)
            }
            finally {
                await getFighters()
            }
        }

        editFighter()
    }

    const handleDeleteFighterSubmit = () => {
        const deleteFighter = async () => {
            if(!toDelete)
                return

            try {
                await serverAPI.delete(`/fighters/${toDelete.id}`)
                await getFighters()
            }
            catch(err) {
                console.error(err)
            }
        }

        deleteFighter()
    }

    const handleEditFighterClick = (fighter?: Fighter) => {
        setCurFighter(fighter)
        setShowEditFighter(true)
    }

    const handleDeleteFighterClick = (fighter: Fighter) => {
        setToDelete(fighter)
        setShowDeleteModal(true)
    }

    const handlePositionButtonClick = async (fighter: Fighter, positionChange: number) => {
        const newPos = fighter.position + positionChange

        try {
            const newFighter: Fighter = {
                id: fighter.id,
                name: fighter.name,
                position: newPos,
                positionChange: fighter.positionChange,
                newFighter: fighter.newFighter,
                stats: fighter.stats,
                positionChangeText: fighter.positionChangeText,
                heightInBlocks: fighter.heightInBlocks,
                lengthInBlocks: fighter.lengthInBlocks,
                location: fighter.location,
                team: fighter.team,
                imageFileName: fighter.imageFileName
            }

            await serverAPI.put(`/fighters/${fighter.id}`, newFighter)
            await getFighters()
        }
        catch(err) {
            console.error(err)
        }
    }

    const getPositionChangeColor = (newFighter: boolean, positionChange: number) => {
        if(newFighter)
            return '#0088ff'
        
        else if(positionChange === 0)
            return 'black'

        return positionChange < 0 ? 'red' : 'green'
    }

    return (
        <div className='fighters-page-container'>
            <MainNavbar />
            <div className='fighters-page-content'>
                <h1>CFT Fighters</h1>
                <div className='table-responsive w-100'>
                    <Table className='fighter-table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Position</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Wins</th>
                                <th>Draws</th>
                                <th>Losses</th>
                                <th>No Contests</th>
                                <th>Position Change</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                           {
                                fighters &&
                                fighters.map(fighter => (
                                    <tr key={fighter.id}>
                                        <td>
                                            <ButtonGroup vertical={true}>
                                                <Button className='fighter-pos-button' variant='secondary' disabled={fighter.position <= 0} onClick={() => handlePositionButtonClick(fighter, -1)}>▲</Button>
                                                <Button className='fighter-pos-button' variant='secondary' disabled={fighter.position >= fighters.length - 1} onClick={() => handlePositionButtonClick(fighter, 1)}>▼</Button>
                                            </ButtonGroup>
                                        </td>
                                        <td>
                                            &nbsp;
                                            {fighter.position || 'C'}
                                            &nbsp;
                                        </td>
                                        <td>{fighter.name}</td>
                                        <td><FighterImageDisplay fighter={fighter} className='fighter-image' width={50} height={50} rounded /></td>
                                        <td>{fighter.stats.wins}</td>
                                        <td>{fighter.stats.draws}</td>
                                        <td>{fighter.stats.losses}</td>
                                        <td>{fighter.stats.noContests}</td>
                                        <td style={{color: getPositionChangeColor(fighter.newFighter, fighter.positionChange)}}>
                                            {fighter.newFighter ? 'NEW' : (fighter.positionChange > 0 ? '+' : '') + (fighter.positionChange || '-')}
                                        </td>
                                        <td>
                                            <DropdownButton title='Options' variant='secondary'>
                                                <Dropdown.Item as='button' onClick={() => handleEditFighterClick(fighter)}>Edit Fighter</Dropdown.Item>
                                                <Dropdown.Item href={`/fighters/${fighter.id}/fights`}>View Fight History</Dropdown.Item>
                                                <Dropdown.Item href={`/fighters/${fighter.id}/stats`}>View Statistics</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item as='button' onClick={() => handleDeleteFighterClick(fighter)} style={{color: 'red'}}>Delete Fighter</Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                    </tr>
                                ))
                           }
                        </tbody>
                    </Table>
                </div>
                <div className='fighters-page-button-row'>
                    <Button variant='secondary' size='lg' onClick={() => handleEditFighterClick(undefined)}>Add Fighter</Button>
                    <Button variant='secondary' size='lg' href='/fighters/deleted'>View Deleted</Button>
                </div>
            </div>
            <FighterEditModal lastPlace={fighters?.length ?? 0} show={showEditFighter} fighter={curFighter} onHide={() => setShowEditFighter(false)} onAddSubmit={handleAddFighterSubmit} onEditSubmit={handleEditFighterSubmit} />
            <ConfirmationModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} onConfirm={handleDeleteFighterSubmit}>
                Are you sure you would like to delete this fighter? This action cannot be undone.
            </ConfirmationModal>
        </div>
    )
}

export default FightersPage