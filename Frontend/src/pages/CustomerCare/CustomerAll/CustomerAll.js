import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerAll.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import numeral from 'numeral';

import { AuthContext } from '../../../contexts/AuthContex';
import * as CustomerServices from '../../../services/CustomerServices';
import { Box } from '@mui/material';

const cx = classNames.bind(styles);

// const columns = [
//     { field: 'customerCode', headerName: 'Mã khách hàng', width: 153 },
//     { field: 'clientName', headerName: 'Tên khách hàng', width: 264 },
//     { field: 'numberPhone', headerName: 'Số điện thoại', width: 160 },
//     { field: 'customerGroup', headerName: 'Nhóm khách hàng', width: 191 },
//     { field: 'totalSpending', headerName: 'Tổng chi tiêu', width: 191 },
//     { field: 'totalOrder', headerName: 'Tổng SL đơn hàng', width: 160 },
// ];

const columns = [
    {
        field: 'customerCode',
        width: 153,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã khách hàng</span>,
        renderCell: (params) => <span style={{color: '#0088ff'}}>{params.row.customerCode}</span>,
    },
    {
        field: 'clientName',
        width: 230,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Tên khách hàng</span>,
    },
    {
        field: 'numberPhone',
        width: 160,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Số điện thoại</span>,
    },
    {
        field: 'customerGroup',
        width: 191,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Nhóm khách hàng</span>,
    },
    {
        field: 'totalSpending',
        width: 191,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Tổng chi tiêu</span>,
        renderCell: (params) => <span>{numeral(params.row.totalSpending).format(0, 0)}</span>,
    },
    {
        field: 'totalOrder',
        width: 160,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Tổng SL đơn hàng</span>,
        renderCell: (params) => <span>{numeral(params.row.totalOrder).format(0, 0)}</span>,
    },
];

function CustomerResponse() {
    const navigate = useNavigate();
    const [buttonAllResponse, setButtonAllResponse] = useState(true);
    const { token, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const [inputSearchCustomer, setInputSearchCustomer] = useState('');
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [totalItems, setTotalItems] = useState();

    const handleRowClick = (params) => {
        // alert(`Bạn đã nhấp vào hàng có ID: ${params.row.id}`);
        console.log(params.row);
        navigate(`/customer/${params.row.id}`);
    };

    const handleInputSearchChange = (e) => {
        setInputSearchCustomer(e.target.value);
    };

    

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.searchCustomerSpending(inputSearchCustomer, token);
                setRows(
                    result.data.map((item) => {
                        return {
                            id: item.customer.id,
                            customerCode: item.customer.customerCode,
                            clientName: item.customer.name,
                            numberPhone: item.customer.phone > 0 ? item.customer.phone : '',
                            customerGroup: 'Bán lẻ',
                            // totalSpending: numeral(item.totalAmount).format('0,0'),
                            // totalOrder: numeral(item.orderCount).format('0,0'),
                            totalSpending: item.totalAmount,
                            totalOrder: item.orderCount,
                        };
                    }),
                );
                setTotalItems(result.totalItems);
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [inputSearchCustomer, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.getAllCustomerBySpending(paginationModel.page + 1, paginationModel.pageSize, token);
                console.log('tat ca khach hang', result)
                setRows(
                    result.data.map((item) => {
                        return {
                            id: item.customer.id,
                            customerCode: item.customer.customerCode,
                            clientName: item.customer.name,
                            numberPhone: item.customer.phone > 0 ? item.customer.phone : '',
                            customerGroup: 'Bán lẻ',
                            // totalSpending: numeral(item.totalAmount).format('0,0'),
                            // totalOrder: numeral(item.orderCount).format('0,0'),
                            totalSpending: item.totalAmount,
                            totalOrder: item.orderCount,
                        };
                    }),
                );
                setTotalItems(result.totalItems);
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [paginationModel.page, paginationModel.pageSize, token]);

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE')) {
        navigate('/403');
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('buttonAddNewCustomer')}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/customer_create')}>
                    Tạo khách hàng
                </Button>
            </div>
            <div className={cx('header')}>
                <div className={cx('headerTitle')}>
                    <button className={cx({ active: buttonAllResponse })}>Tất cả phản hồi</button>
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')}>
                        <SearchIcon className={cx('iconSearch')} />
                        <input
                            placeholder="Tìm kiếm theo mã khách hàng, tên, SĐT khách hàng"
                            value={inputSearchCustomer}
                            onChange={handleInputSearchChange}
                        ></input>
                    </div>
                </div>
            </div>
            <div className={cx('table')}>
                <div style={{ width: '100%', textAlign: 'center !important' }}>
                    <Box
                        sx={{
                            height: 'fit-content',
                            width: '100%',
                            '& .super-app-theme--cell': {
                                display: 'flex !important',
                                justifyContent: 'center !important',
                            },
                            '& .order-id': {
                                
                                cursor: 'pointer',
                            },
                            '& .order-id:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <DataGrid
                            className={cx('dataGrid')}
                            rows={rows}
                            columns={columns}
                            onRowClick={handleRowClick}
                            rowCount={totalItems}
                            pageSizeOptions={[10, 20, 50]}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={setPaginationModel}
                            sx={{ border: 'none', padding: '0 16px' }}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default CustomerResponse;
