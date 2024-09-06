import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { signOut } from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    isWindowOpen: boolean;
    setWindowOpen: Function;
}

export default function LogoutWindow({
    isWindowOpen,
    setWindowOpen
}: Props) {
    const handleClose = () => {
        setWindowOpen(false);
    }

    const handleLogout = () => {
        signOut();
        setWindowOpen(false);
    }

    return (
        <>
            <Dialog
                open={isWindowOpen}
                onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '20px',
                        padding: '20px',
                        width: '300px',
                        textAlign: 'center',
                    },
                }}
            >
                <div className="flex justify-end">
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>

                <DialogTitle>
                    <div className="flex justify-between text-center font-semibold text-lg w-full">
                        Are you sure want to logout?
                    </div>
                </DialogTitle>

                <div className="flex flex-col justify-center items-center w-full mt-4 mb-4">
                    <button
                        onClick={handleClose}
                        className="h-11 btn-primary text-white capitalize font-light w-9/12 text-base rounded-lg mb-3"
                        style={{ maxWidth: '200px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="text-red-500 text-base text-center "
                        style={{ maxWidth: '200px' }}
                    >
                        Logout
                    </button>
                </div>

            </Dialog >
        </>
    );
}