import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';

import classNames from 'classnames/bind';
import styles from './OrderReturnList.module.scss';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContex';
import { getReturnOrders } from '../../services/orderServices/getReturnOrders';
import { getOrders } from '../../services/orderServices/getOrders';

const cx = classNames.bind(styles);

const linkStyle = {
    textDecoration: 'none',
};

const columns = [
    {
        field: 'returnOrderId',
        width: 174,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã đơn trả hàng</span>,
        renderCell: (params) => (
            <Link to={`/order_returns/${params.value}`} style={linkStyle}>
                {`SRN000${params.value}`}
            </Link>
        ),
    },
    {
        field: 'baseOrderId',
        headerName: 'Mã đơn hàng',
        width: 174,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã đơn hàng</span>,
        renderCell: (params) => (
            <Link to={`/order/${params.value}`} style={linkStyle}>
                {`SON000${params.value}`}
            </Link>
        ),
    },
    {
        field: 'swapOrderId',
        headerName: 'Mã đơn đổi hàng',
        width: 174,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã đơn đổi hàng</span>,
        renderCell: (params) => (
            <Link to={`/order/${params.value}`} style={linkStyle}>
                {params.value && `SON000${params.value}`}
            </Link>
        ),
    },
    {
        field: 'customerName',
        headerName: 'Khách hàng',
        width: 174,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Khách hàng</span>,
    },
    {
        field: 'amount',
        headerName: 'Tổng tiền',
        width: 174,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Tổng tiền</span>,
    },
    {
        field: 'createdAt',
        headerName: 'Ngày nhận hàng',
        width: 174,
        filterable: false,
        sortComparator: (d1, d2) => {
            if (moment(d1).isAfter(d2)) {
                return 1;
            }
            return -1;
        },
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Ngày nhận hàng</span>,
        renderCell: (params) => <span>{moment(params.row.createdAt).format('DD/MM/YYYY')}</span>,
    },
    {
        field: 'reason',
        headerName: 'Lý do trả hàng',
        width: 174,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Lý do trả hàng</span>,
        renderCell: (params) => <span>Hàng hỏng</span>,
    },
];

const orderColumns = [
    {
        field: 'orderId',
        width: 203,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã đơn hàng</span>,
        renderCell: (params) => (
            <Link to={`/order/${params.value}`} style={linkStyle}>
                {params.value}
            </Link>
        ),
    },
    {
        field: 'createdAt',
        width: 203,
        sortComparator: (d1, d2) => {
            if (moment(d1).isAfter(d2)) {
                return 1;
            }
            return -1;
        },
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Ngày tạo đơn</span>,
        renderCell: (params) => <span>{moment(params.row.createdAt).format('DD/MM/YYYY')}</span>,
    },
    {
        field: 'customerName',
        width: 203,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Tên khách hàng</span>,
    },
    {
        field: 'phone',
        width: 203,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Số điện thoại</span>,
        renderCell: (params) => (params.row.phone === '-1' ? <span></span> : <span>{params.row.phone}</span>),
    },
    {
        field: 'amount',
        headerName: 'Tổng tiền',
        width: 203,
        sortComparator: (d1, d2) => d1 - d2,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Tổng tiền</span>,
    },
    {
        field: 'operation',
        headerName: 'Thao tác',
        width: 203,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Thao tác</span>,
        renderCell: (params) => (
            <Link to={`/order_returns/create?order_id=${params.id}`} style={linkStyle}>
                <span style={{ fontWeight: 600, color: '#0088ff', cursor: 'pointer' }}>Đổi trả</span>
            </Link>
        ),
    },
];

function ChooseOrderModal({ open, handleClose, token }) {
    const [orderPageState, setOrderPageState] = useState({
        page: 0,
        perPage: 5,
        totalItems: 0,
        totalPages: 0,
        data: [],
    });
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrders(orderPageState.page, orderPageState.perPage, search, token);
            setOrderPageState((old) => ({
                ...old,
                page: response.page,
                perPage: response.perPage,
                totalItems: response.totalItems,
                totalPages: response.totalPages,
                data: response.data,
            }));
        };
        fetchData();
    }, [orderPageState.page, orderPageState.perPage, search, token]);

    const handleOrderSearchChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className={cx('personalInfo')}>
                <div className={cx('personalInfoHeader')}>
                    <h5>Chọn đơn hàng để trả</h5>
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')}>
                        <SearchIcon className={cx('iconSearch')} />
                        <input
                            placeholder="Tìm kiếm theo mã đơn hàng, tên, số điện thoại KH"
                            value={search}
                            onChange={handleOrderSearchChange}
                        ></input>
                    </div>
                </div>
                <Box
                    sx={{
                        height: '380px',
                        width: '100%',
                        '& .super-app-theme--cell': {
                            display: 'flex !important',
                            justifyContent: 'center !important',
                        },
                        '& .order-id': {
                            color: '#0088FF',
                            cursor: 'pointer',
                        },
                        '& .order-id:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    <DataGrid
                        getRowId={(row) => row.orderId}
                        rows={orderPageState.data}
                        rowCount={orderPageState.totalItems}
                        columns={orderColumns}
                        pagination
                        pageSizeOptions={[5, 10]}
                        disableColumnSelector={true}
                        disableRowSelectionOnClick={true}
                        paginationMode="server"
                        paginationModel={{ page: orderPageState.page, pageSize: orderPageState.perPage }}
                        onPaginationModelChange={(paginationModel) => {
                            setOrderPageState({
                                ...orderPageState,
                                page: paginationModel.page,
                                perPage: paginationModel.pageSize,
                            });
                        }}
                    />
                </Box>
            </div>
        </Modal>
    );
}

function DataTable({ pageState, setPageState }) {
    return (
        <Box
            sx={{
                height: 'fit-content',
                width: '100%',
                '& .super-app-theme--cell': {
                    display: 'flex !important',
                    justifyContent: 'center !important',
                },
                '& .order-id': {
                    color: '#0088FF',
                    cursor: 'pointer',
                },
                '& .order-id:hover': {
                    textDecoration: 'underline',
                },
            }}
        >
            <DataGrid
                getRowId={(row) => row.returnOrderId}
                rows={pageState.data}
                rowCount={pageState.totalItems}
                columns={columns}
                pagination
                pageSizeOptions={[5, 10]}
                disableColumnSelector={true}
                disableRowSelectionOnClick={true}
                paginationMode="server"
                paginationModel={{ page: pageState.page, pageSize: pageState.perPage }}
                onPaginationModelChange={(paginationModel) => {
                    setPageState({
                        ...pageState,
                        page: paginationModel.page,
                        perPage: paginationModel.pageSize,
                    });
                }}
            />
        </Box>
    );
}

function OrderReturnList() {
    const { token, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [pageState, setPageState] = useState({
        page: 0,
        perPage: 5,
        totalItems: 0,
        totalPages: 0,
        data: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await getReturnOrders(pageState.page, pageState.perPage, token);
            setPageState((old) => ({
                ...old,
                page: response.page,
                perPage: response.perPage,
                totalItems: response.totalItems,
                totalPages: response.totalPages,
                data: response.data,
            }));
        };
        fetchData();
    }, [pageState.page, pageState.perPage, token]);

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE')) {
        navigate('/403');
    }

    return (
        <div className={cx('container')}>
            <ChooseOrderModal open={open} handleClose={handleClose} token={token} />
            <Button
                variant="contained"
                sx={{ fontSize: 13, display: 'flex', gap: 1, alignSelf: 'flex-end' }}
                onClick={handleOpen}
            >
                <AddIcon sx={{ fontSize: 20 }} />
                <span>Tạo đơn trả hàng</span>
            </Button>
            <div className={cx('table-container')}>
                <div className={cx('filters')}>
                    <div className={cx('headerSearch')}>
                        <div className={cx('inputSearch')}>
                            <SearchIcon className={cx('iconSearch')} />
                            <input placeholder="Tìm kiếm theo mã đơn hàng, đơn trả, tên, số điện thoại KH"></input>
                        </div>
                    </div>
                    <button className={cx('option')}>
                        Nhân viên trả hàng <ArrowDropDownIcon sx={{ color: '#ccc' }} />
                    </button>
                    <button className={cx('option')}>
                        Lý do trả hàng <ArrowDropDownIcon sx={{ color: '#ccc' }} />
                    </button>
                </div>
                <DataTable pageState={pageState} setPageState={setPageState} />
            </div>
        </div>
    );
}

export default OrderReturnList;
