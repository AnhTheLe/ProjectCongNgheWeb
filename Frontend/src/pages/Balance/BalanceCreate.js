import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './BalanceCreate.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import moment from 'moment';
import { AuthContext } from '../../contexts/AuthContex';
import InputVariantTable from './InputVariantTable';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { createBalance } from '../../services/balancesManagerServices'
import routesConfig from '../../config/routes';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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
function BalanceCreate() {
    const [rows, setRows] = useState([]);
    const { token } = useContext(AuthContext)
    const [buttonAllResponse, setButtonAllResponse] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [variantSelectedList, setVariantSelectedList] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [note, setNote] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState('');

    const navigate = useNavigate();

    const handleClickInputSearch = () => {
        if (openPopup) {
            setKeyword('')
        }
        setOpenPopup(!openPopup)

    }

    const handleAddVariants = (variantsSelected) => {
        let newVariantSelectedList = [...variantSelectedList];
        for (let i = 0; i < variantsSelected.length; i++) {
            const isVariantSelected = variantSelectedList.some((item) => item.id === variantsSelected[i].id);

            if (!isVariantSelected) {
                const newVariant = {
                    ...variantsSelected[i],
                    variantId: variantsSelected[i].id,
                    realQ: variantsSelected[i].quantity,
                    note: ''
                }
                newVariantSelectedList.push(newVariant)
            }

        }
        setVariantSelectedList(newVariantSelectedList);

    }


    const handleDeleteVariant = (variant) => {
        const index = variantSelectedList.findIndex((item) => item.id === variant.id);
        if (index !== -1) {
            const newVariantSelectedList = [...variantSelectedList];
            newVariantSelectedList.splice(index, 1);
            setVariantSelectedList(newVariantSelectedList);
        }
    }
    const handleChangeInput = (variant, key, value) => {
        const index = variantSelectedList.findIndex((item) => item.id === variant.id);
        if (index !== -1) {
            const newVariantSelectedList = [...variantSelectedList];
            const variantNew = { ...newVariantSelectedList[index], [key]: value }
            newVariantSelectedList[index] = variantNew;
            setVariantSelectedList(newVariantSelectedList);
        }
    }

    const handleClickBalance = async () => {
        const balances = {
            note: note,
            balanceVariantList: variantSelectedList
        }
        try {
            const res = await createBalance(balances, token);
            if (res.responseCode === 200) {
                handleOpenAlert('Đã cân bằng kho', 'success');
                setTimeout(() => {
                    
                    navigate(routesConfig.balancesList)
                }, 800);
            } else {
                handleOpenAlert(res.response.data.message, 'error');
            }
        } catch (error) {

        }
    }

    //
    const [open, setOpen] = useState(false);

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
                    <div>
                        <Button variant="contained" onClick={() => handleClickBalance()}>
                            Cân bằng kho
                        </Button>
                    </div>
                </div>
                <div className={cx('text-note')}>
                    <div className={cx('text-note-header')}>
                        Ghi chú:
                    </div>
                    <div>
                        <textarea rows="6" cols="100" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                    </div>
                </div>
                <div className={cx('header-all-product')}>
                    <div className={cx('headerTitle')}>
                        <button className={cx({ 'active': buttonAllResponse })}>Phiếu kiểm</button>
                    </div>
                    <div className={cx('headerSearch')}>
                        <div className={cx('inputSearch')}>

                            <input placeholder="Tìm kiếm sản phẩm" onClick={() => handleClickInputSearch()} onChange={(e) => setKeyword(e.target.value)} />
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    handleClickInputSearch()
                                }}
                            >
                                Chọn nhiều
                            </button>
                        </div>
                    </div>
                    <div className={cx('InputVariantTable')}>
                        <div className='popup-input-varant'>

                            {openPopup ? <InputVariantTable onInputSearchChange={keyword} openPopup={openPopup} onClosePopup={handleClickInputSearch} onAddVariantList={(data) => handleAddVariants(data)} height={'350px'} width={'500px'} /> : ''}
                        </div>

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
                                    {variant.image ?
                                        <img src={variant.image} alt={variant.image} /> :
                                        <CropOriginalIcon />
                                    }
                                </div>
                                <div className={cx('name-sku')}>
                                    <span>{variant.name}</span>
                                    <a href="http://localhost:3000/admin/base-products">{variant.sku}</a>
                                </div>
                                <div className={cx('quantity')}>
                                    <span>{variant.quantity}</span>
                                </div>
                                <div className={cx('real-quantity')}>
                                    <input type="number" value={variant.realQ} onChange={(e) => handleChangeInput(variant, 'realQ', e.target.value)} />
                                </div>
                                <div className={cx('balance')}>
                                    <span>{variant.realQ - variant.quantity}</span>
                                </div>
                                <div className={cx('note')}>
                                    <input type="text" value={variant.note} placeholder='Nhập ghi chú' onChange={(e) => handleChangeInput(variant, 'note', e.target.value)} />
                                </div>
                                <div>
                                    <Button className={cx('delete-button')} variant="text" startIcon={<ClearIcon />} onClick={() => handleDeleteVariant(variant)}>
                                    </Button>
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

export default BalanceCreate;