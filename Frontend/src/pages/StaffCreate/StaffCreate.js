import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './StaffCreate.module.scss';
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
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Autocomplete from '@mui/material/Autocomplete';

import { AuthContext } from '../../contexts/AuthContex';
import { createStaff } from '../../services/staffService/createStaff';

const cx = classNames.bind(styles);

const customStyles = {
    option: (provided, state) => ({
        ...provided,

        cursor: 'pointer',
    }),

    control: (provided) => ({
        ...provided,
        minHeight: '40px',
        width: '100%%',
    }),
};

const optionsGender = [
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' },
];

function CustomerUpdate() {
    // const { id } = useParams();
    // const location = useLocation();
    // const { customer } = location.state || {};
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [user, setUser] = useState({
        fullName: '',
        address: '',
        password: '',
        phone: '',
        gender: 'OTHER',
        dob: dayjs(Date.now()),
        roleNames: [],
    });
    const [roleNames, setRoleNames] = useState([]);
    const [selectedGender, setSelectedGender] = useState(() => {
        return (
            optionsGender.find((option) => option.label === user.gender) || {
                value: 'OTHER',
                label: 'Khác',
            }
        );
    });

    const [errorName, setErrorName] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);
    const listRole = [
        { title: 'Nhân viên bán hàng', value: 'SALE' },
        { title: 'Nhân viên CSKH', value: 'CARE' },
        { title: 'Nhân viên QL Kho', value: 'WAREHOUSE' },
    ];

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setConfirmShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    // const [day, setDay] = useState(new Date());

    const handleGenderChange = (selectedOption) => {
        setUser((prev) => {
            return { ...prev, gender: selectedOption.value };
        });
        setSelectedGender(selectedOption);
    };

    const handleAddCustomer = () => {
        if (user?.fullName?.trim() === '' && user?.phone?.trim() === '') {
            toast.error('Tên nhân viên và số điện thoại không được để trống', {
                autoClose: 2000,
            });
            setErrorName(true);
            setErrorPhone(true);
        } else if (user?.fullName?.trim() === '') {
            toast.error('Tên nhân viên không được để trống', {
                autoClose: 2000,
            });
            setErrorName(true);
            setErrorPhone(false);
        } else if (user?.phone?.trim() === '') {
            toast.error('Số điện thoại không được để trống', {
                autoClose: 2000,
            });
            setErrorName(false);
            setErrorPhone(true);
        } else if (user?.phone?.length !== 10) {
            toast.error('Không đúng định dạng số điện thoại', {
                autoClose: 2000,
            });
            setErrorName(false);
            setErrorPhone(true);
        } else {
            setErrorName(false);
            setErrorPhone(false);
            user.roleNames = roleNames.map((item) => item.value);
            console.log(user);
            createStaff(user, token)
                .then(() => navigate('/admin/staffs'))
                .catch((err) => toast.err('Đã có lỗi xảy ra'));
        }
    };

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
                        <span>Thông tin nhân viên</span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>
                                    Họ và tên nhân viên <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={user.fullName}
                                        className={cx({ activeError: errorName })}
                                        onChange={(e) =>
                                            setUser((prev) => {
                                                return { ...prev, fullName: e.target.value };
                                            })
                                        }
                                        placeholder="Nhập tên nhân viên"
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
                                        value={user.phone}
                                        className={cx({ activeError: errorPhone })}
                                        onChange={(e) =>
                                            setUser((prev) => {
                                                return { ...prev, phone: e.target.value };
                                            })
                                        }
                                        placeholder="Nhập số điện thoại"
                                    ></input>
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Email</div>
                                <div className={cx('personalInfoValue')}>
                                    <input type="email" placeholder="Nhập địa chỉ email"></input>
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Mật khẩu đăng nhập cửa hàng
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('inputPassword')}>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={user.password}
                                        onChange={(e) =>
                                            setUser((prev) => {
                                                return { ...prev, password: e.target.value };
                                            })
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Nhập lại mật khẩu
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('inputPassword')}>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownConfirmPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>
                                    <strong>Vai trò nhân viên</strong> <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('roleStaff')}>
                                    <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={listRole.filter(
                                            (role) => !roleNames.some((elem) => elem.value === role.value),
                                        )}
                                        getOptionLabel={(option) => option.title}
                                        filterSelectedOptions
                                        renderInput={(params) => <TextField {...params} placeholder="Vai trò" />}
                                        value={roleNames}
                                        onChange={(event, newValue) => {
                                            setRoleNames(newValue);
                                        }}
                                    />
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
                                <div style={{ width: '95.8%' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            format="DD/MM/YYYY"
                                            value={user.dob}
                                            onChange={(newValue) =>
                                                setUser((prev) => {
                                                    return { ...prev, dob: newValue };
                                                })
                                            }
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>Giới tính</div>
                                <div style={{ width: '95.8%' }}>
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
                                    placeholder="Nhập địa chỉ"
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

export default CustomerUpdate;
