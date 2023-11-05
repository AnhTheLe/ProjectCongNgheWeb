import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContex';
import { createAuthHeader } from '../../utils/createAuthHeader';
import Button from '@mui/material/Button';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ImageUploader({keyInput, imageUrl, onImageUpload, witdh, height, fontSize }) {

    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState('');
    const { token } = useContext(AuthContext);
    //
    const [open, setOpen] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);

    const handleOpenAlert = (messageAlert, typeAlert) => {
        setMessageAlert(messageAlert);
        setTypeAlert(typeAlert);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    //
    const handleFileChange = (e) => {
        handleUpload(e.target.files[0]);
    };


    const handleUpload = async (file) => {
        console.log(0);
        const headers = createAuthHeader(token);
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                setOpenCircularProgress(true)
                const response = await axios.post('http://localhost:8080/admin/upload/image', formData, {
                    headers
                });
                //console.log(response.data);
                if (response.data.responseCode === 200) {
                    const data = response.data;
                    onImageUpload(data.data);
                    handleOpenAlert('Đã tải lên ảnh', 'success')
                    setOpenCircularProgress(false)
                } else {
                    console.error('Error:', response.data.response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <>

            <div style={{ height: height, witdh: witdh, display:'flex', justifyContent:'center' }}>
                <Button >
                    <label htmlFor={"fileInput"+keyInput}>
                        <input id={"fileInput"+keyInput} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                        {imageUrl ?
                            <img src={imageUrl} alt={imageUrl} style={{ maxHeight:height, maxWidth:witdh }} />
                            : <CropOriginalIcon style={{ fontSize: fontSize }} />}
                    </label>
                </Button>

            </div>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                        {messageAlert}
                    </Alert>
                </Snackbar>
            </Stack>
            {openCircularProgress ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box> : ''
            }
        </>
    );
}

export default ImageUploader;
