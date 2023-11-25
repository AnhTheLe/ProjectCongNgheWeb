import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import classNames from 'classnames/bind';
import styles from './PrintOrder.module.scss';
import numeral from 'numeral';
import { AuthContext } from '../../contexts/AuthContex';

const cx = classNames.bind(styles);

const PrintOrder = ({ componentRef, dayRequest, customer, dataArrayProduct, discount, totalPricePayment, selectedPayments }) => {
    const [data, setData] = useState({});
    const [staff, setStaff] = useState({});
    const { user } = useContext(AuthContext);


    useEffect(() => {
        // setStaff({
        //     name: 'Nguyễn Mạnh Phương',
        //     role: 'Nhân viên bán hàng',
        //     idStaff: 'NV00009',
        //     numberPhone: '0123456789',
        // });

        setData({
            totalProduct: 100,
            totalOrder: 10,
            revenue: 1000000,
        });
    }, [dayRequest]);

    return (
        <div>
            <ReactToPrint trigger={() => <button>Print this out!</button>} content={() => componentRef.current} />
            <div ref={componentRef}>
                <div className={cx('wrap')}>
                    <div className={cx('header')}>HÓA ĐƠN BÁN HÀNG</div>
                    <div className={cx('date')}>
                        <span>Ngày: {`${dayRequest.$D} - ${dayRequest.$M + 1} - ${dayRequest.$y}`}</span>
                    </div>
                    <div className={cx('divided')}></div>
                    <div className={cx('content')}>
                        <div className={cx('contentRow')}>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Khách hàng</div>
                                <div className={cx('itemValue')}>: {customer?.name || 'Khách lạ'}</div>
                            </div>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Số điện thoại</div>
                                <div className={cx('itemValue')}>: {customer?.phone}</div>
                            </div>
                        </div>

                        <div className={cx('contentRow')}>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Địa chỉ</div>
                                <div className={cx('itemValue')}>: {customer?.address}</div>
                            </div>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')}>Loại thanh toán</div>
                                <div className={cx('itemValue')}>: {selectedPayments?.label}</div>
                            </div>
                        </div>

                        <div className={cx('contentRow')}>
                            <div className={cx('contentCol')}>
                                <div className={cx('itemTitle')} style={{ maxWidth: '148px' }}>
                                    Nhân viên bán hàng
                                </div>
                                <div className={cx('itemValue')} style={{ marginLeft: '10px' }}>: {user.fullName}</div>
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
                                    {dataArrayProduct?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{item.sku}</td>
                                                <td>{item.name}</td>
                                                <td>{numeral(item.quantityPurchased).format('0,0')}</td>
                                                <td>{numeral(item.retailPrice).format('0,0')}</td>
                                                <td>{numeral(item.retailPrice * item.quantityPurchased).format('0,0')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Số lượng sản phẩm</div>
                                <div className={cx('itemValue')}>{numeral(dataArrayProduct?.reduce((acc, item) => acc + item.quantityPurchased, 0)).format('0,0')}</div>
                            </div>
                        </div>
                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Tổng tiền</div>
                                <div className={cx('itemValue')}>{numeral(dataArrayProduct?.reduce((acc, item) => acc + item.retailPrice * item.quantityPurchased, 0)).format('0,0')}</div>
                            </div>
                        </div>
                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>VAT(0%)</div>
                                {/* <div className={cx('itemValue')}>{numeral(dataArrayProduct?.reduce((acc, item) => acc + item.retailPrice * item.quantityPurchased, 0)/10).format('0,0')}</div> */}
                                <div className={cx('itemValue')}>0</div>
                            </div>
                        </div>
                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Chiết khấu</div>
                                <div className={cx('itemValue')}>{numeral(discount).format('0,0')}</div>
                            </div>
                        </div>
                        <div className={cx('contentOnlyRow')}>
                            <div className={cx('contentOnlyCol')}>
                                <div className={cx('itemTitle')}>Khách hàng thanh toán</div>
                                <div className={cx('itemValue')}>{numeral(totalPricePayment).format('0,0')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintOrder;
