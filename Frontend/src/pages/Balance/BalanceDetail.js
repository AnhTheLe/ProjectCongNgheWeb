import { Link, generatePath, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './BalanceDetail.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import moment from 'moment';
import { AuthContext } from '../../contexts/AuthContex';
import InputVariantTable from './InputVariantTable';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getDetailBalance } from '../../services/balancesManagerServices';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import routes from '../../config/routes';
const columns = [

    {
        field: 'index',
        headerName: 'STT',
        width: 60,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell quantity',
        headerAlign: 'center',
        renderHeader: () => <span style={{ paddingLeft: '10px' }}>ID Phiếu kiểm</span>,
        renderCell: (params) => params.rowIndex + 1,
    },

    {
        field: 'image',
        width: 250,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'center',
        renderHeader: () => <span>Tên sản phẩm</span>,
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
function BalanceDetail() {
    const [rows, setRows] = useState([]);
    const { token } = useContext(AuthContext)
    const [variantSelectedList, setVariantSelectedList] = useState([]);

    const [balance, setBalance] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDetailBalance(id, token);
                if (res.responseCode === 200) {
                    setBalance(res.data);
                    setVariantSelectedList(res.data.balanceVariantList)
                } else {
                    handleOpenAlert(res.response.message, 'error');
                }
            } catch (error) {

            }
        }
        fetchData();
    }, [])

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
    return (
        <>
            <div className={cx('wrap')}>
                <div className={cx('header')}>
                    <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                        Quay lại
                    </Button>
                </div>
                <div className={cx('balance-info')}>
                    <div className={cx('balance-info-title')}>
                        <span>Thông tin phiếu kiểm</span>
                    </div>
                    <div className={cx('balance-info-detail')}>
                        <div className={cx('balance-info-detail-row')}>
                            <span>ID Phiếu kiểm</span>
                            <span>: {balance.id ? balance.id : ''}</span>
                        </div>
                        <div className={cx('balance-info-detail-row')}>
                            <span>Nhân viên kiểm</span>
                            <span>: {balance.personInCharge ? balance.personInCharge : ''}</span>
                        </div>
                        <div className={cx('balance-info-detail-row')}>
                            <span>Ngày kiểm</span>
                            <span>: {moment(balance.createdAt).format('DD-MM-YYYY hh:mm:ss')}</span>
                        </div>
                        <div className={cx('balance-info-detail-row')}>
                            <span>Ghi chú</span>
                            <span>: {balance.note ? balance.note : ''}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('header-all-product')}>
                    <div className={cx('headerTitle')}>
                        <button className={cx({ 'active': true })}>Danh sách sản phẩm</button>
                    </div>
                </div>
                <div className={cx('table')}>
                    <div className={cx('table-header')}>
                        <div className={cx('stt-header')}>
                            <span>STT</span>
                        </div>
                        <div className={cx('image-header')}>
                            <span>Ảnh</span>
                        </div>
                        <div className={cx('name-header')}>
                            <span>Tên sản phẩm</span>
                        </div>
                        <div className={cx('quantity-header')}>
                            <span>Tồn kho hiện tại</span>
                        </div>
                        <div className={cx('real-header')}>
                            <span>Tồn thực tế</span>
                        </div>
                        <div className={cx('balance-header')}>
                            <span>Lệch</span>
                        </div>
                        <div className={cx('note-header')}>
                            <span>Ghi chú</span>
                        </div>
                    </div>
                    <div className={cx('table-content')}>
                        {variantSelectedList.map((variant, index) => (
                            <div className={cx('variant-item')}>
                                <div className={cx('stt')}>
                                    <span>{index}</span>
                                </div>
                                <div className={cx('image')}>
                                    {variant.variant.image ?
                                        <img src={variant.variant.image} alt={variant.variant.image} /> :
                                        <CropOriginalIcon />
                                    }
                                </div>
                                <div className={cx('name-sku')}>
                                    <span>{variant.variant.name}</span>
                                    <Link to={generatePath(routes.productDetail2, { id: variant.variant.baseId, variantId: variant.variant.id })}>{variant.variant.sku}</Link>
                                </div>
                                <div className={cx('quantity')}>
                                    <span>{variant.savedQ}</span>
                                </div>
                                <div className={cx('real-quantity')}>
                                    <span>{variant.realQ}</span>
                                </div>
                                <div className={cx('balance')}>
                                    <span>{variant.realQ - variant.savedQ}</span>
                                </div>
                                <div className={cx('note')}>
                                    <span>{variant.note}</span>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
                        {messageAlert}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
}

export default BalanceDetail;