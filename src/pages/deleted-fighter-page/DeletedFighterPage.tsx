import 'bootstrap/dist/css/bootstrap.css'
import './DeletedFighterPage.css'

import { useState, useEffect } from 'react'
import MainNavbar from '../../components/main-navbar/MainNavbar'
import { serverAPI } from '../../utils/server'
import { DeletedFighter, Fighter } from '../../utils/types'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { fromWSUpdateObj, useStompClient } from '../../hooks/hooks'

function DeletedFighterPage() {
    const [deletedFighters, setDeletedFighters] = useState<DeletedFighter[]>([])

    const getDeletedFighters = async () => {
        try {
            const deletedFighterRes = await serverAPI.get('/fighters/deleted')
            setDeletedFighters(deletedFighterRes.data as DeletedFighter[])
        }
        catch(err) {
            console.error(err)
        }
    }

    useStompClient({
        '/api/ws/fighters': fromWSUpdateObj<Fighter>((fighterObj => {
            if(fighterObj.type === 'DELETE')
                getDeletedFighters()
        }))
    })

    useEffect(() => {
        getDeletedFighters()
    }, [])

    return (
        <div className='deleted-fighter-page-container'>
            <MainNavbar />
            <div className='deleted-fighter-page-content'>
                <h1>Deleted Fighters</h1>
                <div className='table-responsive w-100'>
                    <Table className='deleted-fighter-table'>
                        <thead>
                            <tr>
                                <th>Fighter Name</th>
                                <th>Debut Event</th>
                                <th>Last Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                deletedFighters.map(fighter => (
                                    <tr key={fighter.id}>
                                        <td>{fighter.fighterName}</td>
                                        <td>{fighter.debutEvent.name}</td>
                                        <td>{fighter.finalEvent.name}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <div className='deleted-fighter-page-button-row'>
                        <Button variant='secondary' size='lg' href='/fighters'>View Active</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeletedFighterPage