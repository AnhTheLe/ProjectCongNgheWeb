import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './UpdateVendor.module.scss';
import { AuthContext } from '../../../contexts/AuthContex';
import { LightTooltip } from '../../../components/LightTooltip/LightTooltip';
import { createVendor } from '../../../services/vendorService/createVendor';
import { getVendorDetail } from '../../../services/vendorService/getVendorDetail';

const cx = classNames.bind(styles);

function CreateVendor() {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [result, setResult] = useState({
        createdAt: '',
        updatedAt: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        fax: '',
        tax: '',
        website: '',
        description: '',
        numberImportOrder: '',
        totalImportOrder: '',
        debt: '',
        status: '',
    });

    useEffect(() => {
        document.title = 'Cập nhật nhà cung cấp';
        const fetchData = async () => {
            const res = await getVendorDetail(vendorId, token);
            console.log(res);
            setResult(res.data);
        };
        fetchData();
    }, [token, vendorId]);

    const handleOnChangeVendor = (key, value) => {
        const newVendor = { ...result, [key]: value };
        setResult(newVendor);
    };

    const validateInput = () => {
        let messages = [];
        console.log(result);
        if (result.name === '') {
            messages.push('Tên nhà cung cấp không được để trống');
        }
        if (result.address === '') {
            messages.push('Địa chỉ không được để trống');
        }
        if (result.email === '') {
            messages.push('Email không được để trống');
        } else if (!/\S+@\S+\.\S+/.test(result.email)) {
            messages.push('Email không đúng định dạng');
        }
        if (result.phone === '') {
            messages.push('SĐT không được để trống');
        } else if (isNaN(result.phone)) {
            messages.push('SĐT không đúng định dạng');
        } else if (result.phone.length !== 10) {
            messages.push('SĐT không đúng định dạng');
        } 
        if (result.fax !=='' && result.fax !== null && !/^[+]?[0-9.-]+$/.test(result.fax)) {
            console.log(result.fax);
            messages.push('Số fax không đúng định dạng');
        } 
        if ( result.tax !== '' && result.tax !== null && (isNaN(result.tax) || (result.tax.length !== 10 && result.tax.length !== 13))) {
            messages.push('Mã số thuế không đúng định dạng');
        } 
        if (
            result.website !== '' && result.website !== null && 
            !/^((https?|ftp):\/\/)?(www\.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(result.website)
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
            updateVendor(result);
        }
    };

    const updateVendor = async (vendor) => {
        try {
            const res = await createVendor(vendor, token);
            // console.log(res);
            if (res.responseCode && res.responseCode === 200) {
                toast.success('Cập nhật Ncc thành công!', {
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
                    navigate(`/vendor_detail/${vendorId}`);
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

    return (
        <>
            <div className={cx('wrap', 'container')}>
                <div className={cx('header')}>
                    <Button
                        onClick={() => navigate(`/vendor_detail/${vendorId}`)}
                        variant="outlined"
                        startIcon={<ArrowBackIosIcon />}
                    >
                        Quay lại
                    </Button>
                    <div>
                        <Button variant="contained" onClick={handleOnClickSave}>
                            Cập nhật
                        </Button>
                    </div>
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
                                        value={result.name}
                                        onChange={(e) => handleOnChangeVendor('name', e.target.value)}
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
                                        value={result.phone}
                                        onChange={(e) => handleOnChangeVendor('phone', e.target.value)}
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
                                        value={result.email}
                                        onChange={(e) => handleOnChangeVendor('email', e.target.value)}
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
                                        value={result.address}
                                        onChange={(e) => handleOnChangeVendor('address', e.target.value)}
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
                                        value={result.tax}
                                        type="text"
                                        onChange={(e) => handleOnChangeVendor('tax', e.target.value)}
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
                                        value={result.website}
                                        type="text"
                                        onChange={(e) => handleOnChangeVendor('website', e.target.value)}
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Số fax
                                <LightTooltip
                                        title={
                                            <div>
                                                <span>
                                                    Số fax<strong> thường bao gồm</strong> các chữ số và các dấu +, -, ., ...
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
                                        value={result.fax}
                                        type="text"
                                        onChange={(e) => handleOnChangeVendor('fax', e.target.value)}
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Mô tả</div>
                                <div className={cx('personalInfoValue')}>
                                    <input
                                        value={result.description}
                                        type="text"
                                        onChange={(e) => handleOnChangeVendor('description', e.target.value)}
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
