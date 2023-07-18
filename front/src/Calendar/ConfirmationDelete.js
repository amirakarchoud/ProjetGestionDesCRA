import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2 id="modal-title">Confirm Deletion</h2>
                <p id="modal-description">Are you sure you want to delete this item?</p>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm}>Confirm</Button>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
