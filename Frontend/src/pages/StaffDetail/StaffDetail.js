import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './StaffDetail.module.scss';
import { useContext, useEffect, useMemo, useState } from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import { AuthContext } from '../../contexts/AuthContex';
import { getStaffDetail } from '../../services/staffService/getStaffDetail';
import { WORKSTATUS_MAPPER, WORKS_STATUS } from '../../utils/constant';
import Chip from '@mui/material/Chip';
import { deleteStaff } from '../../services/staffService/deleteStaff';
import { updateStaff } from '../../services/staffService/updateStaff';
import Modal from '@mui/material/Modal';
import { updatePassword } from '../../services/staffService/updatePassword';

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

const chipStyles = {
    QUIT: {
        backgroundColor: 'rgb(255, 246, 246)',
        border: '1px solid rgb(255, 184, 184)',
        color: 'rgb(238, 71, 71)',
    },

    WORKING: {
        backgroundColor: 'rgb(243, 252, 249)',
        border: '1px solid rgb(159, 237, 207)',
        color: 'rgb(13, 180, 115)',
    },
};

const buttonStyle = {
    fontSize: '12px',
    fontWeight: 600,
};

function StaffDetail() {
    const { id } = useParams();
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
        workStatus: WORKS_STATUS.WORKING,
        roles: [],
    });
    const [userUpdate, setUserUpdate] = useState({
        id: null,
        fullName: '',
        address: '',
        phone: '',
        gender: 'OTHER',
        dob: dayjs(Date.now()),
        roleNames: [],
    });
    const [roleNames, setRoleNames] = useState([]);
    const [selectedGender, setSelectedGender] = useState(() => {
        return (
            optionsGender.find((option) => option.label === userUpdate.gender) || {
                value: 'OTHER',
                label: 'Khác',
            }
        );
    });
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [errorName, setErrorName] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const listRole = [
        { title: 'Nhân viên bán hàng', value: 'SALE' },
        { title: 'Nhân viên CSKH', value: 'CARE' },
        { title: 'Nhân viên QL Kho', value: 'WAREHOUSE' },
    ];
    const titleMapper = useMemo(
        () => ({ SALE: 'Nhân viên bán hàng', CARE: 'Nhân viên CSKH', WAREHOUSE: 'Nhân viên QL Kho' }),
        [],
    );

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
        setUserUpdate((prev) => {
            return { ...prev, gender: selectedOption.value };
        });
        setSelectedGender(selectedOption);
    };

    const handleDeleteStaff = () => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?');
        if (confirm) {
            deleteStaff(id, token)
                .then(() => {
                    alert('Xóa nhân viên thành công');
                    navigate('/admin/staffs');
                })
                .catch((err) => console.log(err));
        }
    };

    const handleUpdateStaff = () => {
        if (userUpdate?.fullName?.trim() === '' && userUpdate?.phone?.trim() === '') {
            toast.error('Tên nhân viên và số điện thoại không được để trống', {
                autoClose: 2000,
            });
            setErrorName(true);
            setErrorPhone(true);
        } else if (userUpdate?.fullName?.trim() === '') {
            toast.error('Tên nhân viên không được để trống', {
                autoClose: 2000,
            });
            setErrorName(true);
            setErrorPhone(false);
        } else if (userUpdate?.phone?.trim() === '') {
            toast.error('Số điện thoại không được để trống', {
                autoClose: 2000,
            });
            setErrorName(false);
            setErrorPhone(true);
        } else if (userUpdate?.phone?.length !== 10) {
            toast.error('Không đúng định dạng số điện thoại', {
                autoClose: 2000,
            });
            setErrorName(false);
            setErrorPhone(true);
        } else {
            setErrorName(false);
            setErrorPhone(false);
            userUpdate.roleNames = roleNames.map((item) => item.value);
            updateStaff(id, userUpdate, token)
                .then(() => navigate('/admin/staffs'))
                .catch((err) => toast.error('Đã có lỗi xảy ra'));
        }
    };

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không trùng với mật khẩu mới');
            return;
        }

        updatePassword(id, { password: newPassword }, token)
            .then(() => {
                toast.success('Cập nhật mật khẩu mới thành công');
                setOpen(false);
            })
            .catch((err) => toast.error('Đã có lỗi xảy ra'));
    };

    useEffect(() => {
        getStaffDetail(id, token)
            .then((res) => {
                setUser(res.data);
                setUserUpdate({
                    ...res.data,
                    roleNames: res.data.roles.map((role) => role.name),
                    dob: dayjs(new Date(res.data.dob)),
                });
                console.log(res.data.roles.map((role) => ({ title: titleMapper[role.name], value: role.name })));
                setRoleNames(res.data.roles.map((role) => ({ title: titleMapper[role.name], value: role.name })));
            })
            .catch((err) => toast.error('Đã có lỗi xảy ra'));
    }, [token, id, titleMapper]);

    return (
        <div className={cx('wrap')}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={cx('personalInfo1')}>
                    <div className={cx('personalInfoHeader')}>
                        <h5>Thay đổi mật khẩu của nhân viên {user.fullName}</h5>
                    </div>
                    <div className={cx('payment')}>
                        <div className={cx('selects')}>
                            <div>
                                <div className={cx('label')}>Mật khẩu mới</div>
                                <div className={cx('select-item')}>
                                    <div className={cx('inputPassword')}>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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
                            </div>
                            <div>
                                <div className={cx('label')}>Nhập lại mật khẩu mới</div>
                                <div className={cx('select-item')}>
                                    <div className={cx('inputPassword')}>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        </div>
                        <div className={cx('buttons')}>
                            <Button style={{ ...buttonStyle }} variant="outlined" onClick={handleClose}>
                                Thoát
                            </Button>
                            <Button style={{ ...buttonStyle }} variant="contained" onClick={handleUpdatePassword}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ToastContainer />
            <div className={cx('header')}>
                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                    Quay lại
                </Button>
                <div>
                    {user.workStatus === WORKS_STATUS.WORKING && (
                        <Button onClick={handleDeleteStaff} variant="outlined" color="error">
                            Xóa
                        </Button>
                    )}
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleUpdateStaff}>
                        Lưu
                    </Button>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '20px',
                    marginTop: '15px',
                    marginBottom: '12px',
                }}
            >
                <h5>{user.fullName}</h5>
                <Chip
                    label={WORKSTATUS_MAPPER[user.workStatus]}
                    variant="outlined"
                    sx={{ ...chipStyles[user.workStatus], fontWeight: 400 }}
                />
            </div>
            <div className={cx('content')}>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>Thông tin nhân viên</span>
                        <span style={{ fontWeight: 600, color: '#0088ff', cursor: 'pointer' }} onClick={handleOpen}>
                            Đổi mật khẩu
                        </span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>
                                    Họ và tên nhân viên <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={userUpdate.fullName}
                                        className={cx({ activeError: errorName })}
                                        onChange={(e) =>
                                            setUserUpdate((prev) => {
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
                                        value={userUpdate.phone}
                                        className={cx({ activeError: errorPhone })}
                                        onChange={(e) =>
                                            setUserUpdate((prev) => {
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
                                            value={userUpdate.dob}
                                            onChange={(newValue) =>
                                                setUserUpdate((prev) => {
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
                                    value={userUpdate.address}
                                    onChange={(e) =>
                                        setUserUpdate((prev) => {
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

export default StaffDetail;
