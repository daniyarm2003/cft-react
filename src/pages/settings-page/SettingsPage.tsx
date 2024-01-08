import MainNavbar from '../../components/main-navbar/MainNavbar'
import './SettingsPage.css'

import Card from 'react-bootstrap/Card'
import ToggleButton from '../../components/toggle-button/ToggleButton'
import { useState } from 'react'
import { useBooleanLocalStorageSetting } from '../../hooks/hooks'

function SettingsPage() {
    const [disableLiveUpdates, setDisableLiveUpdates] = useState(window.localStorage.getItem('disableLiveUpdates') === 'true')
    const [disableAIPredictions, setDisableAIPredictions] = useState(window.localStorage.getItem('disableAIPredictions') === 'true')
    const [enableFighterImage, setEnableFighterImage] = useBooleanLocalStorageSetting('enableFighterImage')

    const handleLiveUpdatesChange = (enabled: boolean) => {
        try {
            window.localStorage.setItem('disableLiveUpdates', `${!enabled}`)
            setDisableLiveUpdates(!enabled)
        }
        catch(err) {
            console.error(err)
        }
    }

    const handleAIPredictionsChange = (enabled: boolean) => {
        try {
            window.localStorage.setItem('disableAIPredictions', `${!enabled}`)
            setDisableAIPredictions(!enabled)
        }
        catch(err) {
            console.error(err)
        }
    }

    return (
        <div className='settings-page-container'>
            <MainNavbar />
            <div className='settings-page-content'>
                <h1>Settings</h1>
                <Card className='settings-card'>
                    <Card.Header>
                        <Card.Title as='h3'>Live Updates</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ToggleButton enabled={!disableLiveUpdates} onChange={handleLiveUpdatesChange} onText='Enabled' offText='Disabled' size='lg' />
                    </Card.Body>
                </Card>
                <Card className='settings-card'>
                    <Card.Header>
                        <Card.Title as='h3'>AI Predictions</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ToggleButton enabled={!disableAIPredictions} onChange={handleAIPredictionsChange} size='lg' />
                    </Card.Body>
                </Card>
                <Card className='settings-card'>
                    <Card.Header>
                        <Card.Title as='h3'>Fighter Images</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ToggleButton enabled={enableFighterImage} onChange={setEnableFighterImage} size='lg' />
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default SettingsPage