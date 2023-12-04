import React, { useEffect, useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/orderServices/getOrders';
import { AuthContext } from '../../contexts/AuthContex';

import classNames from 'classnames/bind';
import styles from './StaffList.module.scss';
import { getStaffs } from '../../services/staffService/getAllStaffs';
import { ROLE_NAME_MAPPER, WORKSTATUS_MAPPER } from '../../utils/constant';
import Chip from '@mui/material/Chip';

const cx = classNames.bind(styles);

const linkStyle = {
    textDecoration: 'none',
};

const chipStyles = {
    QUIT: {
        backgroundColor: 'rgb(255, 246, 246)',
        border: '1px solid rgb(255, 184, 184)',
        color: 'rgb(238, 71, 71)',
    },

    WORKING: {
        backgroundColor: 'rgb(243, 252, 249)',
        border: '1px solid rgb(159, 237, 207)',
        color: 'rgb(13, 180, 115)',
    },
};

const columns = [
    {
        field: 'id',
        width: 203,
        sortable: false,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell order-id',
        headerAlign: 'center',
        renderHeader: () => <span>Mã nhân viên</span>,
        renderCell: (params) => (
            <Link to={`/staffs/${params.value}`} style={linkStyle}>
                {params.value}
            </Link>
        ),
    },
    {
        field: 'fullName',
        width: 203,
        sortable: false,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Tên nhân viên</span>,
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
    },
    {
        field: 'workStatus',
        headerName: 'Trạng thái',
        width: 203,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Trạng thái</span>,
        renderCell: (params) => (
            <span>
                <Chip
                    label={WORKSTATUS_MAPPER[params.row.workStatus]}
                    variant="outlined"
                    sx={{ ...chipStyles[params.row.workStatus], fontWeight: 400 }}
                />
            </span>
        ),
    },
    {
        field: 'roles',
        headerName: 'Vai trò',
        width: 203,
        sortComparator: (d1, d2) => d1 - d2,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Vai trò</span>,
        renderCell: (params) => {
            return (
                <span style={{ textDecoration: 'underline' }}>
                    {params.row.roles.map((role) => ROLE_NAME_MAPPER[role.name]).join(', ')}
                </span>
            );
        },
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
        renderHeader: () => <span>Ngày tạo</span>,
        renderCell: (params) => <span>{moment(params.row.createdAt).format('DD/MM/YYYY')}</span>,
    },
];

function DataTable({ pageState, setPageState }) {
    const navigate = useNavigate();

    const handleRowClick = (params) => {
        navigate(`/staffs/${params.row.id}`);
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
                getRowId={(row) => row.id}
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

function StaffList() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [pageState, setPageState] = useState({
        page: 0,
        perPage: 5,
        totalItems: 0,
        totalPages: 0,
        data: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await getStaffs(pageState.page, pageState.perPage, token);
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

    return (
        <div className={cx('container')}>
            <Button
                variant="contained"
                sx={{ fontSize: 13, display: 'flex', gap: 1, alignSelf: 'flex-end' }}
                onClick={() => navigate('/staffs/create')}
            >
                <AddIcon sx={{ fontSize: 20 }} />
                <span>Thêm nhân viên khác</span>
            </Button>
            <div className={cx('table-container')}>
                <div className={cx('filters')}>
                    <div className={cx('headerSearch')}>
                        <div className={cx('inputSearch')}>
                            <SearchIcon className={cx('iconSearch')} />
                            <input placeholder="Tìm kiếm theo số điện thoại, tên nhân viên"></input>
                        </div>
                    </div>
                    <button className={cx('option')}>
                        Trạng thái
                        <ArrowDropDownIcon sx={{ color: '#ccc' }} />
                    </button>
                    <button className={cx('option')}>
                        Vai trò <ArrowDropDownIcon sx={{ color: '#ccc' }} />
                    </button>
                </div>
                <DataTable pageState={pageState} setPageState={setPageState} />
            </div>
        </div>
    );
}

export default StaffList;
