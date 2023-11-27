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

const optionsGender = [
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' },
];

function ModalNewCustomer({ openModal, closeModal, setNewCustomer }) {
    const { token } = useContext(AuthContext);
    const [openAddCustomer, setOpenAddCustomer] = useState(false);
    const [nameCustomer, setNameCustomer] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [selectedGender, setSelectedGender] = useState({ value: 'OTHER', label: 'Khác' });
    const [addressCustomer, setAddressCustomer] = useState('');
    const [errorName, setErrorName] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        gender: 'OTHER',
    });

    const handleCloseAddCustomer = () => {
        closeModal();
        setOpenAddCustomer(false);
    };

    const handleAddCustomer = () => {
        if (nameCustomer.trim() === '' && numberPhone.trim() === '') {
            toast.error('Tên khách hàng và số điện thoại không được để trống', {
                autoClose: 2000,
            });
        } else if (nameCustomer.trim() === '') {
            toast.error('Tên khách hàng không được để trống', {
                autoClose: 2000,
            });
        } else if (numberPhone.trim() === '') {
            toast.error('Số điện thoại không được để trống', {
                autoClose: 2000,
            });
        } else if (numberPhone.length !== 10) {
            toast.error('Không đúng định dạng số điện thoại', {
                autoClose: 2000,
            });
        } else {
            const fetchApi = async () => {
                try {
                    const result = await CustomerServices.createCustomer(
                        {
                            name: nameCustomer,
                            phone: numberPhone,
                            address: addressCustomer,
                            gender: selectedGender?.value,
                        },
                        token,
                    );
                    if (result) {
                        toast.success('Thêm mới khách hàng thành công', {
                            autoClose: 2000,
                        });
                        setNewCustomer({ nameCustomer, numberPhone, addressCustomer });
                        setNameCustomer('');
                        setNumberPhone('');
                        setSelectedGender();
                        setAddressCustomer('');
                        setFormData({});
                        handleCloseAddCustomer();
                    } else {
                        toast.error('Thêm mới khách hàng thất bại', {
                            autoClose: 2000,
                        });
                    }
                    console.log(result);
                } catch (error) {
                    console.log('fetchApi baseProductServices' + error);
                }
            };
            fetchApi();
        }
    };

    const handleGenderChange = (selectedOption) => {
        console.log(selectedOption);
        console.log(selectedGender);
        setSelectedGender(selectedOption);
    };

    useEffect(() => {
        console.log(formData);
    }, [formData]);

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
                            <span>Thêm mới khách hàng</span>
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
                                            Tên khách hàng <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={nameCustomer}
                                    onChange={(e) => setNameCustomer(e.target.value)}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Số điện thoại <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={numberPhone}
                                    onChange={(e) => setNumberPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                            <div className={cx('wrapItemInnerContentBox')}>
                                <div style={{ width: '260px', marginTop: '10px' }}>
                                    <Select
                                        value={selectedGender}
                                        onChange={handleGenderChange}
                                        options={optionsGender}
                                        styles={customStyles}
                                        placeholder="Chọn giới tính"
                                    />
                                </div>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label="Địa chỉ"
                                    variant="standard"
                                    value={addressCustomer}
                                    onChange={(e) => setAddressCustomer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('footer')}>
                            <Button variant="outlined" onClick={handleCloseAddCustomer}>
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={handleAddCustomer}>
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
