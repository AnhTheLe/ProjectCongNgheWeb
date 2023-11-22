import React from 'react';
import classNames from 'classnames/bind';
import styles from './OrderReturnDetail.module.scss';
import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContex';
import FeedIcon from '@mui/icons-material/Feed';
import numeral from 'numeral';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { DefaultIcon } from '../../components/Icons';
import { getReturnOrderInfo } from '../../services/orderServices/getReturnOrderInfo';
import moment from 'moment';
import { getReturnOrderLines } from '../../services/orderServices/getReturnOrderLines';
import PaymentsIcon from '@mui/icons-material/Payments';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PAYMENT_STATUS } from '../../utils/constant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PAYMENT_METHOD } from '../../utils/constant';
import { makePayment } from '../../services/orderServices/makePayment';

const cx = classNames.bind(styles);

const buttonStyle = {
    fontSize: '12px',
};

function OrderReturnDetail() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [returnOrderInfo, setReturnOrderInfo] = useState({
        customerName: '',
        customerId: 0,
        baseOrderId: 0,
        createdAt: null,
        swapOrderId: null,
        swapAmount: null,
        staffName: '',
        returnReason: '',
        paymentStatus: null,
    });
    const [returnOrderLines, setReturnOrderLines] = useState([]);
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);
    const [date, setDate] = useState(dayjs(Date.now()));
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/order_returns');
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleMakePayment = () => {
        makePayment(id, returnOrderInfo.swapOrderId, paymentMethod, date, token)
            .then(() => window.location.reload())
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getReturnOrderInfo(id, token);
            setReturnOrderInfo(response.data);
        };
        fetchData();
    }, [id, token]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getReturnOrderLines(id, token);
            setReturnOrderLines(response.data);
        };
        fetchData();
    }, [id, token]);

    let totalReturnQuantity = 0;
    let totalReturnValue = 0;
    const swapAmount = returnOrderInfo.swapAmount || 0;
    returnOrderLines.forEach((item) => {
        totalReturnQuantity += item.returnQuantity;
        totalReturnValue += item.returnQuantity * item.returnPrice;
    });

    return (
        <div className={cx('container')}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={cx('personalInfo1')}>
                    <div className={cx('personalInfoHeader1')}>
                        <h5>{`Xác nhận hoàn tiền cho đơn trả hàng ${id}`}</h5>
                    </div>
                    <div className={cx('payment1')}>
                        <div className={cx('amount1')}>
                            Số tiền: <span style={{ fontWeight: 600 }}>{numeral(totalReturnValue).format(0, 0)}</span>
                        </div>
                        <div className={cx('selects')}>
                            <div>
                                <div className={cx('label')}>Phương thức thanh toán</div>
                                <div className={cx('select-item')}>
                                    <Select
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        value={paymentMethod}
                                        onChange={handlePaymentMethodChange}
                                        sx={{ height: '40px', fontSize: '15px', width: '270px' }}
                                    >
                                        <MenuItem value={PAYMENT_METHOD.CASH}>Tiền mặt</MenuItem>
                                        <MenuItem value={PAYMENT_METHOD.CREDIT}>Quẹt thẻ</MenuItem>
                                        <MenuItem value={PAYMENT_METHOD.TRANSFER}>Chuyển khoản</MenuItem>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <div className={cx('label')}>Ngày thanh toán</div>
                                <div className={cx('select-item')}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            sx={{ width: '270px' }}
                                            value={date}
                                            onChange={(newValue) => setDate(newValue)}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                        <div className={cx('buttons')}>
                            <Button style={{ ...buttonStyle }} variant="outlined" onClick={handleClose}>
                                Thoát
                            </Button>
                            <Button style={{ ...buttonStyle }} variant="contained" onClick={handleMakePayment}>
                                {'Hoàn tiền'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className={cx('button-container')}>
                <Button variant="outlined" sx={buttonStyle} onClick={handleReturn}>
                    <ArrowBackIosIcon sx={{ fontSize: 13 }} />
                    Quay lại danh sách
                </Button>
            </div>
            <div className={cx('infos')}>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>
                            <FeedIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                            Thông tin phiếu
                        </span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div>
                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Khách hàng</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    <Link
                                        to={`/customer/${returnOrderInfo.customerId}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <span>{returnOrderInfo.customerName}</span>
                                    </Link>
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Mã đơn hàng gốc</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    <Link
                                        to={`/order/${returnOrderInfo.baseOrderId}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <span>SON000{returnOrderInfo.baseOrderId}</span>
                                    </Link>
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Ngày tạo phiếu trả</div>
                                <div className={cx('personalInfoValue')}>
                                    : {moment(returnOrderInfo.createdAt).format('DD/MM/YYYY HH:MM')}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Chi nhánh trả</div>
                                <div className={cx('personalInfoValue')}>: Chi nhánh mặc định</div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Mã đơn đổi hàng</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {returnOrderInfo.swapOrderId ? (
                                        <Link
                                            to={`/order/${returnOrderInfo.swapOrderId}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <span>
                                                {returnOrderInfo.swapOrderId && `SON000${returnOrderInfo.swapOrderId}`}
                                            </span>
                                        </Link>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Nhân viên tạo phiếu</div>
                                <div className={cx('personalInfoValue')}>: {returnOrderInfo.staffName}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('purchaseInfo')}>
                    <div className={cx('purchaseInfoHeader')}>
                        <span>Thông tin bổ sung</span>
                    </div>
                    <div className={cx('purchaseInfoContent')}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Lý do trả hàng</div>
                            <div>Hàng hỏng</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Ghi chú</div>
                            <div style={{ color: '#747c87' }}>Chưa có ghi chú</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('return-products')}>
                <div style={{ fontWeight: 600 }}>
                    <KeyboardReturnIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                    Sản phẩm trả
                </div>
                <div className={cx('historyContent')}>
                    <div className={cx('historyContentTitle')}>
                        <div className={cx('number', 'header')}>STT</div>
                        <div className={cx('image', 'header')}>Ảnh</div>
                        <div className={cx('sku', 'header')}>SKU</div>
                        <div className={cx('name', 'header')}>Tên sản phẩm</div>
                        <div className={cx('quantity', 'header')}>Số lượng</div>
                        <div className={cx('price', 'header')}>Đơn giá gốc</div>
                        <div className={cx('discount', 'header')}>Đơn giá trả</div>
                        <div className={cx('amount', 'header')}>Thành tiền</div>
                    </div>

                    <div className={cx('wrapItem')}>
                        {returnOrderLines.map((item, index) => (
                            <div className={cx('historyContentRow')} key={item.id}>
                                <div className={cx('number', 'row')}>{index + 1}</div>
                                <div className={cx('image', 'row')}>
                                    {item.variant.image ? (
                                        <div className={cx('alignImageProduct', 'row')}>
                                            <img alt="product" src={item.variant.image} />
                                        </div>
                                    ) : (
                                        <DefaultIcon />
                                    )}
                                </div>
                                <div className={cx('sku', 'row')}>{item.variant.sku}</div>
                                <div className={cx('name', 'row')}>{item.variant.name}</div>
                                <div className={cx('quantity', 'row')}>{item.returnQuantity}</div>
                                <div className={cx('price', 'row')}>
                                    {numeral(item.variant.retailPrice).format('0,0')}
                                </div>
                                <div className={cx('discount', 'row')}>{numeral(item.returnPrice).format('0,0')}</div>
                                <div className={cx('amount', 'row')}>{numeral(item.returnPrice).format('0,0')}</div>
                            </div>
                        ))}
                    </div>
                    <div className={cx('summary')}>
                        <div className={cx('summary-item')}>
                            <div>Số lượng sản phẩm trả</div>
                            <div>{totalReturnQuantity}</div>
                        </div>
                        <div className={cx('summary-item')}>
                            <div>Cần hoàn tiền trả hàng</div>
                            <div>{totalReturnValue}</div>
                        </div>
                        {returnOrderInfo.swapOrderId && (
                            <div className={cx('summary-item')}>
                                <div>
                                    Khách cần trả đơn đổi (
                                    <Link
                                        to={`/order/${returnOrderInfo.swapOrderId}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <span>SON000{returnOrderInfo.swapOrderId}</span>
                                    </Link>
                                    )
                                </div>
                                <div>{returnOrderInfo.swapAmount}</div>
                            </div>
                        )}

                        <div style={{ fontWeight: 600 }} className={cx('summary-item')}>
                            <div>
                                {totalReturnValue > swapAmount
                                    ? 'Tổng tiền cần hoàn trả khách'
                                    : 'Tổng tiền khách phải trả'}
                            </div>
                            <div>
                                {totalReturnValue > swapAmount
                                    ? totalReturnValue - swapAmount
                                    : swapAmount - totalReturnValue}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('payment')}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600 }}>
                        {returnOrderInfo.paymentStatus === PAYMENT_STATUS.INIT ? (
                            <PaymentsIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                        ) : (
                            <CheckCircleIcon sx={{ color: 'rgb(13, 180, 115)', marginRight: '10px' }} />
                        )}
                        {returnOrderInfo.paymentStatus === PAYMENT_STATUS.INIT ? 'Hoàn tiền' : 'Đã hoàn tiền'}
                    </div>
                    {!returnOrderInfo.swapOrderId && returnOrderInfo.paymentStatus === PAYMENT_STATUS.INIT && (
                        <Button variant="contained" sx={{ fontSize: '12px' }} onClick={handleOpen}>
                            Hoàn tiền
                        </Button>
                    )}
                </div>

                {returnOrderInfo.paymentStatus === PAYMENT_STATUS.INIT && (
                    <div style={{ padding: '0 20px' }}>
                        <div style={{ fontSize: '14px', marginTop: '13px' }}>
                            Cần trả khách:{' '}
                            <span style={{ fontWeight: 600 }}>
                                {totalReturnValue > swapAmount ? totalReturnValue - swapAmount : 0}
                            </span>
                        </div>
                        {returnOrderInfo.swapOrderId && (
                            <div style={{ fontSize: '14px' }}>
                                {totalReturnValue > swapAmount ? (
                                    <div className={cx('noti')}>
                                        <InfoOutlinedIcon sx={{ color: '#FFAE06', mr: '10px' }} />{' '}
                                        <div>
                                            Bạn vui lòng thực hiện hoàn tiền trên đơn đổi hàng{' '}
                                            <Link
                                                to={`/order/${returnOrderInfo.swapOrderId}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <span>SON000{returnOrderInfo.swapOrderId}</span>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={cx('noti')}>
                                        <InfoOutlinedIcon sx={{ color: '#FFAE06', mr: '10px' }} />{' '}
                                        <div>
                                            Đơn trả hàng có giá trị nhỏ hơn đơn đổi hàng. Bạn vui lòng thực hiện thanh
                                            toán trên đơn đổi hàng{' '}
                                            <Link
                                                to={`/order/${returnOrderInfo.swapOrderId}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <span>SON000{returnOrderInfo.swapOrderId}</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderReturnDetail;
