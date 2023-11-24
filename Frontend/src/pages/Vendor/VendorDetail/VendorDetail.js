import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import classNames from 'classnames/bind';
import numeral from 'numeral';
import moment from 'moment';
import styles from './VendorDetail.module.scss';
import { AuthContext } from '../../../contexts/AuthContex';
import { getVendorDetail } from '../../../services/vendorService/getVendorDetail';

const cx = classNames.bind(styles);

const columns = [
    {
        field: 'orderId',
        flex: 1.2,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Mã đơn nhập</span>,
        renderCell: (params) => (
            <span style={{ color: 'rgb(48, 159, 255)' }}>{'PON' + String(params.row.orderId).padStart(5, '0')}</span>
        ),
    },
    {
        field: 'staffName',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Người tạo</span>,
    },
    {
        field: 'formattedCreateAt',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Ngày tạo</span>,
    },
    {
        field: 'paymentStatus',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Trạng thái đơn</span>,
        renderCell: (params) =>
            params.row.paymentStatus === 'COMPLETE' ? (
                <span className={cx('complete-status')}>{'Đã thanh toán'}</span>
            ) : (
                <span className={cx('init-ship')}>{'Chưa thanh toán'}</span>
            ),
    },
    {
        field: 'amount',
        type: 'number',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Giá trị đơn</span>,
    },
    {
        field: 'isPaid',
        type: 'number',
        flex: 1.8,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Đã thanh toán</span>,
    },
    {
        field: 'methodPay',
        type: 'number',
        flex: 2,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Phương thức thanh toán</span>,
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const { vendorId } = useParams();
    const [paymentDTOList] = useState([]);
    const [result, setResult] = useState({
        createdAt: '',
        updatedAt: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        fax: '',
        tax: '',
        website:'',
        description:'',
        paymentDTOList,
        numberImportOrder: '',
        totalImportOrder: '',
        debt: '',
        status: '',
    });

    const { token } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Chi tiết nhà cung cấp';
        const fetchData = async () => {
            const res = await getVendorDetail(vendorId, token);
            console.log(res);
            setResult(res.data);
        };
        fetchData();
    }, [token, vendorId]);

    const modifiedResults = result.paymentDTOList.map((result) => {
        const {
            payId,
            amount,
            orderId,
            paymentMethod,
            orderType,
            paymentStatus,
            createdAt,
            updatedAt,
            importOrderDTO,
        } = result;

        const { staffName, shipmentStatus } = importOrderDTO;
        let methodPay = '';
        if (paymentMethod === 'TRANSFER') {
            methodPay = 'Chuyển khoản';
        } else if (paymentMethod === 'CASH') {
            methodPay = 'Tiền mặt';
        } else if (paymentMethod === 'CREDIT') {
            methodPay = 'Thẻ thanh toán';
        }
        const formattedCreateAt = moment(createdAt).format('DD/MM/YYYY HH:mm');
        const formattedUpdatedAt = moment(updatedAt).format('DD/MM/YYYY HH:mm');

        let isPaid = 0;
        if (paymentStatus === 'COMPLETE') {
            isPaid = amount;
        }

        return {
            ...result,
            payId,
            amount,
            orderId,
            methodPay,
            orderType,
            paymentStatus,
            formattedUpdatedAt,
            formattedCreateAt,
            staffName,
            shipmentStatus,
            isPaid,
        };
    });

    const code = 'SUPN' + String(result.id).padStart(5, '0');
    const formattedUpdateAt = moment(result.updatedAt).format('DD/MM/YYYY HH:mm');

    const handleRowClick = (params) => {
        navigate(`/detail_import_order/${params.row.orderId}`);
    };

    const handleOnUpdateVendor = () => {
        navigate(`/vendor_update/${vendorId}`);
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('header')}>
                <Button onClick={() => navigate('/vendor_list')} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                    Quay lại
                </Button>
                <div>
                    {/* <Button variant="outlined" color="error" onClick={handleOpenDialogConfirm}>
                        Xóa sản phẩm
                    </Button> */}
                    <Button variant="contained" onClick={handleOnUpdateVendor}>
                        Cập nhật thông tin
                    </Button>
                </div>
            </div>
            <div className={cx('rowHeader')}>
                <h4>{code}</h4>
                <p>{formattedUpdateAt}</p>
                <div className={cx('row-status')}>
                    {result.status === 'Hoàn thành' ? (
                        <span className={cx('complete-status')}>{'Hoàn thành'}</span>
                    ) : (
                        <span className={cx('init-pay')}>{'Đang giao dịch'}</span>
                    )}
                </div>
            </div>

            <div className={cx('content')}>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>Thông tin nhà cung cấp</span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoContentCol')}>
                                <div className={cx('personalInfoTitle')}>Tên khách hàng</div>
                                <div className={cx('personalInfoValue')}>
                                    : {result.name ? <strong>{result.name}</strong> : <span>---</span>}
                                </div>
                            </div>
                            <div className={cx('personalInfoContentCol2')}>
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
                            <div className={cx('personalInfoContentCol2')}>
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
                            <div className={cx('personalInfoContentCol2')}>
                                <div className={cx('personalInfoTitle')}>Tổng công nợ</div>
                                <div className={cx('personalInfoValue')}>
                                    :{' '}
                                    {result.debt ? (
                                        <span style={{ color: 'red' }}>{numeral(result.debt).format('0,0')}</span>
                                    ) : (
                                        <span>---</span>
                                    )}
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
                            <div className={cx('personalInfoTitle')}>Mã số thuế</div>
                            <div className={cx('personalInfoValue')}>
                                : {result.tax ? <span>{result.tax}</span> : <span>---</span>}
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Website</div>
                            <div className={cx('personalInfoValue')}>
                                : {result.website ? <span>{result.website}</span> : <span>---</span>}
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Số fax</div>
                            <div className={cx('personalInfoValue')}>
                                : {result.fax ? <span>{result.fax}</span> : <span>---</span>}
                            </div>
                        </div>

                        <div className={cx('personalInfoContentRow')}>
                            <div className={cx('personalInfoTitle')}>Mô tả</div>
                            <div className={cx('personalInfoValue')}>
                                : {result.description ? <span>{result.description}</span> : <span>---</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('table')}>
                <div style={{ width: '100%' }}>
                    <DataGrid
                        rows={modifiedResults}
                        getRowId={(row) => row.payId}
                        columns={columns}
                        pageSize={6}
                        className={cx('dataGrid')}
                        onRowClick={handleRowClick}
                        pageSizeOptions={[20, 50, 100]}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
