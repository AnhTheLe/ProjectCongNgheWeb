import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerResponse.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

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
        renderHeader: () => <span>Mã khách hàng</span>,
        renderCell: (params) => <span style={{color: '#0088ff'}}>{params.row.customerCode}</span>,
    },
    {
        field: 'clientName',
        width: 204,
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
        field: 'responseDate',
        width: 191,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Ngày phản hồi</span>,
    },
    {
        field: 'responseContent',
        width: 404,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Nội dung phản hồi</span>,
    },
];

function CustomerResponse() {
    const [buttonAllResponse, setButtonAllResponse] = useState(true);
    const navigate = useNavigate();
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
        navigate(`/customer/${params.row.customerId}`);
    };

    const handleInputSearchChange = (e) => {
        setInputSearchCustomer(e.target.value);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await CustomerServices.searchFeedback(inputSearchCustomer, token);
                setRows(
                    result.data.map((item) => {
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
                const result = await CustomerServices.getAllFeedback(paginationModel.page + 1, paginationModel.pageSize, token);
                console.log('result', result);
                var resRows = result.data.map((item) => {
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
                setTotalItems(result.totalItems);
            } catch (error) {
                console.log('fetchApi getAllFeedback CustomerResponse.js' + error);
            }
        };
        fetchApi();
    }, [paginationModel.page, paginationModel.pageSize, token]);

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE')) {
        navigate('/403');
    }

    return (
        <div className={cx('wrap')}>
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
