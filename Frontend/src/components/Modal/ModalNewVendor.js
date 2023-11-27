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
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

import { AuthContext } from '../../contexts/AuthContex';
import * as CustomerServices from '../../services/CustomerServices';
import { createVendor } from '../../services/vendorService/createVendor';


const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 400,
    borderRadius: '6px',
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
};

const customStyles = {
    option: (provided, state) => ({
        ...provided,

        cursor: 'pointer',
    }),

    control: (provided) => ({
        ...provided,
        minHeight: '40px',
        width: '260px',
    }),
};

function ModalNewCustomer({ openModal, closeModal, onDataNewVendor }) {
    const { token } = useContext(AuthContext);
    const [openAddCustomer, setOpenAddCustomer] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    

    const handleCloseAddCustomer = () => {
        closeModal();
        setOpenAddCustomer(false);
    };

    
    const validateInput = () => {
        let messages = [];

        if (name === '') {
            messages.push('Tên nhà cung cấp không được để trống');
        }
        if (address === '') {
            messages.push('Địa chỉ không được để trống');
        }
        if (email === '') {
            messages.push('Email không được để trống');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            messages.push('Email không đúng định dạng');
        }
        if (phone === '') {
            messages.push('SĐT không được để trống');
        } else if (isNaN(phone)) {
            messages.push('SĐT không đúng định dạng');
        } else if (phone.length !== 10) {
            messages.push('SĐT không đúng định dạng');
        } 
        if(messages.length !== 0){
            messages.forEach(message => {
                toast.error(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            });
            return false;
        }
        return true;
    };

    const handleOnClickSave = () => {
        if (validateInput()) {
            const newVendor = {
                name: name,
                phone: phone,
                email: email,
                address: address,
            };

            saveVendor(newVendor);
        }
    };

    const saveVendor = async (vendor) => {
        // console.log(vendor);
        try {
            const res = await createVendor(vendor, token);
            // console.log(res);
            if (res.responseCode && res.responseCode === 200) {
                toast.success('Thêm mới Ncc thành công!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
                onDataNewVendor(vendor);
                handleCloseAddCustomer();
            } else if(res.response.data.messages){
                // console.log(res.response.data.messages);
                res.response.data.messages.forEach((message) => {
                    toast.error(message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                });
            } else {
                console.log(res.response.data.message);
                toast.error(res.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        if (openModal) {
            setOpenAddCustomer(true);
        }
    }, [openModal, openAddCustomer]);

    return (
        <>
            <ToastContainer />
            <Modal
                open={openAddCustomer}
                onClose={handleCloseAddCustomer}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={cx('box')}>
                        <div className={cx('headerBox')}>
                            <span>Thêm mới nhà cung cấp</span>
                            <IconButton aria-label="add" size="small" onClick={handleCloseAddCustomer}>
                                <CloseIcon sx={{ color: '#637381', fontSize: '24px' }} />
                            </IconButton>
                        </div>
                        <div className={cx('contentBox')}>
                            <div className={cx('wrapItemInnerContentBox')}>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Tên nhà cung cấp <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Số điện thoại <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                            <div className={cx('wrapItemInnerContentBox')}>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Email <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Địa chỉ <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('footer')}>
                            <Button variant="outlined" onClick={handleCloseAddCustomer}>
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={handleOnClickSave}>
                                Thêm
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default ModalNewCustomer;
