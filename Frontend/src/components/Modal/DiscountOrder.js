import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import numeral from 'numeral';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 460,
    height: 300,
    borderRadius: '6px',
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
};

function DiscountOrder({ openModal, closeModal, setValueDiscountOrder }) {
    const [openDiscountOrder, setOpenDiscountOrder] = useState(false);
    const [onButtonPercent, setOnButtonPercent] = useState(true);
    const [onButtonValue, setOnButtonValue] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (openModal) {
            setOpenDiscountOrder(true);
        }
    });

    const handleCloseDiscountOrder = () => {
        closeModal();
        setOpenDiscountOrder(false);
    };

    const handleApply = () => {
        if (onButtonPercent && parseFloat(inputValue) > 100) {
            setInputValue(100);
            setValueDiscountOrder(100, onButtonPercent);
        } else {
            setValueDiscountOrder(inputValue, onButtonPercent);
        }
        closeModal();
        handleCloseDiscountOrder();
    };

    const handleOnButtonPercent = () => {
        setOnButtonPercent(true);
        setOnButtonValue(false);
    };

    const handleOnButtonValue = () => {
        setOnButtonPercent(false);
        setOnButtonValue(true);
    };

    const handleInputChange = (v) => {
        // const value = e.target.value;

        // Loại bỏ tất cả các ký tự không phải số
        // const numericValue = value.replace(/[^0-9]/g, '');

        // Định dạng số
        // const formattedValue = numeral(numericValue).format('0,0');
        console.log(v);
        setInputValue(v);
    };

    return (
        <>
            <ToastContainer />
            <Modal
                open={openDiscountOrder}
                onClose={handleCloseDiscountOrder}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={cx('box')}>
                        <div className={cx('headerBox')}>
                            <span>Chiết khấu đơn hàng</span>
                            <IconButton aria-label="add" size="small" onClick={handleCloseDiscountOrder}>
                                <CloseIcon sx={{ color: '#637381', fontSize: '24px' }} />
                            </IconButton>
                        </div>
                        <div className={cx('contentBox')}>
                            <div className={cx('itemRow')}>
                                <div>
                                    <span className={cx('itemRowTitle')}>Chiếu khấu thường</span>
                                    <button
                                        className={cx('button', { active: onButtonPercent })}
                                        onClick={handleOnButtonPercent}
                                    >
                                        %
                                    </button>
                                    <button
                                        className={cx('button', { active: onButtonValue })}
                                        onClick={handleOnButtonValue}
                                    >
                                        Giá trị
                                    </button>
                                </div>
                                <div className={cx('wrapInput')}>
                                    <input
                                        type="text"
                                        value={numeral(inputValue).format('0,0')}
                                        onChange={(event) => handleInputChange(numeral(event.target.value).value())}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={cx('footer')}>
                            <Button variant="outlined" onClick={handleCloseDiscountOrder}>
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={handleApply}>
                                Áp dụng
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default DiscountOrder;
