import Button from 'react-bootstrap/Button'

interface ButtonProps {
    onText?: string,
    offText?: string,
    onChange?: (enabled: boolean) => void,
    enabled: boolean,
    size?: 'sm' | 'lg'
}

function ToggleButton({ enabled, onText, offText, onChange, size }: ButtonProps) {

    const handleClick = () => {
        if(onChange)
            onChange(!enabled)
    }

    return (
        <Button variant={enabled ? 'success' : 'danger'} onClick={handleClick} size={size}>
            {enabled ? (onText ?? 'ON') : (offText ?? 'OFF')}
        </Button>
    )
}

export default ToggleButton