import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './BalanceList.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getListBalance, searchBalance } from '../../services/balancesManagerServices';
import { Box, Button } from '@mui/material';
import routesConfig from '../../config/routes';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import { AuthContext } from '../../contexts/AuthContex';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// const columns = [
//     { field: 'id', headerName: 'ID Sản phẩm', width: 153 },
//     { field: 'name', headerName: 'Tên sản phẩm', width: 191 },
//     { field: 'label', headerName: 'Nhãn sản phẩm', width: 204 },
//     { field: 'variantNumber', headerName: 'Số phiên bản', width: 160 },
//     { field: 'quantity', headerName: 'Tồn kho', width: 204 },
//     { field: 'createdAt', headerName: 'Ngày tạo', width: 250 },
// ];
const columns = [

    {
        field: 'id',
        headerName: 'ID Phiếu kiểm',
        width: 250,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell quantity',
        headerAlign: 'center',
        renderHeader: () => <span style={{ paddingLeft: '10px' }}>ID Phiếu kiểm</span>,
        renderCell: (params) => <span style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>{params ? params.row.id : ''}</span>
    },

    {
        field: 'createdAt',
        width: 250,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Ngày tạo</span>,
        renderCell: (params) => <span>{moment(params.row.createdAt).format('DD-MM-YYYY h:mm')}</span>,
    },
    {
        field: 'personInCharge',
        headerName: 'Nhân viên tạo',
        width: 250,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Nhân viên tạo</span>,
        renderCell: (params) => <span>{params ? params.row.personInCharge : ''}</span>

    },
    {
        field: 'note',
        headerName: 'Ghi chú',
        width: 300,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Ghi chú</span>,
        renderCell: (params) => <span>{params ? params.row.note : ''}</span>

    }

];
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const cx = classNames.bind(styles);
function BalanceList() {
    const [rows, setRows] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const [totalPages, setTotalPages] = useState();
    const { token, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const [buttonAllResponse, setButtonAllResponse] = useState(true);
    const [keyword, setKeyword] = useState('');

    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const fetchData = async (paginationModel) => {
        try {
            const res = await getListBalance(paginationModel, token);
            setRows(res.data);
            setTotalItems(res.totalItems);
            setTotalPages(res.totalPages);
        } catch (error) {
        }
    }

    const searchData = async (keyword) => {
        try {
            const res = await searchBalance(keyword, token);
            setRows(res.data)
        } catch (error) {

        }
    }
    //
    const [open, setOpen] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState('');
    const handleOpenAlert = (messageAlert, typeAlert) => {
        setMessageAlert(messageAlert);
        setTypeAlert(typeAlert);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    //
    useEffect(() => {
        document.title = "Danh sách kiểm hàng"
        fetchData(paginationModel);
    }, [paginationModel.page, paginationModel.pageSize])

    const handleRowClick = (event) => {
        const wbalanceId = event.row.id;
        navigate(`/admin/balances/${wbalanceId}`);
    }

    const handleOnClickAddNewProduct = () => {
        navigate(routesConfig.balancesCreate)
    }

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'WAREHOUSE')) {
        navigate('/403');
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('header')}>
                <div>
                    <Button variant="contained" onClick={handleOnClickAddNewProduct}>
                        Tạo phiếu kiểm
                    </Button>
                </div>
            </div>
            <div className={cx('header-all-product')}>
                <div className={cx('headerTitle')}>
                    <button className={cx({ 'active': buttonAllResponse })} onClick={() => fetchData(paginationModel)}>Tất cả phiếu kiểm</button>
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')}>
                    <button>
                            <SearchIcon className={cx('iconSearch')} />
                        </button>
                        <input placeholder="Tìm kiếm theo Id và tên nhân viên" onChange={(e) => searchData(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') searchData(keyword)
                            }}
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
                            '& .quantity': {
                                paddingLeft: '30px',
                            },
                            '& .variant-number': {
                                paddingLeft: '50px',
                            },
                            '& .super-app-theme--cell': {
                                display: 'flex !important',
                                justifyContent: 'center !important',
                            }
                        }}
                    >
                        <DataGrid
                            className={cx('dataGrid')}
                            rows={rows}
                            columns={columns}
                            rowCount={totalItems}
                            pageSizeOptions={[5, 10, 20]}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={setPaginationModel}
                            onRowClick={handleRowClick}
                        />
                    </Box>
                </div>
            </div>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                        {messageAlert}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}

export default BalanceList;