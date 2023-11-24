import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Rating from '@mui/material/Rating';

import { AuthContext } from '../../contexts/AuthContex';
import * as CustomerServices from '../../services/CustomerServices';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 430,
    borderRadius: '6px',
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
};

function AddResponse({ openModal, closeModal, customer }) {
    const { token } = useContext(AuthContext);
    const [openAddResponse, setOpenAddResponse] = useState(false);
    const [contentText, setContentText] = useState('');
    const [errorSave, setErrorSave] = useState(false);
    const [evaluate, setEvaluate] = useState(0);

    const handleCloseAddResponse = () => {
        setErrorSave(false);
        closeModal();
        setOpenAddResponse(false);
    };

    const handleChangeEvaluate = (event, newValue) => {
        setEvaluate(newValue);
    };

    const handleSaveResponse = () => {
        if (contentText.trim() === '') {
            toast.error('Phản hồi không được để trống');
            setErrorSave(true);
        } else {
            setErrorSave(false);

            const fetchApi = async () => {
                try {
                    const result = await CustomerServices.createFeedback(
                        {
                            evaluate: evaluate,
                            content: contentText,
                            customerId: customer.id,
                        },
                        token,
                    );
                    if (result) {
                        toast.success('Thêm phản hồi thành công', {
                            autoClose: 2000,
                        });
                        handleCloseAddResponse();
                        setEvaluate(0);
                        setContentText('');
                    } else {
                        toast.error('Thêm phản hồi thất bại', {
                            autoClose: 2000,
                        });
                    }
                    console.log(result);
                } catch (error) {
                    console.log('fetchApi AddResponse.js' + error);
                }
            };
            fetchApi();
        }
    };

    useEffect(() => {
        if (openModal) {
            setOpenAddResponse(true);
        }
    }, [openModal, openAddResponse]);

    const handleChangeContentText = (e) => {
        setContentText(e.target.value);
    };

    return (
        <>
            <ToastContainer />
            <Modal
                open={openAddResponse}
                onClose={handleCloseAddResponse}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={cx('box')}>
                        <div className={cx('headerBox')}>
                            <span>Thêm mới phản hồi</span>
                            <IconButton aria-label="add" size="small" onClick={handleCloseAddResponse}>
                                <CloseIcon sx={{ color: '#637381', fontSize: '24px' }} />
                            </IconButton>
                        </div>
                        <div className={cx('rating')}>
                            <span>Đánh giá của khách hàng</span>
                            <Rating
                                name="customized-10"
                                max={10}
                                value={evaluate}
                                onChange={(event, newValue) => handleChangeEvaluate(event, newValue)}
                            />
                        </div>
                        <div className={cx('contentBox')}>
                            <div className={cx('contentTitle')}>Nội dung</div>
                            <div className={cx('contentText')}>
                                <textarea
                                    placeholder="Nhập phản hồi"
                                    value={contentText}
                                    onChange={(e) => handleChangeContentText(e)}
                                    className={cx({ errorSave: errorSave })}
                                ></textarea>
                            </div>
                        </div>
                        {errorSave && <p className={cx('warningContentEmpty')}>Phản hồi không được để trống</p>}
                        <div className={cx('footer')}>
                            <Button variant="outlined" onClick={handleCloseAddResponse}>
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={handleSaveResponse}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default AddResponse;
