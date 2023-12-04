import { useNavigate} from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ImportOrderList.module.scss';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { SearchIcon} from '../../../components/Icons';
import { AuthContext } from '../../../contexts/AuthContex';
import React, { useContext } from 'react';
import { getListImportOrder } from '../../../services/importServices/getImportOrderList';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import moment from 'moment';

const cx = classNames.bind(styles);

const columns = [
    {
        field: 'id',
        flex: 1,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Mã đơn hàng</span>,
        renderCell: (params) => (
            <span style={{ color: 'rgb(48, 159, 255)' }}>{'PON' + String(params.row.id).padStart(5, '0')}</span>
        ),
    },
    {
        field: 'updatedAt',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Ngày nhập đơn</span>,
        renderCell: (params) => <span>{moment(params.row.updatedAt).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
        field: 'name',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Nhà cung cấp</span>,
    },
    {
        field: 'shipmentStatus',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Trạng thái nhập</span>,
        renderCell: (params) =>
            params.row.shipmentStatus === 'ARRIVED' ? (
                <span className={cx('complete-status')}>{'Đã nhập'}</span>
            ) : (
                <span className={cx('init-ship')}>{'Chưa nhập'}</span>
            ),
    },
    {
        field: 'paymentStatus',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Trạng thái thanh toán</span>,
        renderCell: (params) =>
            params.row.paymentStatus === 'COMPLETE' ? (
                <span className={cx('complete-status')}>{'Hoàn thành'}</span>
            ) : (
                <span className={cx('init-pay')}>{'Đang giao dịch'}</span>
            ),
    },
    {
        field: 'amount',
        type: 'number',
        flex: 1.6,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Tổng giá trị</span>,
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);

    const [results, setResult] = useState([]);
    const [records, setRecord] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        document.title = 'Danh sách đơn nhập hàng';
        const fetchData = async () => {

                const res = await getListImportOrder(token);
                console.log(res);
                if (res) {
                    setResult(res.data);
                }
                
        }
        fetchData();
    }, [token]);


    function handleFilter(event) {
        const keyword = event.target.value.toLowerCase();
        setSearchValue(keyword);

    }

    const handleRowClick = (params) => {
        navigate(`/detail_import_order/${params.row.id}`);
    };

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'WAREHOUSE')) {
        navigate('/403');
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('buttonAddNewCustomer')}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create_import_order')}>
                Tạo đơn nhập hàng
                </Button>
            </div>
            <div className={cx('header')}>
                <div className={cx('headerTitle')}>
                    <button className={cx({ active: true })}>Tất cả đơn hàng</button>
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')}>
                        <SearchIcon className={cx('iconSearch')} />
                        <input
                            placeholder="Tìm mã đơn nhập hàng, tên, SĐT NCC"
                            onChange={handleFilter}
                            value={searchValue}
                        ></input>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Dashboard;
