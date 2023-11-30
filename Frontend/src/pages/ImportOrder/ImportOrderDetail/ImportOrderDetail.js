import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import moment from 'moment';
import numeral from 'numeral';
import classNames from 'classnames/bind';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ImportOrderDetail.module.scss';
import { AuthContext } from '../../../contexts/AuthContex';
import { VendorIcon, GreenTick, WalletIcon, BlueDotIcon, DefaultIcon } from '../../../components/Icons';
import { getImportOrderDetail } from '../../../services/importServices/getImportOrderDetail';
import { updateImportOrder } from '../../../services/importServices/updateImportOrder';
import { createPayment } from '../../../services/importServices/createPayment';

const cx = classNames.bind(styles);

const columns = [
    {
        field: 'sku',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Mã sản phẩm</span>,
        renderCell: (params) => (
            <Link to={`/admin/base-products/${params.row.baseId}/variants/${params.row.id}`}>{params.row.sku}</Link>
        ),
    },
    {
        field: 'image',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Ảnh</span>,
        renderCell: (params) => (params.row.image ? <Avatar src={params.row.image} /> : <DefaultIcon />),
    },
    {
        field: 'name',
        flex: 2.7,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Tên sản phẩm</span>,
    },
    {
        field: 'quantity',
        type: 'number',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Số lượng nhập</span>,
    },
    {
        field: 'importPrice',
        type: 'number',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Đơn giá</span>,
    },
    {
        field: 'discount',
        type: 'number',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Chiết khấu</span>,
        renderCell: (params) => params.row.discount + "%",
    },
    {
        field: 'amountPayment',
        type: 'number',
        flex: 2.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Thành tiền</span>,
        renderCell: (params) => numeral(params.row.quantity * params.row.importPrice*(1-params.row.discount/100)).format('0,0'),
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [vendor, setVendor] = useState({});
    const [variantDTOList, setVariantDTOList] = useState([]);
    const [paymentDTO, setPaymentDTO] = useState({});
    const [result, setResult] = useState({});

    const { token } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Chi tiết đơn nhập hàng';
        const fetchData = async () => {
            const res = await getImportOrderDetail(orderId, token);
            console.log(res);
            setResult(res.data);
            setPaymentDTO(res.data.paymentDTO);
            setVariantDTOList(res.data.variantDTOList);
            setVendor(res.data.vendor);
            console.log(res.data.vendor);
        };
        fetchData();
    }, [orderId, token]);

    const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [methodPay, setMethodPay] = useState('');

    if (isPaymentFormVisible) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }

    const code = 'PON' + String(result.id).padStart(5, '0');
    const formattedCreateAt = moment(result.createdAt).format('DD/MM/YYYY HH:mm');
    const formattedUpdateAt = moment(result.updatedAt).format('DD/MM/YYYY HH:mm');

    let tempTotal = paymentDTO.amount;
    let amountPaid = 0;
    if (paymentDTO.paymentStatus === 'COMPLETE') {
        amountPaid = tempTotal;
    }
    let sumQuantity = 0;

    for (let variant of variantDTOList) {
        sumQuantity += variant.quantity;
    }

    const handleChangePaymentMethod = (event) => {
        setMethodPay(event.target.value);
        if (event.target.value === 'tien-mat') {
            setPaymentMethod('CASH');
        } else if (event.target.value === 'chuyen-khoan') {
            setPaymentMethod('TRANSFER');
        } else if (event.target.value === 'the') {
            setPaymentMethod('CREDIT');
        }
    };

    const handlePaymentFormToggle = () => {
        setIsPaymentFormVisible(!isPaymentFormVisible);
    };

    let payId = paymentDTO.payId;

    const validateInput = () => {
        if (methodPay === '') {
            toast.error('Phương thức thanh toán chưa được chọn', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return false;
        }
        return true;
    };

    async function handlePayment() {
        if (validateInput()) {
            let paymentDTO = { payId, paymentMethod };

            try {
                const res = await createPayment(paymentDTO, token);
                // console.log(res);
                if (res.responseCode && res.responseCode === 200) {
                    toast.success('Xác nhận thanh toán thành công!', {
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
                        window.location.reload();
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
        }
    }

    async function updateStatusShipment() {
        try {
            const res = await updateImportOrder(result, token);
            // console.log(res);

            if (res.responseCode && res.responseCode === 200) {
                toast.success('Nhập hàng thành công!', {
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
                    window.location.reload();
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
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('header')}>
                <Button onClick={() => navigate('/import_order')} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                    Quay lại
                </Button>
                <div>
                    {result.shipmentStatus !== 'ARRIVED' && (
                        <Button variant="contained" onClick={updateStatusShipment}>
                            Nhập hàng
                        </Button>
                    )}
                </div>
            </div>
            <ToastContainer />
            <div className={cx('row')}>
                <h4>{code}</h4>
                <p>{formattedUpdateAt}</p>
                <div className={cx('row-status')}>
                    {paymentDTO.paymentStatus === 'COMPLETE' && (
                        <span className={cx('complete-status')}>{'Hoàn thành'}</span>
                    )}
                    {paymentDTO.paymentStatus === 'INIT' && result.shipmentStatus === 'ARRIVED' && (
                        <span className={cx('init-pay')}>{'Đang giao dịch'}</span>
                    )}
                    {result.shipmentStatus === 'INIT' && <span className={cx('init-ship')}>{'Chưa nhập'}</span>}
                </div>
            </div>

            <div className={cx('row1')}>
                <div className={cx('row-vendor1')}>
                    <div className={cx('column-container')}>
                        <h6>
                            <VendorIcon />
                            Thông tin nhà cung cấp
                        </h6>
                        <div>
                            <span className={cx('name_title')}>
                                <Link to={`/vendor_detail/${vendor.id}`}>{vendor.name}</Link>
                            </span>
                        </div>
                        <div>
                            <span className={cx('title1')}>Địa chỉ</span>
                            <span className={cx('content_vendor')}>: {vendor.address}</span>
                        </div>
                        <div>
                            <span className={cx('title1')}>Email</span>
                            <span className={cx('content_vendor')}>: {vendor.email}</span>
                        </div>
                        <div>
                            <span className={cx('title1')}>SĐT</span>
                            <span className={cx('content_vendor')}>: {vendor.phone}</span>
                        </div>
                    </div>
                    <div className={cx('column1-container')}>
                        <div className={cx('content')}>
                            <div style={{ padding: '15px' }}>
                                <div>
                                    <span className={cx('title1')}>Tổng số đơn nhập</span>
                                    <span className={cx('title3')} style={{ color: '#0088ff', fontWeight: '600' }}>
                                        {numeral(vendor.numberImportOrder).format('0,0')}
                                    </span>
                                </div>
                                <div>
                                    <span className={cx('title1')}>Tổng giá trị nhập</span>
                                    <span className={cx('title3')}>
                                        {numeral(vendor.totalImportOrder).format('0,0')}
                                    </span>
                                </div>
                                <div>
                                    <span className={cx('title1')}>Tổng công nợ</span>
                                    <span className={cx('title3')} style={{ color: 'red' }}>
                                        {numeral(vendor.debt).format('0,0')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('row-vendor2')}>
                    <div className={cx('column2-container')}>
                        <h6>Thông tin đơn nhập hàng {result.shipmentStatus === 'ARRIVED' && <GreenTick />}</h6>
                        <div>
                            <span className={cx('title2')}>Nhân viên phụ trách</span>
                            <span>: {result.staffName}</span>
                        </div>
                        <div>
                            <span className={cx('title2')}>Ngày tạo</span>
                            <span>: {formattedCreateAt}</span>
                        </div>
                        <div>
                            <span className={cx('title2')}>Ngày nhập</span>
                            {result.shipmentStatus === 'ARRIVED' ? <span>: {formattedUpdateAt}</span> : <span>: </span>}
                        </div>
                        <div>
                            <span className={cx('title2')}>Trạng thái nhập</span>
                            {result.shipmentStatus === 'ARRIVED' ? (
                                <span style={{ color: ' rgb(3, 126, 233)' }}>: Đã nhập</span>
                            ) : (
                                <span>: Chưa nhập</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {result.shipmentStatus === 'ARRIVED' && (
                <div className={cx('payment')}>
                    <div className={cx('payment-row')}>
                        <div className={cx('payment-title')}>
                            {paymentDTO.paymentStatus === 'COMPLETE' ? (
                                <h6>
                                    <GreenTick /> Đơn nhập hàng thanh toán toàn bộ
                                </h6>
                            ) : (
                                <h6>
                                    <WalletIcon /> Đơn nhập hàng chưa thanh toán
                                </h6>
                            )}
                        </div>
                        {paymentDTO.paymentStatus !== 'COMPLETE' && (
                            <div className={cx('pay-btn')} onClick={handlePaymentFormToggle}>
                                <button className={cx('btn')}>
                                    <span className={cx('btn-title')}>THANH TOÁN</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={cx('pay-column')}>
                        <div className={cx('pay-bg')}>
                            <div style={{ width: '70%' }}>
                                <span className={cx('title')}>Tiền cần trả NCC</span>
                                <span>: {numeral(tempTotal).format('0,0')}</span>
                            </div>
                            <div style={{ width: '60%' }}>
                                <span className={cx('title')}>Đã trả</span>
                                <span>: {numeral(amountPaid).format('0,0')}</span>
                            </div>
                            <div>
                                <span className={cx('title')}>Còn phải trả</span>
                                <span style={{ color: 'red', fontWeight: 'boild' }}>
                                    : {numeral(tempTotal - amountPaid).format('0,0')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {paymentDTO.paymentStatus === 'COMPLETE' && (
                        <div style={{ display: 'flex' }}>
                            <BlueDotIcon />
                            {paymentDTO.paymentMethod === 'CASH' && (
                                <p style={{ paddingLeft: '20px', fontWeight: 'bold' }}>Tiền mặt</p>
                            )}
                            {paymentDTO.paymentMethod === 'CREDIT' && (
                                <p style={{ paddingLeft: '20px', fontWeight: 'bold' }}>Thẻ thanh toán</p>
                            )}
                            {paymentDTO.paymentMethod === 'TRANSFER' && (
                                <p style={{ paddingLeft: '20px', fontWeight: 'bold' }}>Chuyển khoản</p>
                            )}
                            <p style={{ paddingLeft: '20px' }}>{numeral(paymentDTO.amount).format('0,0')}</p>
                            <p style={{ paddingLeft: '20px' }}>
                                {moment(paymentDTO.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>
                    )}
                </div>
            )}
      
                <Modal
                open={isPaymentFormVisible}
                onClose={handlePaymentFormToggle}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                    <div className={cx('personalInfo1')}>
                        <div className={cx('personalInfoHeader1')}>
                            <h5>Xác nhận thanh toán</h5>
                        </div>
                        <div className={cx('payment1')}>
                            <div className={cx('amount1')}>
                                Số tiền: <span style={{ fontWeight: 600 }}>{numeral(tempTotal).format('0,0')}</span>
                            </div>
                            <div className={cx('selects')}>
                                <div>
                                    <div className={cx('label')}>Phương thức thanh toán</div>
                                    <div className={cx('select-item')}>
                                        <Select
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            value={methodPay}
                                            onChange={handleChangePaymentMethod}
                                            sx={{ height: '40px', fontSize: '15px', width: '270px' }}
                                            required
                                        >
                                            <MenuItem value={'tien-mat'}>Tiền mặt</MenuItem>
                                            <MenuItem value={'the'}>Quẹt thẻ</MenuItem>
                                            <MenuItem value={'chuyen-khoan'}>Chuyển khoản</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('buttons')}>
                               
                                <Button
                                    style={{ fontSize: '12px' }}
                                    variant="contained"
                                    onClick={handlePayment}
                                >
                                    {'Thanh toán'}
                                </Button> 
                                <Button style={{ fontSize: '12px' }} variant="outlined" onClick={handlePaymentFormToggle}>
                                    Thoát
                                </Button>
                            </div>
                        </div>
                    </div>
                    </Modal>
                
        

            <div className={cx('table')}>
                <div style={{ width: '100%' }}>
                    <DataGrid
                        rows={variantDTOList}
                        columns={columns}
                        pageSize={6}
                        className={cx('dataGrid')}
                        pageSizeOptions={[20, 50, 100]}
                    />
                </div>
                <div style={{ fontSize: '18px', padding: '20px 25px 20px 0px', width: '30%', float: 'right' }}>
                    <div>
                        <span style={{ fontWeight: '500' }}>Số lượng</span>
                        <span>: {numeral(sumQuantity).format(0, 0)}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: '500', paddingTop: '10px' }}>Tổng tiền</span>
                        <span>: {numeral(tempTotal).format(0, 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
