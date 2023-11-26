import classNames from 'classnames/bind';
import styles from './CreateVendor.module.scss';
import Button from '@mui/material/Button';
import { useContext, useState } from 'react';
import { createVendor } from '../../../services/vendorService/createVendor';
import { useNavigate, Link } from 'react-router-dom';
import routes from '../../../config/routes';
import { AuthContext } from '../../../contexts/AuthContex';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LightTooltip } from '../../../components/LightTooltip/LightTooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const cx = classNames.bind(styles);

function CreateVendor() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [fax, setFax] = useState('');
    const [tax, setTax] = useState('');
    const [website, setWebiste] = useState('');

    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

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
        if (fax !== '' && !/^[+]?[0-9.-]+$/.test(fax)) {
            messages.push('Số fax không đúng định dạng');
        } 
        if (tax !== '' && (isNaN(tax) || (tax.length !== 10 && tax.length !== 13))) {
            messages.push('Mã số thuế không đúng định dạng');
        } 
        if (
            website !== '' &&
            !/^((https?|ftp):\/\/)?(www\.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(website)
        ) {
            messages.push('Website không đúng định dạng');
        }
        if (messages.length !== 0) {
            messages.forEach((message) => {
                toast.error(message, {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
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
                fax: fax,
                tax: tax,
                website: website,
                description: description
            };

            saveVendor(newVendor);
        }
    };

    const saveVendor = async (vendor) => {
        console.log(vendor);
        try {
            const res = await createVendor(vendor, token);
            // console.log(res);
            if (res.responseCode && res.responseCode === 200) {
                toast.success('Thêm mới Ncc thành công!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });

                setTimeout(() => {
                    navigate(routes.vendor_list);
                }, 1000);
            } else if (res.response.data.messages) {
                // console.log(res.response.data.messages);
                res.response.data.messages.forEach((message) => {
                    toast.error(message, {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                });
            } else {
                // console.log(res.response.data.message);
                toast.error(res.response.data.message, {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
            }
        } catch (error) {
            return error;
        }
    };

    const hanldleOnClickExit = () => {
        navigate(routes.vendor_list);
    };

    return (
        <>
            <div className={cx('wrap', 'container')}>
                <div className={cx('header')}>
                    <Button variant="outlined" onClick={hanldleOnClickExit}>
                        Thoát
                    </Button>
                    <Button variant="contained" onClick={handleOnClickSave}>
                        Lưu
                    </Button>
                </div>
                <ToastContainer />
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>Thông tin chung</span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>
                                    Tên nhà cung cấp <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nhập tên nhà cung cấp"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Số điện thoại <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                    ></input>
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Email <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập Email"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('oneColumnPerRow')}>
                                <div className={cx('personalInfoTitle')}>
                                    Địa chỉ <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ nhà cung cấp"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>Thông tin bổ sung</span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Mã số thuế
                                    <LightTooltip
                                        title={
                                            <div>
                                                <span>
                                                    Mã số thuế doanh nghiệp<strong> bao gồm</strong> 10 hoặc 13 chữ số
                                                </span>
                                                <br></br>
                                                <span>
                                                    <Link to="https://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp">
                                                        Tìm hiểu thêm
                                                    </Link>
                                                </span>
                                            </div>
                                        }
                                        placement="top"
                                    >
                                        <ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} />
                                    </LightTooltip>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={tax}
                                        type="text"
                                        onChange={(e) => setTax(e.target.value)}
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Website
                                    <LightTooltip
                                        title={
                                            <div>
                                                <span>
                                                    URL <strong> bắt đầu</strong> http://, https://, ...{' '}
                                                    <strong>theo sau</strong> là tên miền hợp lệ
                                                </span>
                                                <br></br>
                                                <span>
                                                    <strong>Ví dụ: </strong> http://www.example.com
                                                </span>
                                                <br></br>
                                                <span>
                                                    <Link to="https://en.wikipedia.org/wiki/URL">Tìm hiểu thêm</Link>
                                                </span>
                                            </div>
                                        }
                                        placement="top"
                                    >
                                        <ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} />
                                    </LightTooltip>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={website}
                                        type="text"
                                        onChange={(e) => setWebiste(e.target.value)}
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>
                                    Số fax
                                    <LightTooltip
                                        title={
                                            <div>
                                                <span>
                                                    Số fax<strong> thường bao gồm</strong> các chữ số và các dấu +, -,
                                                    ., ...
                                                </span>
                                            </div>
                                        }
                                        placement="top"
                                    >
                                        <ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} />
                                    </LightTooltip>
                                </div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={fax}
                                        type="text"
                                        onChange={(e) => setFax(e.target.value)}
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Mô tả</div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={description}
                                        type="text"
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateVendor;
