import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerCreateGroup.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../../../contexts/AuthContex';
import * as CustomerServices from '../../../services/CustomerServices';

const cx = classNames.bind(styles);

const customStyles = {
    option: (provided, state) => ({
        ...provided,

        cursor: 'pointer',
    }),

    control: (provided) => ({
        ...provided,
        minHeight: '40px',
        width: '370px',
    }),
};

const optionsGender = [
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' },
];

const optionsCustomerGroup = [
    { value: 'vip', label: 'VIP' },
    { value: 'wholesale', label: 'Bán buôn' },
    { value: 'retail', label: 'Bán lẻ' },
];

const tomorrow = dayjs().add(1, 'day');

function CustomerCreateGroup() {
    // const { id } = useParams();
    // const location = useLocation();
    // const { customer } = location.state || {};
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [user, setUser] = useState({
        name: '',
        address: '',
        email: '',
        numberPhone: '',
        gender: 'OTHER',
        dateOfBirth: '',
    });
    const [selectedGender, setSelectedGender] = useState(() => {
        return (
            optionsGender.find((option) => option.label === user.gender) || {
                value: 'OTHER',
                label: 'Khác',
            }
        );
    });
    const [selectedCustomerGroup, setSelectedCustomerGroup] = useState(() => {
        return (
            optionsCustomerGroup.find((option) => option.label === user.customerGroup) || {
                value: 'retail',
                label: 'Bán lẻ',
            }
        );
    });
    const [errorName, setErrorName] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);

    // const [day, setDay] = useState(new Date());

    const handleGenderChange = (selectedOption) => {
        setUser((prev) => {
            return { ...prev, gender: selectedOption.label };
        });
        setSelectedGender(selectedOption);
    };

    const handleCustomerGroupChange = (selectedOption) => {
        setUser((prev) => {
            return { ...prev, customerGroup: selectedOption.label };
        });
        setSelectedCustomerGroup(selectedOption);
    };

    const handleDateChange = (date) => {
        console.log(date);
        // setDay(date);
    };

    const handleAddCustomer = () => {
        if (user?.name?.trim() === '' && user?.numberPhone?.trim() === '') {
            toast.error('Tên khách hàng và số điện thoại không được để trống', {
                autoClose: 2000,
            });
            setErrorName(true);
            setErrorPhone(true);
        } else if (user?.name?.trim() === '') {
            toast.error('Tên khách hàng không được để trống', {
                autoClose: 2000,
            });
            setErrorName(true);
            setErrorPhone(false);
        } else if (user?.numberPhone?.trim() === '') {
            toast.error('Số điện thoại không được để trống', {
                autoClose: 2000,
            });
            setErrorName(false);
            setErrorPhone(true);
        } else if (user?.numberPhone?.length !== 10) {
            toast.error('Không đúng định dạng số điện thoại', {
                autoClose: 2000,
            });
            setErrorName(false);
            setErrorPhone(true);
        } else {
            setErrorName(false);
            setErrorPhone(false);
            const fetchApi = async () => {
                try {
                    const result = await CustomerServices.createCustomer(
                        {
                            name: user?.name,
                            address: user?.address,
                            email: user?.email,
                            phone: user?.numberPhone,
                            gender: user.gender?.value || 'OTHER',
                            dateOfBirth: user?.dateOfBirth,
                        },
                        token,
                    );
                    if (result) {
                        toast.success('Thêm mới khách hàng thành công', {
                            autoClose: 2000,
                        });
                    } else {
                        toast.error('Thêm mới khách hàng không thành công thành công', {
                            autoClose: 2000,
                        });
                    }
                } catch (error) {
                    console.log('fetchApi createCustomer CustomerCreate.js' + error);
                }
            };
            fetchApi();
        }
    };

    // useEffect(() => {
    //     console.log(user);
    //     // console.log(day);
    // });

    return (
        <div className={cx('wrap')}>
            <ToastContainer />
            <div className={cx('header')}>
                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                    Quay lại
                </Button>
                <div>
                    <Button onClick={() => navigate(-1)} variant="outlined" color="error">
                        Hủy
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleAddCustomer}>
                        Lưu
                    </Button>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>Thông tin chung</span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>
                                    Tên nhóm khách hàng <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={user.name}
                                        className={cx({ activeError: errorName })}
                                        onChange={(e) =>
                                            setUser((prev) => {
                                                return { ...prev, name: e.target.value };
                                            })
                                        }
                                        placeholder="Nhập tên khách hàng"
                                    ></input>
                                </div>
                                {/* {errorName && <p className={cx('warningContentEmpty')}>Tên khách hàng không được để trống</p>} */}
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Số điện thoại <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={user.numberPhone}
                                        className={cx({ activeError: errorPhone })}
                                        onChange={(e) =>
                                            setUser((prev) => {
                                                return { ...prev, numberPhone: e.target.value };
                                            })
                                        }
                                        placeholder="Nhập số điện thoại"
                                    ></input>
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Nhóm bán hàng</div>
                                <div style={{ width: '370px' }}>
                                    <Select
                                        value={selectedCustomerGroup}
                                        onChange={handleCustomerGroupChange}
                                        options={optionsCustomerGroup}
                                        styles={customStyles}
                                        placeholder="Chọn nhóm bán hàng"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>Email</div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) =>
                                            setUser((prev) => {
                                                return { ...prev, email: e.target.value };
                                            })
                                        }
                                        placeholder="Nhập địa chỉ email"
                                    ></input>
                                </div>
                                {/* {errorName && <p className={cx('warningContentEmpty')}>Tên khách hàng không được để trống</p>} */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('purchaseInfo')}>
                    <div className={cx('purchaseInfoHeader')}>
                        <span>Thông tin bổ sung</span>
                    </div>
                    <div className={cx('purchaseInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>Ngày sinh</div>
                                <div style={{ width: '370px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            defaultValue={dayjs().add(0, 'day')}
                                            onChange={handleDateChange}
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>Giới tính</div>
                                <div style={{ width: '370px' }}>
                                    <Select
                                        value={selectedGender}
                                        onChange={handleGenderChange}
                                        options={optionsGender}
                                        styles={customStyles}
                                        placeholder="Chọn giới tính"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>Địa chỉ</div>
                                <textarea
                                    placeholder="Nhập phản hồi"
                                    value={user.address}
                                    onChange={(e) =>
                                        setUser((prev) => {
                                            return { ...prev, address: e.target.value };
                                        })
                                    }
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('history')}></div>
        </div>
    );
}

export default CustomerCreateGroup;
