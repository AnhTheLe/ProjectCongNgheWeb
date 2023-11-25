import React, { useContext,  useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import classNames from 'classnames/bind';
import moment from 'moment';
import styles from './VendorList.module.scss';
import {SearchIcon} from '../../../components/Icons';
import { AuthContext } from '../../../contexts/AuthContex';
import { getListVendor } from '../../../services/vendorService/getListVendor';

const cx = classNames.bind(styles);

const columns = [
    {
        field: 'id',
        flex: 1.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Mã nhà cung cấp</span>,
        renderCell: (params) => (
            <span style={{ color: 'rgb(48, 159, 255)' }}>{'SUPN' + String(params.row.id).padStart(5, '0')}</span>
        ),
    },
    {
        field: 'name',
        flex: 1.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Tên nhà cung cấp</span>,
    },
    {
        field: 'createdAt',
        flex: 1.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Ngày nhập đơn</span>,
        renderCell: (params) => <span>{moment(params.row.createdAt).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
        field: 'email',
        flex: 1.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Email</span>,
    },
    {
        field: 'phone',
        flex: 1.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Số điện thoại</span>,
    },
    {
        field: 'status',
        flex: 1.5,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => <span>Trạng thái giao dịch</span>,
        renderCell: (params) =>
            params.row.status === 'Hoàn thành' ? (
                <span className={cx('complete-status')}>{'Hoàn thành'}</span>
            ) : (
                <span className={cx('init-pay')}>{'Đang giao dịch'}</span>
            ),
    },
];

function Dashboard() {
    const navigate = useNavigate();

    const handleRowClick = (params) => {
        navigate(`/vendor_detail/${params.row.id}`);
    };

    const [results, setResult] = useState([]);
    const [records, setRecord] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Danh sách nhà cung cấp';
        const fetchData = async () => {
            const resVendor = await getListVendor(token);
            if (resVendor)
            setResult(resVendor);
        };

        fetchData();
    }, [token]);

    const modifiedResults = results.slice().reverse().map((result) => {
        const { id, name, address, email, phone, paymentStatus } = result;
        const code = 'SUPN' + String(id).padStart(5, '0');

        return {
            ...result,
            id,
            code,
            name,
            address,
            email,
            phone,
            paymentStatus,
        };
    });

    function handleFilter(event) {
        const keyword = event.target.value.toLowerCase();
        setSearchValue(keyword);

        if (keyword === '') {
            setRecord(modifiedResults);
        } else {
            const filteredResults = modifiedResults.filter((result) => {
                return (
                    result.name.toLowerCase().includes(keyword) ||
                    result.phone.includes(keyword) ||
                    result.code.toLowerCase().includes(keyword)
                );
            });
            setRecord(filteredResults);
        }
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('buttonAddNewCustomer')}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create_vendor')}>
                    Thêm nhà cung cấp
                </Button>
            </div>
            <div className={cx('header')}>
                <div className={cx('headerTitle')}>
                    <button className={cx({ active: true })}>Tất cả nhà cung cấp</button>
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')}>
                        <SearchIcon className={cx('iconSearch')} />
                        <input
                            placeholder="Tìm mã nhà cung cấp, SĐT, tên nhà cung cấp"
                            onChange={handleFilter}
                            value={searchValue}
                        ></input>
                    </div>
                </div>
            </div>
            <div className={cx('table')}>
                <div style={{ width: '100%' }}>
                    <DataGrid
                        rows={searchValue === '' ? modifiedResults : records}
                        columns={columns}
                        pageSize={6}
                        className={cx('dataGrid')}
                        onRowClick={handleRowClick}
                        pageSizeOptions={[10, 20, 50, 100]}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
