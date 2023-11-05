import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import classNames from 'classnames/bind';
import styles from './PDFFile.module.scss';
import numeral from 'numeral';

import { AuthContext } from '../../contexts/AuthContex';
import * as OrderServices from '../../services/OrderServices';
import moment from 'moment';

const cx = classNames.bind(styles);

const PDFFile = ({ componentRef, dayRequest, dataStatistic }) => {
    const [staff, setStaff] = useState({});
    const [listOrder, setListOrder] = useState([]);
    const { token, user } = useContext(AuthContext);

    // useEffect(() => {
    //     setStaff({
    //         name: 'Nguyễn Mạnh Phương',
    //         role: 'Nhân viên bán hàng',
    //         idStaff: 'NV00009',
    //         numberPhone: '0123456789',
    //     });

    //     // setData({
    //     //     totalProduct: 100,
    //     //     totalOrder: 10,
    //     //     revenue: 1000000,
    //     // });
    // }, [dayRequest]);

    console.log('nhan vien statistic', user)

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.statisticalByTime(
                    moment(dayRequest.startDate).format('YYYY/MM/DD'),
                    moment(dayRequest.endDate).add(1, 'days').format('YYYY/MM/DD'),
                    token,
                );
                // console.log(moment(dayOrder.endDate).add(1, 'days').format('YYYY/MM/DD'));
                console.log('list order',result)
                setListOrder(result.data);
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [dayRequest.endDate, dayRequest.startDate, token]);

    return (
        <div>
            <ReactToPrint trigger={() => <button>Print this out!</button>} content={() => componentRef.current} />
            <div ref={componentRef}>
                <div className={cx('wrap')}>
                    <div className={cx('header')}>BÁO CÁO DOANH THU</div>
                    <div className={cx('date')}>
                        {dayRequest.startDate.toString() === dayRequest.endDate.toString() && (
                            <span>
                                Ngày:{' '}
                                {`${dayRequest.startDate.getDate()} - ${
                                    dayRequest.startDate.getMonth() + 1
                                } - ${dayRequest.startDate.getFullYear()}`}
                            </span>
                        )}
                        {dayRequest.startDate.toString() !== dayRequest.endDate.toString() && (
                            <span>
                                Từ ngày:{' '}
                                {`${dayRequest.startDate.getDate()} - ${
                                    dayRequest.startDate.getMonth() + 1
                                } - ${dayRequest.startDate.getFullYear()}`}{' '}
                                - Tới ngày{' '}
                                {`${dayRequest.endDate.getDate()} - ${
                                    dayRequest.endDate.getMonth() + 1
                                } - ${dayRequest.endDate.getFullYear()}`}
                            </span>
                        )}
                    </div>
                    <div className={cx('divided')}></div>
                    <div className={cx('content')}>
                        <div className={cx('contentRow')}>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Nhân viên phụ trách</div>
                                <div className={cx('itemValue')}>: {user.fullName}</div>
                            </div>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Vị trí</div>
                                <div className={cx('itemValue')}>: Nhân viên bán hàng</div>
                            </div>
                        </div>

                        <div className={cx('contentRow')}>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Ngày sinh</div>
                                <div className={cx('itemValue')}>: {moment(user.dob).format('DD/MM/YYYY')}</div>
                            </div>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Số điện thoại</div>
                                <div className={cx('itemValue')}>: {user.phone}</div>
                            </div>
                        </div>
                        <div className={cx('divided')}></div>

                        <div className={cx('table')}>
                            <table style={{ width: '85%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã hàng</th>
                                        <th>Tên hàng</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listOrder?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{item.variant.sku}</td>
                                                <td>{item.variant.name}</td>
                                                <td>{numeral(item.quantity).format('0,0')}</td>
                                                <td>{numeral(item.price).format('0,0')}</td>
                                                <td>{numeral(item.price * item.quantity).format('0,0')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Số lượng sản phẩm bán được</div>
                                {/* <div className={cx('itemValue')}>{numeral(dataStatistic?.orderStatistical.numberProductsSold).format('0,0')}</div> */}
                                <div className={cx('itemValue')}>{numeral(listOrder?.reduce((acc, item) => acc + item.quantity, 0)).format('0,0')}</div>
                            </div>
                        </div>
                        {/* <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Số lượng đơn hàng</div>
                                <div className={cx('itemValue')}>{numeral(dataStatistic?.orderStatistical.orderNumber).format('0,0')}</div>
                            </div>
                        </div> */}
                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Doanh thu</div>
                                {/* <div className={cx('itemValue')}>{numeral(dataStatistic?.orderStatistical.revenue).format('0,0')}</div> */}
                                <div className={cx('itemValue')}>{numeral(listOrder?.reduce((acc, item) => acc + item.price * item.quantity, 0)).format('0,0')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFFile;
