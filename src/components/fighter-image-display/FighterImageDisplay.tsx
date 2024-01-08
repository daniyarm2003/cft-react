import { Fighter } from '../../utils/types'

import Image, { ImageProps } from 'react-bootstrap/Image'
import { serverURL } from '../../utils/server'

import fighterDefaultImage from '../../assets/default_fighter_image.jpg'

interface FighterImageDisplayProps {
    fighter?: Fighter
}

function FighterImageDisplay({ fighter, src, ...props }: FighterImageDisplayProps & ImageProps) {

    const shouldDisplayImage = (window.localStorage.getItem('enableFighterImage') ?? 'true') === 'true'

    const getImageSource = () => {
        if(src)
            return src

        else if(fighter?.imageFileName)
            return `${serverURL}/fighters/${fighter?.id}/image`

        return fighterDefaultImage
    }

    return (
        <Image key={Date.now()} {...props} src={shouldDisplayImage ? getImageSource() : fighterDefaultImage} alt={fighter?.name ?? 'Fighter Image'} />
    )
}

export default FighterImageDisplay