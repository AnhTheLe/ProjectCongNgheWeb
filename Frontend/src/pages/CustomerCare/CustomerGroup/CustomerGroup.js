import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerGroup.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { AuthContext } from '../../../contexts/AuthContex';
import * as CustomerServices from '../../../services/CustomerServices';
import moment from 'moment';
import { Box } from '@mui/material';

const cx = classNames.bind(styles);

// const columns = [
//     { field: 'customerCode', headerName: 'Mã khách hàng', width: 153 },
//     { field: 'clientName', headerName: 'Tên khách hàng', width: 204 },
//     { field: 'numberPhone', headerName: 'Số điện thoại', width: 160 },
//     { field: 'responseDate', headerName: 'Ngày phản hồi', width: 191 },
//     { field: 'responseContent', headerName: 'Nội dung phản hồi', width: 404 },
// ];

const columns = [
    {
        field: 'customerCode',
        width: 153,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã nhóm</span>,
    },
    {
        field: 'clientName',
        width: 204,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Tên nhóm</span>,
    },
    {
        field: 'numberPhone',
        width: 160,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Chiết khấu</span>,
    },
    {
        field: 'responseDate',
        width: 191,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Ngày tạo</span>,
    },
    {
        field: 'responseContent',
        width: 404,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mô tả</span>,
    },
];

function CustomerGroup() {
    const [buttonAllResponse, setButtonAllResponse] = useState(true);
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const [inputSearchCustomer, setInputSearchCustomer] = useState('');
    const [rows, setRows] = useState([]);

    const handleRowClick = (params) => {
        // alert(`Bạn đã nhấp vào hàng có ID: ${params.row.id}`);
        console.log(params.row);
        navigate(`/customer/${params.row.customerId}`);
    };
    // const handleRowClick = (params) => {
    //     // alert(`Bạn đã nhấp vào hàng có ID: ${params.row.id}`);
    //     console.log(params.row);
    //     navigate(`/customer_group/${params.row.customerId}`);
    // };

    const handleInputSearchChange = (e) => {
        setInputSearchCustomer(e.target.value);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.searchFeedback(inputSearchCustomer, token);
                setRows(
                    result.map((item) => {
                        return {
                            id: item.id,
                            customerId: item?.customer.id,
                            customerCode: item?.customer.customerCode,
                            clientName: item?.customer.name,
                            numberPhone: item?.customer.phone,
                            responseDate: moment(item.updatedAt || item.createdAt).format('DD/MM/YYYY HH:mm'),
                            responseContent: item.content,
                        };
                    }),
                );
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [inputSearchCustomer, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.getAllFeedback(1, 10, token);
                console.log('result', result);
                var resRows = result.map((item) => {
                    return {
                        id: item.id,
                        customerId: item?.customer.id,
                        customerCode: item?.customer.customerCode,
                        clientName: item?.customer.name,
                        numberPhone: item?.customer.phone,
                        responseDate: moment(item.updatedAt || item.createdAt).format('DD/MM/YYYY HH:mm'),
                        responseContent: item.content,
                    };
                });
                setRows(resRows);
            } catch (error) {
                console.log('fetchApi getAllFeedback CustomerGroup.js' + error);
            }
        };
        fetchApi();
    }, []);

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE')) {
        navigate('/403');
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('buttonAddNewGroup')}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/customer_group_create')}>
                    Thêm nhóm
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
                            placeholder="Tìm kiếm theo mã nhóm khách hàng, tên nhóm khách hàng"
                            value={inputSearchCustomer}
                            onChange={handleInputSearchChange}
                        ></input>
                    </div>
                </div>
            </div>
            <div className={cx('table')}>
                <div style={{ width: '100%' }}>
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
                            rows={rows}
                            columns={columns}
                            pageSize={6}
                            className={cx('dataGrid')}
                            onRowClick={handleRowClick}
                            pageSizeOptions={[20, 50, 100]}
                            sx={{ border: 'none', padding: '0 16px' }}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default CustomerGroup;
