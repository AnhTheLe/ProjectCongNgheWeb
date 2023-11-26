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

function EditResponse({ openModal, closeModal, contentResponse }) {
    const { token } = useContext(AuthContext);
    const [openEditResponse, setOpenEditResponse] = useState(false);
    const [contentText, setContentText] = useState('');
    const [errorSave, setErrorSave] = useState(false);
    const [evaluate, setEvaluate] = useState(0);
    console.log('contentResponse', contentResponse.evaluate)

    const handleCloseEditResponse = () => {
        setErrorSave(false);
        closeModal();
        setOpenEditResponse(false);
    };

    const handleChangeEvaluate = (event, newValue) => {
        setEvaluate(newValue);
    };

    useEffect(() => {
        setEvaluate(contentResponse.evaluate);
        setContentText(contentResponse.content);
    }, [contentResponse.content, contentResponse.evaluate]);

    useEffect(() => {
        if (openModal) {
            setOpenEditResponse(true);
        }
    });

    const handleSaveResponse = () => {
        if (contentText.trim() === '') {
            toast.error('Phản hồi không được để trống');
            setErrorSave(true);
        } else {
            setErrorSave(false);
            const fetchApi = async () => {
                try {
                    const result = await CustomerServices.updateFeedback(
                        contentResponse.id,
                        {
                            evaluate: evaluate,
                            content: contentText,
                        },
                        token,
                    );
                    if (result) {
                        toast.success('Cập nhật phản hồi thành công');
                        handleCloseEditResponse();
                    } else {
                        toast.error('Xóa phản hồi thất bại', {
                            autoClose: 2000,
                        });
                    }
                    console.log(result);
                } catch (error) {
                    console.log('fetchApi EditResponse.js' + error);
                }
            };
            fetchApi();
        }
    };

    const handleDeleteResponse = (code, index) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?');
        if (confirm) {
            const fetchApi = async () => {
                try {
                    const result = await CustomerServices.deleteFeedback(contentResponse.id, token);
                    if (result) {
                        toast.success('Xóa phản hồi thành công', {
                            autoClose: 2000,
                        });
                        handleCloseEditResponse();
                    } else {
                        toast.error('Xóa phản hồi thất bại', {
                            autoClose: 2000,
                        });
                    }
                    console.log(result);
                } catch (error) {
                    console.log('fetchApi EditResponse.js' + error);
                }
            };
            fetchApi();
        }
    };

    const handleChangeContentText = (e) => {
        setContentText(e.target.value);
    };

    return (
        <>
            <ToastContainer />
            <Modal
                open={openEditResponse}
                onClose={handleCloseEditResponse}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={cx('box')}>
                        <div className={cx('headerBox')}>
                            <span>Sửa phản hồi</span>
                            <IconButton aria-label="add" size="small" onClick={handleCloseEditResponse}>
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
                            <Button variant="outlined" color="error" onClick={handleDeleteResponse}>
                                Xóa
                            </Button>
                            <Button variant="outlined" onClick={handleCloseEditResponse}>
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

export default EditResponse;
