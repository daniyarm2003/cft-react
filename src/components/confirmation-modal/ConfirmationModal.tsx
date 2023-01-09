import './ConfirmationModal.css'

import React from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

interface ModalProps {
    show: boolean,
    onHide: () => void,
    onConfirm: () => void
}

function ConfirmationModal({ show, onHide, onConfirm, children }: React.PropsWithChildren<ModalProps>) {
    const handleConfirmClick = () => {
        onConfirm()
        onHide()
    }

    return (
        <Modal contentClassName='confirmation-modal' show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title className='w-100' as='h3'>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
                <div className='button-row'>
                    <Button variant='success' onClick={handleConfirmClick}>Yes</Button>
                    <Button variant='danger' onClick={onHide}>No</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmationModal