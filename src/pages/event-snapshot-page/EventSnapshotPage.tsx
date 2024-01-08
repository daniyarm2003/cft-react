import 'bootstrap/dist/css/bootstrap.css'
import './EventSnapshotPage.css'

import { useParams } from 'react-router-dom'
import { useCFTEvent } from '../../hooks/hooks'
import MainNavbar from '../../components/main-navbar/MainNavbar'
import Table from 'react-bootstrap/Table'
import { CFTEventSnapshotEntry } from '../../utils/types'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { serverAPI } from '../../utils/server'

function EventSnapshotPage() {
    const { eventID } = useParams()

    const [ cftEvent, cftEventError, getCFTEventCB ] = useCFTEvent(eventID ?? '')
    const [ snapshotUploading, setSnapshotUploading ] = useState(false)

    const getCFTEvent = getCFTEventCB ?? (async () => {})

    const uploadSnapshotToGoogleSheets = async () => {
        setSnapshotUploading(true)

        try {
            await serverAPI.post(`/events/${cftEvent?.id}/snapshot/upload`)
            await getCFTEvent()
        }
        catch(err) {
            console.error(err)
        }

        setSnapshotUploading(false)
    }

    const getPositionChangeText = (entry: CFTEventSnapshotEntry) => {
        if(entry.newFighter) {
            return 'NEW'
        }
        else if(entry.positionChange === 0) {
            return '-'
        }
        
        return entry.positionChange > 0 ? `+${entry.positionChange}` : entry.positionChange.toString()
    }

    const getPositionChangeColor = (newFighter: boolean, positionChange: number) => {
        if(newFighter)
            return '#0088ff'
        
        else if(positionChange === 0)
            return 'black'

        return positionChange < 0 ? 'red' : 'green'
    }

    return (
        <div className='event-snapshot-page-container'>
            <MainNavbar />
            <div className='event-snapshot-page-content'>
                {
                    !cftEvent ? 
                        <h1>{ cftEventError ? 'An error has occurred loading this page' : 'Loading...' }</h1>
                    : 
                        !cftEvent.snapshot ? 
                            <h1>{cftEvent.name} does not have a snapshot</h1>
                        :
                            <>
                                <h1>{cftEvent.name} Snapshot</h1>
                                <div className='table-responsive w-100'>
                                    <Table className='snapshot-table'>
                                        <thead>
                                            <th>Position</th>
                                            <th>Name</th>
                                            <th>Wins</th>
                                            <th>Draws</th>
                                            <th>Losses</th>
                                            <th>No Contests</th>
                                            <th>Position Change</th>
                                        </thead>
                                        <tbody>
                                            {
                                                cftEvent.snapshot.snapshotEntries.map(entry => (
                                                    <tr key={entry.id}>
                                                        <td>{entry.position || 'C'}</td>
                                                        <td>{entry.fighterName}</td>
                                                        <td>{entry.wins}</td>
                                                        <td>{entry.draws}</td>
                                                        <td>{entry.losses}</td>
                                                        <td>{entry.noContests}</td>
                                                        <td style={{ color: getPositionChangeColor(entry.newFighter, entry.positionChange) }}>
                                                            {getPositionChangeText(entry)}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                {
                                    cftEvent.snapshot.googleSheetURL ? 
                                        <Button variant='success' href={cftEvent.snapshot.googleSheetURL}>View in Google Sheets</Button>
                                    :
                                        <Button variant='secondary' onClick={() => uploadSnapshotToGoogleSheets()} disabled={snapshotUploading}>{snapshotUploading ? 'Loading...' : 'Upload to Google Sheets'}</Button>
                                }
                            </>
                }
            </div>
        </div>
    )
}

export default EventSnapshotPage