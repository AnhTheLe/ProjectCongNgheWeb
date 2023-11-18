import React, { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Order.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import numeral from 'numeral';
import { DefaultIcon } from '../../components/Icons';
import { getOrderDetailInfo } from '../../services/orderServices/getOrderDetailInfo';
import { AuthContext } from '../../contexts/AuthContex';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../utils/constant';
import moment from 'moment';
import { getOrderLines } from '../../services/orderServices/getOrderLines';
import { getReturnHistories } from '../../services/orderServices/getReturnHistories';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { makePayment } from '../../services/orderServices/makePayment';

const cx = classNames.bind(styles);

const buttonStyle = {
    fontSize: '12px',
    fontWeight: 600,
};

const linkStyle = {
    textDecoration: 'none',
};

const chipStyles = {
    INIT: {
        backgroundColor: 'rgb(255, 247, 231)',
        border: '1px solid rgb(255, 223, 155)',
        color: 'rgb(228, 156, 6)',
    },

    COMPLETE: {
        backgroundColor: 'rgb(243, 252, 249)',
        border: '1px solid rgb(159, 237, 207)',
        color: 'rgb(13, 180, 115)',
    },
};

function Order() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [date, setDate] = useState(dayjs(Date.now()));
    const [buttonHistoryPurchase, setButtonHistoryPurchase] = useState(true);
    const [buttonHistoryResponse, setButtonHistoryResponse] = useState(false);
    const [orderInfo, setOrderInfo] = useState({
        id: 0,
        customerName: '',
        phone: '',
        customerId: 0,
        createdAt: null,
        staffName: '',
        paymentStatus: PAYMENT_STATUS.INIT,
        buyValue: 0,
        returnOrderId: null,
        returnAmount: null,
        discount: 0,
    });
    const [orderLines, setOrderLines] = useState([]);
    const [returnHistories, setReturnHistories] = useState([]);
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleHistoryPurchase = () => {
        setButtonHistoryPurchase(true);
        setButtonHistoryResponse(false);
    };

    const handleHistoryResponse = () => {
        setButtonHistoryPurchase(false);
        setButtonHistoryResponse(true);
    };

    const handleReturn = () => {
        navigate('/orders');
    };

    const handleCreateReturn = () => {
        navigate(`/order_returns/create?order_id=${id}`);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleMakePayment = () => {
        makePayment(orderInfo.returnOrderId, id, paymentMethod, date, token)
            .then(() => window.location.reload())
            .catch((err) => console.log(err));
    };

    let buyValue = 0;
    orderLines.forEach((item) => {
        buyValue += item.price * item.quantity;
        //discount += item.discount * item.quantity;
    });

    const amount = buyValue - orderInfo.discount;
    const returnAmount = orderInfo.returnAmount || 0;

    const isReturnable = orderLines.some((orderline) => orderline.quantity > orderline.returnQuantity);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderDetailInfo(id, token);
            setOrderInfo(response.data);
        };
        fetchData();
    }, [id, token]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderLines(id, token);
            setOrderLines(response.data);
        };
        fetchData();
    }, [id, token]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getReturnHistories(id, token);
            setReturnHistories(response.data);
        };
        fetchData();
    }, [id, token]);

    return (
        <div className={cx('order-detail-container')}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <h5>
                            {returnAmount > amount
                                ? `Xác nhận hoàn tiền cho đơn trả hàng SRN000${orderInfo.returnOrderId}`
                                : 'Xác nhận thanh toán'}
                        </h5>
                    </div>
                    <div className={cx('payment')}>
                        <div className={cx('amount')}>
                            Số tiền:{' '}
                            <span style={{ fontWeight: 600 }}>
                                {amount > returnAmount
                                    ? numeral(amount - returnAmount).format(0, 0)
                                    : numeral(returnAmount - amount).format(0, 0)}
                            </span>
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
                                {amount > returnAmount ? 'Thanh toán đơn hàng' : 'Hoàn tiền'}
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
                {isReturnable && orderInfo.paymentStatus === PAYMENT_STATUS.COMPLETE && (
                    <Button variant="contained" sx={buttonStyle} onClick={handleCreateReturn}>
                        Đổi trả hàng
                    </Button>
                )}
                {orderInfo.paymentStatus !== PAYMENT_STATUS.COMPLETE && (
                    <Button variant="contained" sx={buttonStyle} onClick={handleOpen}>
                        {amount < returnAmount ? 'Hoàn tiền' : 'Thanh toán'}
                    </Button>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                <h5>Đơn hàng SON000{id}</h5>
                <Chip
                    label={orderInfo.paymentStatus === PAYMENT_STATUS.INIT ? 'Đang giao dịch' : 'Hoàn thành'}
                    variant="outlined"
                    sx={{ ...chipStyles[orderInfo.paymentStatus], fontWeight: 400 }}
                />
            </div>
            <div className={cx('infos')}>
                <div className={cx('customer-info', 'panel')}>
                    <h6>Thông tin khách hàng</h6>
                    <Link to={`/customer/${orderInfo.customerId}`} style={{ textDecoration: 'none' }}>
                        <h6 className={cx('customer-name')}>{orderInfo.customerName}</h6>
                    </Link>
                    <div>
                        Số điện thoại:{' '}
                        <span style={{ fontWeight: 600 }}>{orderInfo.phone === '-1' ? '' : orderInfo.phone}</span>
                    </div>
                </div>
                <div className={cx('order-info', 'panel')}>
                    <h6>Thông tin đơn hàng</h6>
                    <div className={cx('purchaseInfoContent')}>
                        {orderInfo.returnOrderId && (
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    backgroundColor: 'rgb(242, 249, 255)',
                                    padding: '10px 15px',
                                    width: '280px',
                                    marginBottom: '15px',
                                }}
                            >
                                Đơn đổi hàng từ đơn trả{' '}
                                <Link
                                    to={`/order_returns/${orderInfo.returnOrderId}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <span>SRN000{orderInfo.returnOrderId}</span>
                                </Link>
                            </div>
                        )}

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Bán tại</div>
                            <div className={cx('personalInfoValue')}>: Chi nhánh mặc định</div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Bán bởi</div>
                            <div className={cx('personalInfoValue')}>: {orderInfo.staffName}</div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Ngày bán</div>
                            <div className={cx('personalInfoValue')}>
                                : {moment(orderInfo.createdAt).format('DD/MM/YYYY HH:MM')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={cx('orderlines', 'panel')}>
                <h6>Thông tin sản phẩm</h6>
            </div> */}
            <div className={cx('history')}>
                <div className={cx('historyHeader')}>
                    <button onClick={handleHistoryPurchase} className={cx({ active: buttonHistoryPurchase })}>
                        Thông tin sản phẩm
                    </button>
                    <button onClick={handleHistoryResponse} className={cx({ active: buttonHistoryResponse })}>
                        Lịch sử trả hàng
                    </button>
                </div>
                <div className={cx('historyContent')}>
                    <div className={cx('historyContentTitle')}>
                        {buttonHistoryPurchase ? (
                            <>
                                <div className={cx('number', 'header')}>STT</div>
                                <div className={cx('image', 'header')}>Ảnh</div>
                                <div className={cx('sku', 'header')}>SKU</div>
                                <div className={cx('name', 'header')}>Tên sản phẩm</div>
                                <div className={cx('quantity', 'header')}>Số lượng</div>
                                <div className={cx('price', 'header')}>Đơn giá</div>
                                <div className={cx('discount', 'header')}>Chiết khấu</div>
                                <div className={cx('amount', 'header')}>Thành tiền</div>
                            </>
                        ) : (
                            <></>
                        )}
                        {buttonHistoryResponse ? (
                            <>
                                <div className={cx('returnOrderId')} style={{ textAlign: 'center' }}>
                                    Mã đơn trả hàng
                                </div>
                                <div className={cx('createdAt')}>Ngày trả hàng</div>
                                <div className={cx('quantityReturn')}>Số lượng hàng trả</div>
                                <div className={cx('returnValue')}>Giá trị hàng trả</div>
                                <div className={cx('swapOrderId')}>Mã đơn đổi</div>
                                <div className={cx('quantitySwap')}>Số lượng hàng đổi</div>
                                <div className={cx('swapValue')}>Giá trị hàng đổi</div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>

                    {buttonHistoryPurchase ? (
                        <>
                            <div className={cx('wrapItem')}>
                                {orderLines.map((item, index) => (
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
                                        <div className={cx('quantity', 'row')}>{item.quantity}</div>
                                        <div className={cx('price', 'row')}>{numeral(item.price).format('0,0')}</div>
                                        <div className={cx('discount', 'row')}>
                                            {numeral(item.discount || 0).format('0,0')}
                                        </div>
                                        <div className={cx('amount', 'row')}>{numeral(item.price).format('0,0')}</div>
                                    </div>
                                ))}
                                {orderLines.length === 0 && <div className={cx('historyEmpty')}>Không có dữ liệu</div>}
                            </div>
                            <div className={cx('summary')}>
                                <div className={cx('summary-item')}>
                                    <div>Tổng tiền ({orderLines.length} sản phẩm)</div>
                                    <div>{numeral(buyValue).format(0, 0)}</div>
                                </div>
                                <div className={cx('summary-item')}>
                                    <div>Chiết khấu</div>
                                    <div>{numeral(orderInfo.discount).format(0, 0)}</div>
                                </div>
                                <div className={cx('summary-item')}>
                                    <div>Mã giảm giá</div>
                                    <div>0</div>
                                </div>
                                {orderInfo.returnOrderId && (
                                    <>
                                        <div className={cx('summary-item')} style={{ fontWeight: 600 }}>
                                            <div>Giá trị mua hàng</div>
                                            <div>{buyValue - orderInfo.discount}</div>
                                        </div>
                                        <div className={cx('summary-item')} style={{ fontWeight: 600 }}>
                                            <div>
                                                Giá trị trả hàng (
                                                <Link
                                                    to={`/order_returns/${orderInfo.returnOrderId}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <span>SRN000{orderInfo.returnOrderId}</span>
                                                </Link>
                                                )
                                            </div>
                                            <div>{orderInfo.returnAmount}</div>
                                        </div>
                                    </>
                                )}
                                <div style={{ fontWeight: 600 }} className={cx('summary-item')}>
                                    <div>{amount > returnAmount ? 'Khách phải trả' : 'Cần trả khách'}</div>
                                    <div style={{ color: amount > returnAmount ? 'black' : 'rgb(255, 77, 77)' }}>
                                        {amount > returnAmount
                                            ? numeral(amount - returnAmount).format(0, 0)
                                            : numeral(returnAmount - amount).format(0, 0)}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}

                    {buttonHistoryResponse ? (
                        <div className={cx('wrapItem')}>
                            {returnHistories.map((item, index) => (
                                <div className={cx('historyContentRow')} key={item.returnOrderId}>
                                    <Link to={`/order_returns/${item.returnOrderId}`} style={linkStyle}>
                                        <div
                                            className={cx('returnOrderId')}
                                            style={{ color: '#0088FF', cursor: 'pointer' }}
                                        >
                                            {item.returnOrderId}
                                        </div>
                                    </Link>
                                    <div className={cx('createdAt')}>{moment(item.createdAt).format('DD/MM/YYYY')}</div>
                                    <div className={cx('quantityReturn')}>{item.returnQuantity}</div>
                                    <div className={cx('returnValue')}>{numeral(item.returnValue).format('0,0')}</div>
                                    <div className={cx('swapOrderId')} style={{ color: '#0088FF', cursor: 'pointer' }}>
                                        {item.swapOrderId ? (
                                            <Link to={`/order_returns/${item.returnOrderId}`} style={linkStyle}>
                                                <div>{item.swapOrderId}</div>
                                            </Link>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className={cx('quantitySwap')}>{item.swapQuantity}</div>
                                    <div className={cx('swapValue')}>
                                        {item.swapValue ? numeral(item.swapValue).format('0,0') : ''}
                                    </div>
                                </div>
                            ))}
                            {returnHistories.length === 0 && <div className={cx('historyEmpty')}>Không có dữ liệu</div>}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Order;
