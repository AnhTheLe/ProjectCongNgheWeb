import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faFileInvoiceDollar, faSackDollar, faUser } from '@fortawesome/free-solid-svg-icons';
import { fontSize } from '@mui/system';
import dayjs from 'dayjs';
import Select from 'react-select';
import numeral from 'numeral';

import { AuthContext } from '../../contexts/AuthContex';
import * as OrderServices from '../../services/OrderServices';
import * as CustomerServices from '../../services/CustomerServices';
import moment from 'moment';

const cx = classNames.bind(styles);

const customStyles = {
    option: (provided, state) => ({
        ...provided,

        cursor: 'pointer',
    }),

    control: (provided) => ({
        ...provided,
        minHeight: '40px',
        width: '180px',
    }),
};

const optionsTopProduct = [
    { value: 'order', label: 'Theo đơn hàng' },
    { value: 'quantity', label: 'Theo số lượng' },
    { value: 'revenue', label: 'Theo doanh thu' },
];

const optionsTopCustomer = [
    { value: 'order', label: 'Theo số đơn hàng' },
    // { value: 'quantity', label: 'Theo số lượng' },
    { value: 'revenue', label: 'Theo chi tiêu' },
];

function Dashboard() {
    const { token } = useContext(AuthContext);
    const [selectedTopCustomer, setSelectedTopCustomer] = useState({ value: 'order', label: 'Theo số đơn hàng' });
    const [selectedTopProduct, setSelectedTopProduct] = useState({ value: 'order', label: 'Theo đơn hàng' });
    const [topProduct, setTopProduct] = useState([]);
    const [topCustomer, setTopCustomer] = useState([]);
    const [type, setType] = useState();
    const navigate = useNavigate();
    const [figures, setFigures] = useState({
        revenue: '',
        order: '',
        product: '',
        customer: '',
    });
    const [colorBackground, setColorBackground] = useState([
        '#33a0ff',
        '#3fda9e',
        '#ffce6a',
        '#ff9494',
        '#66b8ff',
        '#7580e3',
    ]);

    const handleTopCustomerChange = (selectedOption) => {
        setSelectedTopCustomer(selectedOption);
    };

    const handleTopProductChange = (selectedOption) => {
        setSelectedTopProduct(selectedOption);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.statisticalListByTime(
                    (dayjs().add(0, 'day')).format('YYYY/MM/DD'),
                   (dayjs().add(1, 'day')).format('YYYY/MM/DD'),
                    token,
                );
                const countCustomer = await CustomerServices.countCustomer(token);
                setFigures((prev) => ({
                    ...prev,
                    revenue: result.data[0].revenue,
                    order: result.data[0].orderNumber,
                    product: result.data[0].numberProductsSold,
                    customer: countCustomer.data,
                }));
            } catch (error) {
                console.log('fetchApi statisticalListByTime StatisticsSale.js' + error);
            }
        };
        fetchApi();
    }, [selectedTopProduct, selectedTopCustomer, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.topOrder(
                    (dayjs().subtract(7, 'day')).format('YYYY/MM/DD'),
                    (dayjs().add(1, 'days')).format('YYYY/MM/DD'),
                    selectedTopProduct.value,
                    token,
                );
                console.log('console ne home', result);
                console.log('console selectedTopProduct home', selectedTopProduct);
                setTopProduct(result.data);
                // setTopProduct([]);
            } catch (error) {
                console.log('fetchApi topOrder Home.js' + error);
            }
        };
        fetchApi();
    }, [selectedTopProduct, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.topCustomer(
                    (dayjs().subtract(7, 'day')).format('YYYY/MM/DD'),
                    (dayjs().add(1, 'days')).format('YYYY/MM/DD'),
                    selectedTopCustomer.value,
                    token,
                );
                console.log('day', (dayjs().subtract(7, 'day')).format('YYYY/MM/DD') );
                console.log('console ne home', result);
                console.log('console selectedTopCustomer home', selectedTopCustomer);
                setTopCustomer(result.data);
                // setTopCustomer([]);
            } catch (error) {
                console.log('fetchApi topCustomer Home.js' + error);
            }
        };
        fetchApi();
    }, [selectedTopCustomer, token]);

    return (
        <div className={cx('wrap')}>
            <div className={cx('homeSummary')}>
                <div className={cx('homeSummaryTitle')}>
                    <h6>KẾT QUẢ KINH DOANH TỔNG QUAN</h6>
                </div>
                <div className={cx('homeSummaryParameter')}>
                    <div className={cx('parameterItem')}>
                        <div className={cx('wrapItem')}>
                            <div
                                className={cx('wrapIcon')}
                                style={{ background: 'linear-gradient(65.71deg, #0088FF 28.29%, #33A0FF 97.55%)' }}
                            >
                                <FontAwesomeIcon icon={faSackDollar} style={{ fontSize: '20px' }} />
                            </div>
                            <div className={cx('wrapValue')}>
                                <div className={cx('itemTitle')}>
                                    <h6>Doanh thu hôm nay</h6>
                                </div>
                                <div className={cx('itemValue')}>
                                    <h5 style={{ color: '#0088FF' }}>{numeral(figures.revenue).format('0,0')}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('parameterItem')}>
                        <div className={cx('wrapItem')}>
                            <div
                                className={cx('wrapIcon')}
                                style={{ background: 'linear-gradient(62.06deg, #0FD186 25.88%, #3FDA9E 100%)' }}
                            >
                                <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ fontSize: '20px' }} />
                            </div>
                            <div className={cx('wrapValue')}>
                                <div className={cx('itemTitle')}>
                                    <h6>Đơn hàng mới</h6>
                                </div>
                                <div className={cx('itemValue')}>
                                    <h5 style={{ color: '#0FD186' }}>{numeral(figures.order).format('0,0')}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('parameterItem')}>
                        <div className={cx('wrapItem')}>
                            <div
                                className={cx('wrapIcon')}
                                style={{ background: 'linear-gradient(66.01deg, #FFAE06 37.34%, #FFBE38 101.09%)' }}
                            >
                                <FontAwesomeIcon icon={faBox} style={{ fontSize: '20px' }} />
                            </div>
                            <div className={cx('wrapValue')}>
                                <div className={cx('itemTitle')}>
                                    <h6>SP bán hôm nay</h6>
                                </div>
                                <div className={cx('itemValue')}>
                                    <h5 style={{ color: '#FFAE06' }}>{numeral(figures.product).format('0,0')}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('parameterItem')}>
                        <div className={cx('wrapItem')}>
                            <div
                                className={cx('wrapIcon')}
                                style={{ background: 'linear-gradient(65.71deg, #5e6472 28.29%, #5e7583 97.55%)' }}
                            >
                                <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px' }} />
                            </div>
                            <div className={cx('wrapValue')}>
                                <div className={cx('itemTitle')}>
                                    <h6>SL khách hàng</h6>
                                </div>
                                <div className={cx('itemValue')}>
                                    <h5 style={{ color: '#5e6472' }}>{numeral(figures.customer).format('0,0')}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('topProduct')}>
                    <div className={cx('topProductTitle')}>
                        <h6>TOP SẢN PHẨM 7 NGÀY QUA</h6>
                        <Select
                            value={selectedTopProduct}
                            onChange={handleTopProductChange}
                            options={optionsTopProduct}
                            styles={customStyles}
                            placeholder="Chọn thống kê"
                        />
                    </div>
                    <div className={cx('topProductContent')}>
                        {topProduct?.length !== 0 &&
                            topProduct?.map((item, index) => {
                                if (index < 6) {
                                    return (
                                        <div className={cx('topProductItem')}>
                                            <div
                                                className={cx('itemIcon')}
                                                style={{ background: colorBackground[index] }}
                                            >
                                                0{index + 1}
                                            </div>
                                            <div className={cx('itemName')}>
                                                <div className={cx('itemNameProduct')}>{item.variant.name}</div>
                                                <div className={cx('itemNameSKU')}>{item.variant.sku}</div>
                                            </div>
                                            <div className={cx('itemQuantity')}>
                                                {numeral(item.value).format('0,0')}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        {topProduct.length === 0 && (
                            <div className={cx('listProductEmpty')}>Chưa có sản phẩm được bán</div>
                        )}
                    </div>
                </div>
                <div className={cx('topProduct')}>
                    <div className={cx('topProductTitle')}>
                        <h6>TOP KHÁCH HÀNG 7 NGÀY QUA</h6>
                        <Select
                            value={selectedTopCustomer}
                            onChange={handleTopCustomerChange}
                            options={optionsTopCustomer}
                            styles={customStyles}
                            placeholder="Chọn thống kê"
                        />
                    </div>
                    <div className={cx('topProductContent')}>
                        {topCustomer?.length !== 0 &&
                            topCustomer?.map((item, index) => {
                                if (index < 6) {
                                    return (
                                        <div onClick={() => navigate(`/customer/${item.customer.id}`)} className={cx('topProductItem')}>
                                            <div
                                                className={cx('itemIcon')}
                                                style={{ background: colorBackground[index] }}
                                            >
                                                0{index + 1}
                                            </div>
                                            <div className={cx('itemName')}>
                                                <div className={cx('itemNameProduct')}>{item.customer.name}</div>
                                                <div className={cx('itemNameSKU')}>{item.customer.customerCode}</div>
                                            </div>
                                            <div className={cx('itemQuantity')}>
                                                {numeral(item.value).format('0,0')}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        {topCustomer.length === 0 && (
                            <div className={cx('listProductEmpty')}>Chưa có khách hàng mua hàng</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
