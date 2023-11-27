import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';

import { useContext, useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import numeral from 'numeral';
import { type } from '@testing-library/user-event/dist/type';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

import { AuthContext } from '../../../contexts/AuthContex';
import * as CustomerServices from '../../../services/CustomerServices';
import * as OrderServices from '../../../services/OrderServices';
import PrintOrder from '../../../components/PDFFile/PrintOrder';
import ReactToPrint from 'react-to-print';

const cx = classNames.bind(styles);

const customStyles = {
    option: (provided, state) => ({
        ...provided,

        cursor: 'pointer',
    }),

    control: (provided) => ({
        ...provided,
        minHeight: '40px',
        width: '200px',
    }),
};

const optionsPayments = [
    { value: 'CASH', label: 'Tiền mặt' },
    { value: 'CREDIT', label: 'Quẹt thẻ' },
    { value: 'TRANSFER', label: 'Chuyển khoản' },
];

function SideBar({
    onButtonAddNewCustomer,
    dataArrayProduct,
    onButtonDiscountOrder,
    valueDiscountOrder,
    typeDiscountOrder,
    onButtonPaymentOrder,
    newCustomer,
    setNewCustomer,
}) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { token } = useContext(AuthContext);
    const [customer, setCustomer] = useState(null);
    const componentRef = useRef();
    const [shouldPrint, setShouldPrint] = useState(false);
    const [listCustomers, setListCustomers] = useState([]);
    const [selectedPayments, setSelectedPayments] = useState({ value: 'CASH', label: 'Tiền mặt' });

    const nameRef = useRef(null);
    const numberPhoneRef = useRef(null);
    // const [listProductOrder, setListProductOrder] = useState([]);
    const [order, setOrder] = useState({ totalPrice: 0, totalProduct: 0 });
    const [customerGive, setCustomerGive] = useState('');
    const [inputSearchCustomer, setInputSearchCustomer] = useState('');

    console.log('dataArrayProduct', dataArrayProduct);

    const handleButtonAddNewCustomer = () => {
        // Gọi hàm xử lý được truyền từ component cha
        onButtonAddNewCustomer();
    };

    const handleButtonDiscountOrder = () => {
        onButtonDiscountOrder();
    };

    const handlePopperClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleOutsideClick = (event) => {
        if (anchorEl && anchorEl.contains(event.target)) {
            // Click is inside the Popper, do nothing
            return;
        }

        setOpen(false);
    };

    const handleClickCustomer = (name, phone, id, address) => {
        const customerInfo = {
            name: name,
            phone: phone,
            id: id,
            address: address,
        };
        // console.log('---------------------', customerInfo);
        setCustomer(customerInfo);
    };

    const handleCancelCustomer = (event) => {
        setCustomer(null);
    };

    const handleCustomerGive = (value) => {
        // const value = event.target.value;

        // // Loại bỏ tất cả các ký tự không phải số
        // const numericValue = value.replace(/[^0-9]/g, '');

        // // Định dạng số
        // const formattedValue = numeral(numericValue).format('0,0');

        // const customerGiveMoney = parseInt(event.target.value, 10);
        console.log(value);
        setCustomerGive(value);
        // setCustomerGive(numeral(customerGiveMoney).format('0,0'));
    };

    const handleInputSearchChange = (e) => {
        setInputSearchCustomer(e.target.value);
    };

    const handlePaymentsChange = (selectedOption) => {
        console.log(selectedOption);
        console.log(selectedPayments);
        setSelectedPayments(selectedOption);
    };

    const handleTemporaryPrint = () => {
        toast.warn('Hãy thêm sản phẩm vào đơn hàng', {
            autoClose: 2000,
        });
    };

    const handlePayment = () => {
        console.log('payment roi');
        if (dataArrayProduct.length === 0) {
            toast.warn('Hãy thêm sản phẩm vào đơn hàng', {
                autoClose: 2000,
            });
            setShouldPrint(false);
        } else if (
            customerGive <
            parseFloat(
                numeral(
                    order.totalPrice * 1.0 -
                        (typeDiscountOrder ? (order.totalPrice * valueDiscountOrder) / 100 : valueDiscountOrder),
                )
                    .format('0,0')
                    .replace(/,/g, ''),
            )
        ) {
            toast.warn(
                `Hãy nhập tiền khách đưa: ${numeral(
                    order.totalPrice * 1.0 -
                        (typeDiscountOrder ? (order.totalPrice * valueDiscountOrder) / 100 : valueDiscountOrder),
                ).format('0,0')}`,
                {
                    autoClose: 2000,
                },
            );
            setShouldPrint(false);
        } else {
            const fetchApi = async () => {
                try {
                    // API tạo đơn và thanh toán
                    const result = await OrderServices.createOrder(
                        {
                            customerId: customer?.id,
                            paymentMethod: selectedPayments.value,
                            orderVariantList: dataArrayProduct.map((item) => {
                                return {
                                    variantId: item.id,
                                    quantity: item.quantityPurchased,
                                };
                            }),
                            discount: typeDiscountOrder
                                ? (order.totalPrice * valueDiscountOrder) / 100
                                : valueDiscountOrder,
                        },
                        token,
                    );
                    console.log(result);
                    if (result) {
                        toast.success('Thanh toán thành công', {
                            autoClose: 2000,
                        });
                        onButtonPaymentOrder((prev) => !prev);
                        setCustomer(null);
                        setNewCustomer(null);
                        setCustomerGive('');
                        setShouldPrint(true);
                    } else {
                        toast.error('Thanh toán không thành công', {
                            autoClose: 2000,
                        });
                        setShouldPrint(false);
                    }
                    // setListCustomers(result);
                } catch (error) {
                    console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
                    setShouldPrint(false);
                }
            };
            fetchApi();
        }
        setShouldPrint(true);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.searchCustomer(newCustomer.numberPhone, token);
                if (result) {
                    setCustomer({
                        name: result[0].name,
                        phone: result[0].phone,
                        id: result[0].id,
                        address: result[0].address,
                    });
                } else {
                    console.log('error search customer from ModalNewCustomer');
                }
            } catch (error) {
                console.log('fetchApi getCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [newCustomer, token]);

    useEffect(() => {
        var totalPrice = 0;
        dataArrayProduct?.forEach((product) => {
            totalPrice += product.retailPrice * product.quantityPurchased;
        });
        setOrder({ totalPrice: totalPrice, totalProduct: dataArrayProduct?.length });
    }, [dataArrayProduct]);

    //API
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.getAllCustomer(1, 10, token);
                setListCustomers(result);
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [open, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.searchCustomer(inputSearchCustomer, token);
                setListCustomers(result);
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [inputSearchCustomer, token]);

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [anchorEl]);

    return (
        <div className={cx('wrap')}>
            <ToastContainer />
            <div className={cx('wrapHeader')}>
                <div className={cx('header')}>
                    {customer ? (
                        <div className={cx('wrapInfoCustomer')}>
                            <PersonIcon />
                            <div className={cx('infoCustomer')}>
                                <span className={cx('infoName')}>{customer?.name}</span>
                                <span> - </span>
                                <span className={cx('infoNumberPhone')}>{customer?.phone}</span>
                            </div>
                            <HighlightOffIcon className={cx('cancel')} onClick={handleCancelCustomer} />
                        </div>
                    ) : (
                        <>
                            <div className={cx('wrapSearch')} onClick={handlePopperClick}>
                                <SearchIcon sx={{ color: '#637381', fontSize: '22px' }} />
                                <input
                                    className={cx('searchInput')}
                                    placeholder="Thêm khách hàng vào đơn"
                                    value={inputSearchCustomer}
                                    onChange={handleInputSearchChange}
                                ></input>
                            </div>
                            <Tooltip title="Thêm mới khách hàng">
                                <IconButton aria-label="add" size="small" onClick={handleButtonAddNewCustomer}>
                                    <AddIcon sx={{ color: '#637381', fontSize: '28px' }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </div>
                <div className={cx('menuDivider')}></div>
                <Popper open={open} anchorEl={anchorEl}>
                    <div className={cx('popper')}>
                        <div className={cx('innerPopper', 'addCustomer')} onClick={handleButtonAddNewCustomer}>
                            <AddIcon sx={{ color: '#637381', fontSize: '24px' }} />
                            <span>Thêm mới khách hàng</span>
                        </div>

                        {listCustomers?.map((customer, index) => (
                            <div
                                key={index}
                                className={cx('innerPopper', 'itemCustomer')}
                                onClick={() =>
                                    handleClickCustomer(customer.name, customer.phone, customer.id, customer.address)
                                }
                            >
                                <span className={cx('nameCustomer')}>{customer.name}</span>
                                <span className={cx('numberPhoneCustomer')}>{customer.phone}</span>
                            </div>
                        ))}
                    </div>
                </Popper>
            </div>
            <div className={cx('content')}>
                <div className={cx('item')}>
                    <span>
                        Tổng tiền: (<strong>{numeral(order.totalProduct).format('0,0')}</strong> sản phẩm)
                    </span>
                    <span>{numeral(order.totalPrice).format('0,0')}</span>
                </div>
                <div className={cx('item')}>
                    <span>VAT(0%):</span>
                    <span>{numeral(order.totalPrice * 0.0).format('0,0')}</span>
                </div>
                <div className={cx('item')}>
                    <span>Chiết khấu</span>
                    <button className={cx('button')} onClick={handleButtonDiscountOrder}>
                        {numeral(
                            typeDiscountOrder ? (order.totalPrice * valueDiscountOrder) / 100 : valueDiscountOrder,
                        ).format('0,0')}
                    </button>
                </div>
                <div className={cx('item')}>
                    <strong>KHÁCH PHẢI TRẢ</strong>
                    <span className={cx('customerMustPay')}>
                        {numeral(
                            order.totalPrice * 1 -
                                (typeDiscountOrder
                                    ? (order.totalPrice * valueDiscountOrder) / 100
                                    : valueDiscountOrder),
                        ).format('0,0')}
                    </span>
                </div>
                <div className={cx('item', 'customerGive')}>
                    <strong>Tiền khách đưa</strong>
                    <input
                        type="text"
                        value={numeral(customerGive).format('0,0')}
                        onChange={(event) => handleCustomerGive(numeral(event.target.value).value())}
                    ></input>
                    <hr className={cx('buttonDivider')}></hr>
                </div>
                <div className={cx('item', 'guestPayment')}>
                    <strong>Tiền thừa trả khách</strong>
                    <div>
                        {numeral(
                            parseFloat(customerGive) -
                                parseFloat(
                                    numeral(
                                        order.totalPrice * 1.0 -
                                            (typeDiscountOrder
                                                ? (order.totalPrice * valueDiscountOrder) / 100
                                                : valueDiscountOrder),
                                    )
                                        .format('0,0.00')
                                        .replace(/,/g, ''),
                                ),
                        ).format('0,0')}
                    </div>
                </div>
                <div className={cx('item')}>
                    <strong>Hình thức thanh toán</strong>
                    <div style={{ width: '200px', marginTop: '10px' }}>
                        <Select
                            value={selectedPayments}
                            onChange={handlePaymentsChange}
                            options={optionsPayments}
                            styles={customStyles}
                            placeholder="Chọn hình thức  thanh toán"
                        />
                    </div>
                </div>
            </div>
            <div className={cx('payment')}>
                {dataArrayProduct?.length === 0 ? (
                    <button onClick={handleTemporaryPrint} className={cx('buttonPrint')}>
                        IN TẠM TÍNH
                    </button>
                ) : (
                    <ReactToPrint
                        trigger={() => {
                            return <button className={cx('buttonPrint')}>IN TẠM TÍNH</button>;
                        }}
                        content={() => componentRef.current}
                    />
                )}

                <div onClick={handlePayment}>
                    <ReactToPrint
                        trigger={() => {
                            setShouldPrint(false);
                            return <button className={cx('buttonPayment')}>THANH TOÁN</button>;
                        }}
                        content={() => componentRef.current}
                    />
                </div>
                {/* <div onClick={handlePayment}>
                    {shouldPrint ? (
                        <ReactToPrint
                            trigger={() => {
                                setShouldPrint(false);
                                return <button className={cx('buttonPayment')}>THANH TOÁN</button>;
                            }}
                            content={() => componentRef.current}
                        />
                    ) : (
                        <button className={cx('buttonPayment')}>THANH TOÁN</button>
                    )}
                </div> */}
                {/* <button onClick={handlePayment} className={cx('buttonPayment')}>
                    THANH TOÁN
                </button> */}

                {/* <ReactToPrint
                        trigger={() => {
                            return <button className={cx('buttonPayment')}>THANH TOÁN</button>;
                        }}
                        content={() => componentRef.current}
                    /> */}

                <div style={{ display: 'none' }}>
                    <PrintOrder
                        componentRef={componentRef}
                        dayRequest={dayjs().add(0, 'day')}
                        customer={customer}
                        dataArrayProduct={dataArrayProduct}
                        discount={
                            typeDiscountOrder ? (order.totalPrice * valueDiscountOrder) / 100 : valueDiscountOrder
                        }
                        totalPricePayment={
                            order.totalPrice * 1.0 -
                            (typeDiscountOrder ? (order.totalPrice * valueDiscountOrder) / 100 : valueDiscountOrder)
                        }
                        selectedPayments={selectedPayments}
                    />
                </div>
            </div>
        </div>
    );
}

export default SideBar;
