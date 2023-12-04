import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerDetail.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import numeral from 'numeral';
import EditResponse from '../../../components/Modal/EditResponse';
import AddResponse from '../../../components/Modal/AddResponse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import _ from 'lodash';

import { AuthContext } from '../../../contexts/AuthContex';
import * as CustomerServices from '../../../services/CustomerServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function CustomerDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({});
    const { token } = useContext(AuthContext);
    const [purchaseInformation, setPurchaseInformation] = useState({});
    const [historyPurchase, setHistoryPurchase] = useState([]);
    const [historyResponse, setHistoryResponse] = useState([]);
    const [buttonHistoryPurchase, setButtonHistoryPurchase] = useState(true);
    const [buttonHistoryResponse, setButtonHistoryResponse] = useState(false);
    const [openEditResponse, setOpenEditResponse] = useState(false);
    const [contentResponse, setContentResponse] = useState('');
    const [openAddResponse, setOpenAddResponse] = useState(false);
    const [purchaseSortPayment, setPurchaseSortPayment] = useState(null);
    const [purchaseSortValue, setPurchaseSortValue] = useState(null);
    const [purchaseSortQuantity, setPurchaseSortQuantity] = useState(null);
    const [responseSortEvaluate, setResponseSortEvaluate] = useState(null);
    const [responseSortDay, setResponseSortDay] = useState(null);

    const handleCloseEditResponse = () => setOpenEditResponse(false);
    const handleOpenEditResponse = (item) => {
        setContentResponse(item);
        setOpenEditResponse(true);
    };

    const handleCloseAddResponse = () => setOpenAddResponse(false);
    const handleOpenAddResponse = (content) => {
        setContentResponse(content);
        setOpenAddResponse(true);
    };

    const handleDeleteCustomer = () => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?');
        if (confirm) {
            const fetchApi = async () => {
                try {
                    const result = await CustomerServices.deleteCustomerById(id, token);
                    if (result) {
                        toast.success('Xóa khách hàng thành công', {
                            autoClose: 2000,
                            onClose: () => navigate(-1),
                        });
                    } else {
                        toast.error('Xóa khách hàng không thành công', {
                            autoClose: 2000,
                        });
                    }
                } catch (error) {
                    toast.error('Có lỗi xảy ra', {
                        autoClose: 2000,
                    });
                    console.log('fetchApi deleteCustomerById CustomerDetal.js' + error);
                }
            };
            fetchApi();
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.getAllFeedbackByCustomer(id, token);
                console.log('result', result);
                setHistoryResponse(result);
            } catch (error) {
                console.log('fetchApi getAllFeedbackByCustomer CustomerDetal.js' + error);
            }
        };
        fetchApi();
    }, [id, token, openAddResponse, openEditResponse]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.getListOrderByCustomer(id, token) || [];
                console.log('result setHistoryPurchase', result);
                // setHistoryPurchase({
                //     id: 1,
                //     orderCode: 'SON00001',
                //     paymentTime: '29/08/2023',
                //     totalPrice: 1000000,
                //     totalQuantity: 10,
                //     staffCharge: 'Nguyễn Thu Phương',
                // });
                setHistoryPurchase(
                    result?.map((item) => {
                        return {
                            id: item.order.id,
                            orderCode: item.order.id,
                            paymentTime: moment(item.payment.createdAt).format('DD/MM/YYYY HH:mm'),
                            totalPrice: item.payment.amount,
                            totalQuantity: item.order.orderLineList.reduce((acc, i) => acc + i.quantity, 0),
                            staffCharge: item.order.userEntity.fullName,
                        };
                    }),
                );
            } catch (error) {
                console.log('fetchApi getAllCustomerServices CustomerDetal.js' + error);
            }
        };
        fetchApi();
    }, [id, token, openAddResponse, openEditResponse]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.getDetailCustomer(id, token);
                setCustomer({
                    id: result.id,
                    customerCode: result.customerCode,
                    dateOfBirth: result.dateOfBirth,
                    gender: result.gender,
                    name: result.name,
                    numberPhone: result.phone,
                    address: result.address,
                    customerGroup: 'Bán lẻ',
                    email: result.email,
                });
            } catch (error) {
                console.log('fetchApi getDetailCustomer CustomerDetal.js' + error);
            }
        };
        fetchApi();
    }, [id, token]);

    // useEffect(() => {
    //     setCustomer({
    //         id: 1,
    //         customerCode: 'CUZN00001',
    //         dateOfBirth: '24/08/2002',
    //         gender: 'Nam',
    //         name: 'Mạnh Phương',
    //         numberPhone: '0123456781',
    //         address: 'Hai Bà Trưng, Hà Nội',
    //         customerGroup: 'VIP',
    //         email: 'manhphuong1702@gmail.com',
    //     });

    //     setPurchaseInformation({
    //         totalSpending: 100000,
    //         totalOrder: 10,
    //         totalQuantityPurchased: 100,
    //         totalReturnedQuantity: 6,
    //         lastPurchaseDate: '29/08/2023',
    //     });
    // }, [id]);

    const handleHistoryPurchase = () => {
        setButtonHistoryPurchase(true);
        setButtonHistoryResponse(false);
    };

    const handleHistoryResponse = () => {
        setButtonHistoryPurchase(false);
        setButtonHistoryResponse(true);
    };

    // const handleShowDetailOrder = (orderId) => {
    //     navigate(`/orders/${orderId}`);
    // };

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE')) {
        navigate('/403');
    }

    return (
        <>
            <div className={cx('wrap')}>
                <ToastContainer />
                <div className={cx('header')}>
                    <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                        Quay lại
                    </Button>
                    <div>
                        <Button variant="outlined" color="error" onClick={handleDeleteCustomer}>
                            Xóa khách hàng
                        </Button>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddResponse}>
                            Tạo phản hồi
                        </Button>
                    </div>
                </div>
                <div className={cx('content')}>
                    <div className={cx('personalInfo')}>
                        <div className={cx('personalInfoHeader')}>
                            <span>Thông tin cá nhân</span>
                            <button onClick={() => navigate(`/customer/${id}/edit`, { state: { customer } })}>
                                Cập nhật
                            </button>
                        </div>
                        <div className={cx('personalInfoContent')}>
                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoContentCol')}>
                                    <div className={cx('personalInfoTitle')}>Tên khách hàng</div>
                                    <div className={cx('personalInfoValue')}>
                                        : {customer.name ? <strong>{customer.name}</strong> : <span>---</span>}
                                    </div>
                                </div>
                                <div className={cx('personalInfoContentCol')}>
                                    <div className={cx('personalInfoTitle')}>Nhóm khách hàng</div>
                                    <div className={cx('personalInfoValue')}>
                                        :{' '}
                                        {customer.customerGroup ? (
                                            <span style={{ color: '#0088ff', fontWeight: '600' }}>
                                                {customer.customerGroup}
                                            </span>
                                        ) : (
                                            <span>---</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoContentCol')}>
                                    <div className={cx('personalInfoTitle')}>Giới tính</div>
                                    <div className={cx('personalInfoValue')}>
                                        :{' '}
                                        {customer.gender ? (
                                            <span>
                                                {customer.gender === 'MALE' && <span>Nam</span>}
                                                {customer.gender === 'FEMALE' && <span>Nữ</span>}
                                                {customer.gender === 'OTHER' && <span>Khác</span>}
                                            </span>
                                        ) : (
                                            <span>---</span>
                                        )}
                                    </div>
                                </div>
                                <div className={cx('personalInfoContentCol')}>
                                    <div className={cx('personalInfoTitle')}>Mã khách hàng</div>
                                    <div className={cx('personalInfoValue')}>
                                        :{' '}
                                        {customer.customerCode ? (
                                            <span>{customer.customerCode}</span>
                                        ) : (
                                            <span>---</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoContentCol')}>
                                    <div className={cx('personalInfoTitle')}>Số điện thoại</div>
                                    <div className={cx('personalInfoValue')}>
                                        :{' '}
                                        {customer.numberPhone > 0 ? (
                                            <span>{customer.numberPhone}</span>
                                        ) : (
                                            <span>---</span>
                                        )}
                                    </div>
                                </div>
                                <div className={cx('personalInfoContentCol')}>
                                    <div className={cx('personalInfoTitle')}>Email</div>
                                    <div className={cx('personalInfoValue')}>
                                        : {customer.email ? <span>{customer.email}</span> : <span>---</span>}
                                    </div>
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('oneColumnPerRow')}>
                                    <div className={cx('personalInfoTitle')}>Địa chỉ</div>
                                    <div className={cx('personalInfoValue')}>
                                        : {customer.address ? <span>{customer.address}</span> : <span>---</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('purchaseInfo')}>
                        <div className={cx('purchaseInfoHeader')}>
                            <span>Thông tin mua hàng</span>
                        </div>
                        <div className={cx('purchaseInfoContent')}>
                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Tổng chi tiêu</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {purchaseInformation.totalSpending ? (
                                        <span>{numeral(purchaseInformation.totalSpending).format('0,0')}</span>
                                    ) : (
                                        <span>---</span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Tổng SL đơn hàng</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {purchaseInformation.totalOrder ? (
                                        <span>{numeral(purchaseInformation.totalOrder).format('0,0')}</span>
                                    ) : (
                                        <span>---</span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Tổng SL sản phẩm đã mua</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {purchaseInformation.totalQuantityPurchased ? (
                                        <span>{numeral(purchaseInformation.totalQuantityPurchased).format('0,0')}</span>
                                    ) : (
                                        <span>---</span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Tổng SL sản phẩm hoàn trả</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {purchaseInformation.totalReturnedQuantity ? (
                                        <span>{numeral(purchaseInformation.totalReturnedQuantity).format('0,0')}</span>
                                    ) : (
                                        <span>---</span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('personalInfoContentRow')}>
                                <div className={cx('personalInfoTitle')}>Ngày cuối cùng mua hàng</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {purchaseInformation.lastPurchaseDate ? (
                                        <span>{purchaseInformation.lastPurchaseDate}</span>
                                    ) : (
                                        <span>---</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('history')}>
                    <div className={cx('historyHeader')}>
                        <button onClick={handleHistoryPurchase} className={cx({ active: buttonHistoryPurchase })}>
                            Lịch sử mua hàng
                        </button>
                        <button onClick={handleHistoryResponse} className={cx({ active: buttonHistoryResponse })}>
                            Lịch sử phản hồi
                        </button>
                    </div>
                    <div className={cx('historyContent')}>
                        <div className={cx('historyContentTitle')}>
                            {buttonHistoryPurchase ? (
                                <>
                                    <div className={cx('orderCode')}>Mã đơn hàng</div>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className={cx('paymentTime')}
                                        onClick={() => {
                                            setPurchaseSortValue(null);
                                            setPurchaseSortQuantity(null);
                                            setPurchaseSortPayment((prev) => {
                                                if (prev === null) {
                                                    return false;
                                                } else {
                                                    return !prev;
                                                }
                                            });
                                            setHistoryPurchase((prev) => {
                                                if (purchaseSortPayment === null) {
                                                    return _.orderBy(historyPurchase, ['paymentTime'], ['desc']);
                                                } else if (purchaseSortPayment === false) {
                                                    return _.sortBy(historyPurchase, 'paymentTime');
                                                } else {
                                                    return _.orderBy(historyPurchase, ['paymentTime'], ['desc']);
                                                }
                                            });
                                        }}
                                    >
                                        Thời gian thanh toán
                                        {purchaseSortPayment === null && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSort} />
                                        )}
                                        {purchaseSortPayment === true && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortUp} />
                                        )}
                                        {purchaseSortPayment === false && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortDown} />
                                        )}
                                    </div>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className={cx('totalPrice')}
                                        onClick={() => {
                                            setPurchaseSortPayment(null);
                                            setPurchaseSortQuantity(null);
                                            setPurchaseSortValue((prev) => {
                                                if (prev === null) {
                                                    return false;
                                                } else {
                                                    return !prev;
                                                }
                                            });
                                            setHistoryPurchase((prev) => {
                                                if (purchaseSortValue === null) {
                                                    return _.orderBy(historyPurchase, ['totalPrice'], ['desc']);
                                                } else if (purchaseSortValue === false) {
                                                    return _.sortBy(historyPurchase, 'totalPrice');
                                                } else {
                                                    return _.orderBy(historyPurchase, ['totalPrice'], ['desc']);
                                                }
                                            });
                                        }}
                                    >
                                        Giá trị
                                        {purchaseSortValue === null && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSort} />
                                        )}
                                        {purchaseSortValue === true && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortUp} />
                                        )}
                                        {purchaseSortValue === false && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortDown} />
                                        )}
                                    </div>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className={cx('totalQuantity')}
                                        onClick={() => {
                                            setPurchaseSortPayment(null);
                                            setPurchaseSortValue(null);
                                            setPurchaseSortQuantity((prev) => {
                                                if (prev === null) {
                                                    return false;
                                                } else {
                                                    return !prev;
                                                }
                                            });
                                            setHistoryPurchase((prev) => {
                                                if (purchaseSortQuantity === null) {
                                                    return _.orderBy(historyPurchase, ['totalQuantity'], ['desc']);
                                                } else if (purchaseSortQuantity === false) {
                                                    return _.sortBy(historyPurchase, 'totalQuantity');
                                                } else {
                                                    return _.orderBy(historyPurchase, ['totalQuantity'], ['desc']);
                                                }
                                            });
                                        }}
                                    >
                                        Số lượng sản phẩm
                                        {purchaseSortQuantity === null && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSort} />
                                        )}
                                        {purchaseSortQuantity === true && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortUp} />
                                        )}
                                        {purchaseSortQuantity === false && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortDown} />
                                        )}
                                    </div>
                                    <div className={cx('staffCharge')}>Nhân viên xử lý đơn</div>
                                </>
                            ) : (
                                <></>
                            )}
                            {buttonHistoryResponse ? (
                                <>
                                    <div className={cx('index')}>STT</div>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className={cx('rating')}
                                        onClick={() => {
                                            setResponseSortDay(null);

                                            setResponseSortEvaluate((prev) => {
                                                if (prev === null) {
                                                    return false;
                                                } else {
                                                    return !prev;
                                                }
                                            });
                                            setHistoryResponse((prev) => {
                                                if (responseSortEvaluate === null) {
                                                    return _.orderBy(historyResponse, ['evaluate'], ['desc']);
                                                } else if (responseSortEvaluate === false) {
                                                    return _.sortBy(historyResponse, 'evaluate');
                                                } else {
                                                    return _.orderBy(historyResponse, ['evaluate'], ['desc']);
                                                }
                                            });
                                        }}
                                    >
                                        Điểm đánh giá
                                        {responseSortEvaluate === null && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSort} />
                                        )}
                                        {responseSortEvaluate === true && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortUp} />
                                        )}
                                        {responseSortEvaluate === false && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortDown} />
                                        )}
                                    </div>
                                    <div className={cx('contentResponse')} style={{ marginLeft: '40px' }}>
                                        Nội dung phản hồi
                                    </div>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className={cx('responseTime')}
                                        onClick={() => {
                                            setResponseSortEvaluate(null);

                                            setResponseSortDay((prev) => {
                                                if (prev === null) {
                                                    return false;
                                                } else {
                                                    return !prev;
                                                }
                                            });
                                            setHistoryResponse((prev) => {
                                                if (responseSortDay === null) {
                                                    return _.orderBy(historyResponse, ['createdAt'], ['desc']);
                                                } else if (responseSortDay === false) {
                                                    return _.sortBy(historyResponse, 'createdAt');
                                                } else {
                                                    return _.orderBy(historyResponse, ['createdAt'], ['desc']);
                                                }
                                            });
                                        }}
                                    >
                                        Ngày phản hồi
                                        {responseSortDay === null && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSort} />
                                        )}
                                        {responseSortDay === true && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortUp} />
                                        )}
                                        {responseSortDay === false && (
                                            <FontAwesomeIcon className={cx('sortIcon')} icon={faSortDown} />
                                        )}
                                    </div>
                                    <div className={cx('staffChargeResponse')}>Nhân viên xử lý</div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>

                        {buttonHistoryPurchase ? (
                            <div className={cx('wrapItem')}>
                                {historyPurchase.map((item) => (
                                    <div className={cx('historyContentRow')} key={item.id}>
                                        <Link to={`/order/${item.id}`} className={cx('orderCode')}>
                                        SON000{item.orderCode}
                                        </Link>
                                        <div className={cx('paymentTime')}>{item.paymentTime}</div>
                                        <div className={cx('totalPrice')}>{numeral(item.totalPrice).format('0,0')}</div>
                                        <div className={cx('totalQuantity')}>
                                            {numeral(item.totalQuantity).format('0,0')}
                                        </div>
                                        <div className={cx('staffCharge')}>{item.staffCharge}</div>
                                    </div>
                                ))}
                                {historyPurchase.length === 0 && (
                                    <div className={cx('historyEmpty')}>Không dữ liệu lịch sử mua hàng</div>
                                )}
                            </div>
                        ) : (
                            <></>
                        )}

                        {buttonHistoryResponse ? (
                            <div className={cx('wrapItem')}>
                                {historyResponse.map((item, index) => (
                                    <div
                                        className={cx('historyContentRow')}
                                        key={item.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleOpenEditResponse(item)}
                                    >
                                        <div className={cx('index')}>{index + 1}</div>
                                        <div className={cx('rating')}>{item.evaluate}</div>
                                        <div className={cx('contentResponse')}>{item.content}</div>
                                        <div className={cx('responseTime')}>
                                            {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                        </div>
                                        <div className={cx('staffChargeResponse')}>
                                            {item.userEntity.fullName || 'ManhPhuong'}
                                        </div>
                                    </div>
                                ))}
                                {historyResponse.length === 0 && (
                                    <div className={cx('historyEmpty')}>Không dữ liệu lịch sử phản hồi</div>
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <EditResponse
                openModal={openEditResponse}
                closeModal={handleCloseEditResponse}
                contentResponse={contentResponse}
            />
            <AddResponse openModal={openAddResponse} closeModal={handleCloseAddResponse} customer={customer} />
        </>
    );
}

export default CustomerDetail;
