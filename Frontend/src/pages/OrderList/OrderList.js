import React, { useEffect, useState, useContext, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './OrderList.module.scss';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { PAYMENT_STATUS } from '../../utils/constant';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { getOrders } from '../../services/orderServices/getOrders';
import { AuthContext } from '../../contexts/AuthContex';
import Tooltip from '@mui/material/Tooltip';
import numeral from 'numeral';
import Popper from '@mui/material/Popper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';

const cx = classNames.bind(styles);

const chipStyles = {
    INIT: {
        backgroundColor: 'rgb(255, 247, 231)',
        border: '1px solid rgb(255, 223, 155)',
        color: 'rgb(228, 156, 6)',
    },

    COMPLETE: {
        backgroundColor: 'rgb(243, 252, 249)',
        border: '1px solid rgb(159, 237, 207)',
        color: 'rgb(13, 180, 115)',
    },
};

const linkStyle = {
    textDecoration: 'none',
};

const columns = [
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
                {`SON000${params.value}`}
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
        field: 'paymentStatus',
        headerName: 'Trạng thái thanh toán',
        width: 203,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Trạng thái thanh toán</span>,
        renderCell: (params) => {
            if (params.row.paymentStatus === PAYMENT_STATUS.INIT) {
                return (
                    <Tooltip title="Chưa thanh toán">
                        <Chip
                            label={params.row.paymentStatus === PAYMENT_STATUS.INIT ? 'Đang giao dịch' : 'Hoàn thành'}
                            variant="outlined"
                            sx={{ ...chipStyles[params.row.paymentStatus], fontWeight: 400 }}
                        />
                    </Tooltip>
                );
            }

            return (
                <Tooltip title="Đã thanh toán toàn bộ">
                    <Chip
                        label={params.row.paymentStatus === PAYMENT_STATUS.INIT ? 'Đang giao dịch' : 'Hoàn thành'}
                        variant="outlined"
                        sx={{ ...chipStyles[params.row.paymentStatus], fontWeight: 400 }}
                    />
                </Tooltip>
            );
        },
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
        renderCell: (params) => <span>{numeral(params.row.amount).format(0, 0)}</span>,
    },
];

function DataTable({ pageState, setPageState }) {
    const navigate = useNavigate();

    const handleRowClick = (params) => {
        navigate(`/order/${params.row.orderId}`);
    };

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
                onRowClick={handleRowClick}
                getRowId={(row) => row.orderId}
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

function OrderList() {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const [pageState, setPageState] = useState({
        page: 0,
        perPage: 5,
        totalItems: 0,
        totalPages: 0,
        data: [],
    });
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [checkboxes, setCheckboxes] = useState({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
    });

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        setCheckboxes({
            ...checkboxes,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleOutsideClick = useCallback(
        (event) => {
            if (anchorEl && anchorEl.contains(event.target)) {
                // Click is inside the Popper, do nothing
                return;
            }

            setOpen(false);
        },
        [anchorEl],
    );

    const handlePopperClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [anchorEl, handleOutsideClick]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrders(pageState.page, pageState.perPage, search, token);
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
    }, [pageState.page, pageState.perPage, token, search]);

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE')) {
        navigate('/403');
    }

    return (
        <div className={cx('container')}>
            <Button
                variant="contained"
                sx={{ fontSize: 13, display: 'flex', gap: 1, alignSelf: 'flex-end' }}
                onClick={() => navigate('/sales_counter')}
            >
                <AddIcon sx={{ fontSize: 20 }} />
                <span>Tạo đơn hàng</span>
            </Button>
            <div className={cx('table-container')}>
                <div className={cx('filters')}>
                    <div className={cx('headerSearch')}>
                        <div className={cx('inputSearch')}>
                            <SearchIcon className={cx('iconSearch')} />
                            <input
                                placeholder="Tìm kiếm theo mã đơn hàng, tên, số điện thoại KH"
                                value={search}
                                onChange={handleSearchChange}
                            ></input>
                        </div>
                    </div>
                    <button className={cx('option')} onClick={handlePopperClick}>
                        Trạng thái
                        <ArrowDropDownIcon sx={{ color: '#ccc' }} />
                    </button>
                    <Popper open={open} anchorEl={anchorEl}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkboxes.checkbox1}
                                        onChange={handleCheckboxChange}
                                        name="checkbox1"
                                    />
                                }
                                label="Checkbox 1"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkboxes.checkbox2}
                                        onChange={handleCheckboxChange}
                                        name="checkbox2"
                                    />
                                }
                                label="Checkbox 2"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkboxes.checkbox3}
                                        onChange={handleCheckboxChange}
                                        name="checkbox3"
                                    />
                                }
                                label="Checkbox 3"
                            />
                        </FormGroup>
                        <Button variant="contained">Lọc</Button>
                    </Popper>
                    <button className={cx('option')}>
                        Nhân viên phụ trách <ArrowDropDownIcon sx={{ color: '#ccc' }} />
                    </button>
                </div>
                <DataTable pageState={pageState} setPageState={setPageState} />
            </div>
        </div>
    );
}

export default OrderList;
