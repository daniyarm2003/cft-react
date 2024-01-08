import './FighterEditModal.css'

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useEffect, useState, useCallback } from 'react'
import { Fighter } from '../../utils/types'
import { MAX_IMAGE_UPLOAD_SIZE } from '../../utils/consts'
import FighterImageDisplay from '../fighter-image-display/FighterImageDisplay'

interface ModalProps {
    fighter?: Fighter,
    show: boolean,
    lastPlace: number,
    onHide: () => void,
    onAddSubmit: (fighter: Fighter, imageFile?: File) => void,
    onEditSubmit: (fighter: Fighter, deleteImage: boolean, imageFile?: File) => void
}

function FighterEditModal({ fighter, show, onHide, onAddSubmit, onEditSubmit, lastPlace }: ModalProps) {
    const [name, setName] = useState('')

    const [location, setLocation] = useState('')
    const [team, setTeam] = useState('')

    const [height, setHeight] = useState<number>()
    const [length, setLength] = useState<number>()

    const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState<string>()
    const [imageUploadFile, setImageUploadFile] = useState<File>()
    const [imageUploadBlobURL, setImageUploadBlobURL] = useState<string>()

    const [deleteImage, setDeleteImage] = useState(false)

    const resetState = useCallback(() => {
        setName(fighter?.name ?? '')

        setLocation(fighter?.location ?? '')
        setTeam(fighter?.team ?? '')
        setHeight(fighter?.heightInBlocks)
        setLength(fighter?.lengthInBlocks)

        setImageUploadErrorMsg(undefined)
        setImageUploadFile(undefined)
        setDeleteImage(false)
    }, [fighter])

    const handleHideModal = () => {
        onHide()
        resetState()
    }

    useEffect(() => {
        resetState()
    }, [resetState])

    useEffect(() => {
        if(imageUploadFile) {
            setImageUploadBlobURL(URL.createObjectURL(imageUploadFile))
        }
        else {
            setImageUploadBlobURL(undefined)
        }

        return () => {
            if(imageUploadBlobURL)
                URL.revokeObjectURL(imageUploadBlobURL)
        }
    }, [imageUploadFile])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onHide()

        if(!fighter) {
            const newFighter: Fighter = {
                id: '',
                name: name,
                position: lastPlace,
                newFighter: true,
                positionChange: -1,
                positionChangeText: '',
                location: location !== '' ? location : undefined,
                heightInBlocks: height,
                lengthInBlocks: length,
                team: team !== '' ? team : undefined,
                stats: {
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    noContests: 0
                }
            }

            onAddSubmit(newFighter, imageUploadFile)
            return
        }
        
        const newFighter: Fighter = {
            id: fighter.id,
            name: name,
            position: fighter.position,
            positionChangeText: fighter.positionChangeText,
            newFighter: fighter.newFighter,
            positionChange: fighter.positionChange,
            location: location !== '' ? location : undefined,
            heightInBlocks: height,
            lengthInBlocks: length,
            team: team !== '' ? team : undefined,
            stats: fighter.stats,
            imageFileName: fighter.imageFileName
        }

        onEditSubmit(newFighter, deleteImage, imageUploadFile)
    }

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.item(0)
        setImageUploadErrorMsg(undefined)

        if(!uploadedFile) {
            setImageUploadFile(undefined)
            return
        }

        else if(uploadedFile.size > MAX_IMAGE_UPLOAD_SIZE) {
            setImageUploadFile(undefined)
            setImageUploadErrorMsg(`File cannot be larger than ${MAX_IMAGE_UPLOAD_SIZE / (1024 * 1024)} MiB`)

            return
        }

        setImageUploadFile(uploadedFile)
    }

    const handleDeleteImage = () => {
        setImageUploadErrorMsg(undefined)
        setImageUploadFile(undefined)
        setDeleteImage(true)
    }

    return (
        <Modal contentClassName='fighter-edit-modal' show={show} onHide={handleHideModal}>
            <Modal.Header closeButton>
                <Modal.Title className='w-100' as='h3'>Edit Fighter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Fighter Name</Form.Label>
                        <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Fighter Image</Form.Label>
                        <br />
                        <FighterImageDisplay fighter={!deleteImage ? fighter : undefined} src={imageUploadBlobURL} rounded fluid />
                        <div className='fighter-image-buttons'>
                            <Form.Control type='file' accept='image/*' onChange={handleImageFileChange} value={imageUploadFile ? undefined : ''} />
                            <Button variant='danger' onClick={handleDeleteImage} disabled={(!fighter?.imageFileName || deleteImage) && !imageUploadFile}>Delete Image</Button>
                        </div>
                        {imageUploadErrorMsg && <Form.Text className='error-text'>{imageUploadErrorMsg}</Form.Text>}
                    </Form.Group>
                    <Row className='mb-3'>
                        <Form.Group as={Col}>
                            <Form.Label>Fighter Location of Origin</Form.Label>
                            <Form.Control type='text' value={location} onChange={e => setLocation(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Fighter Team</Form.Label>
                            <Form.Control type='text' value={team} onChange={e => setTeam(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                    <Form.Group as={Col}>
                        <Form.Label>Fighter Height</Form.Label>
                        <InputGroup>
                            <Form.Control type='number' step={0.01} value={height ?? ''} onChange={e => setHeight(parseFloat(e.target.value) || undefined)} />
                            <InputGroup.Text> blocks</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Fighter Length/Width</Form.Label>
                        <InputGroup>
                            <Form.Control type='number' step={0.01} value={length ?? ''} onChange={e => setLength(parseFloat(e.target.value) || undefined)} />
                            <InputGroup.Text>blocks</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    </Row>
                    <Button type='submit'>Save Fighter</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default FighterEditModal