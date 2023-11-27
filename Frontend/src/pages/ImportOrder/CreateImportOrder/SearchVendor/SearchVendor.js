import React, { useContext, useEffect, useState } from 'react';
import numeral from 'numeral';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './SearchVendor.module.scss';
import { AuthContext } from '../../../../contexts/AuthContex';

const cx = classNames.bind(styles);

function SearchVendor({ dataFromHeader, onVendor }) {
    const [result, setResult] = useState({
        createdAt: '',
        updatedAt: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        numberImportOrder: '',
        totalImportOrder: '',
        debt: '',
        status: '',
    });

    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log(dataFromHeader);
        if (dataFromHeader) {
            setResult(dataFromHeader);
        }
    }, [dataFromHeader]);

    return (
        <div className={cx('wrap')}>
            <div className={cx('content')}>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>Thông tin nhà cung cấp</span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Tên nhà cung cấp</div>
                                <div className={cx('personalInfoValue')}>
                                    : {result.name ? <strong>{result.name}</strong> : <span>---</span>}
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Tổng số đơn nhập</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {result.numberImportOrder ? (
                                        <span style={{ color: '#0088ff', fontWeight: '600' }}>
                                            {numeral(result.numberImportOrder).format('0,0')}
                                        </span>
                                    ) : (
                                        <span>---</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Địa chỉ</div>
                                <div className={cx('personalInfoValue')}>
                                    : {result.address ? <span>{result.address}</span> : <span>---</span>}
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Tổng giá trị nhập</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {result.totalImportOrder ? (
                                        <span>{numeral(result.totalImportOrder).format('0,0')}</span>
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
                                    : {result.phone > 0 ? <span>{result.phone}</span> : <span>---</span>}
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Tổng công nợ</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {result.debt ? <span>{numeral(result.debt).format('0,0')}</span> : <span>---</span>}
                                </div>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Email</div>
                                <div className={cx('personalInfoValue')}>
                                    : {result.email ? <span>{result.email}</span> : <span>---</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('purchaseInfo')}>
                    <div className={cx('purchaseInfoHeader')}>
                        <span>Thông tin bổ sung</span>
                    </div>
                    <div className={cx('purchaseInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Người phụ trách</div>
                            <div className={cx('personalInfoValue')}>
                                : {user.fullName ? <span>{user.fullName}</span> : <span>---</span>}
                            </div>
                        </div>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Bắt đầu tạo</div>
                            <div className={cx('personalInfoValue')}>
                                <span>: {moment().format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Trạng thái</div>
                            <div className={cx('personalInfoValue')}>
                                <span>: Đang tạo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchVendor;
