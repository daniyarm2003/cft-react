import Button, { ButtonProps } from 'react-bootstrap/Button'
import { CFTEvent, CFTEventSnapshot } from '../../utils/types'
import { useState } from 'react'

interface EventSnapshotButtonProps {
    event?: CFTEvent,
    takeSnapshotText: string,
    viewSnapshotText: string,
    takeSnapshot: (event: CFTEvent) => Promise<CFTEventSnapshot>
}

function EventSnapshotButton({ event, takeSnapshotText, viewSnapshotText, takeSnapshot, ...props }: EventSnapshotButtonProps & Omit<ButtonProps, 'as'>) {
    const [ loading, setLoading ] = useState(false)

    if(!event) {
        return null
    }

    const handleSnapshot = async () => {
        try {
            setLoading(true)
            await takeSnapshot(event)
            setLoading(false)
        }
        catch(err) {
            console.error(err)
            setLoading(false)
        }
    }

    const buttonText = event.snapshot ? viewSnapshotText : takeSnapshotText

    return <Button {...props} disabled={loading} onClick={!event.snapshot ? () => handleSnapshot() : undefined}>{loading ? 'Loading...' : buttonText}</Button>
}

export default EventSnapshotButton