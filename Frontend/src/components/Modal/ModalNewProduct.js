import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
// import * as baseProductServices from '../../services/createBaseProduct';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import numeral from 'numeral';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContex';
import { createProduct } from '../../services/productManagerServices';
import { LightTooltip } from '../LightTooltip/LightTooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 500,
    borderRadius: '6px',
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
};

function ModalNewProduct({ openModal, closeModal }) {
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [productName, setProductName] = useState('');
    const [productLabel, setProductLabel] = useState('');
    const [productVariantNumber, setProductVariantNumber] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [importPrice, setImportPrice] = useState('');
    const [retailPrice, setRetailPrice] = useState('');
    const [wholeSalePrice, setWholeSalePrice] = useState('');
    const [productVolume, setProductVolume] = useState('');
    const [productSku, setProductSku] = useState('');
    const [productBarcode, setProductBarcode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        label: 'Test',
        variantNumber: 1,
        quantity: 0,
        attribute1: 'Kích thước',
        variants: [
            {
                name: '',
                quantity: 0,
                importPrice: 0,
                retailPrice: 0,
                wholeSalePrice: 0,
                sku: '',
                barcode: '',
                value1: '',
            },
        ],
    });

    const { token } = useContext(AuthContext);

    const handleCloseAddProduct = () => {
        closeModal();
        setOpenAddProduct(false);
    };

    const handleAddProduct = () => {
        const fetchApi = async () => {
            try {
                const newProduct = {
                    name: productName,
                    label: productLabel,
                    variantNumber: 1,
                    quantity: productQuantity,
                    attribute1: 'Kích thước',
                    variants: [
                        {
                            name: productName,
                            quantity: productQuantity,
                            importPrice: importPrice,
                            retailPrice: retailPrice,
                            wholeSalePrice: wholeSalePrice,
                            sku: productSku,
                            barcode: productSku,
                            value1: productVolume,
                        },
                    ],
                };
                const result = await createProduct(newProduct, token);
                console.log(result);
                if (result.responseCode === 200) {
                    toast.success('Thêm mới sản phẩm thành công');
                    setOpenAddProduct('');
                    setProductName('');
                    setProductQuantity('');
                    setImportPrice('');
                    setRetailPrice('');
                    setWholeSalePrice('');
                    setProductVolume('');
                    setProductSku('');
                    setProductBarcode('');
                    handleCloseAddProduct();
                } else {
                    toast.error(result.response.data.message);
                }
            } catch (error) {
                toast.error(error);
            }
        };
        fetchApi();

        // setFormData({});
    };

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    useEffect(() => {
        if (openModal) {
            setOpenAddProduct(true);
        }
    }, [openModal, openAddProduct]);

    return (
        <>
            <ToastContainer />
            <Modal
                open={openAddProduct}
                onClose={handleCloseAddProduct}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={cx('box')}>
                        <div className={cx('headerBox')}>
                            <span>Thêm mới sản phẩm</span>
                            <IconButton aria-label="add" size="small" onClick={handleCloseAddProduct}>
                                <CloseIcon sx={{ color: '#637381', fontSize: '24px' }} />
                            </IconButton>
                        </div>
                        <div className={cx('contentBox')}>
                            <div className={cx('wrapItemInnerContentBox')}>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Tên sản phẩm <span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={<span>Nhãn hiệu</span>}
                                    variant="standard"
                                    value={productLabel}
                                    onChange={(e) => setProductLabel(e.target.value)}
                                />
                            </div>
                            <div className={cx('wrapItemInnerContentBox')}>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Mã sản phẩm/SKU
                                            <LightTooltip
                                                title={
                                                    <div>
                                                        <span>
                                                            Mã <strong>không trùng lặp</strong> để định danh giữa các
                                                            sản phẩm
                                                        </span>
                                                        <br></br>
                                                        <span>
                                                            Nếu để trống mã sản phẩm sẽ được tự sinh với{' '}
                                                            <strong>tiền tố SKU</strong>.
                                                        </span>
                                                    </div>
                                                }
                                                placement="top"
                                            >
                                                <ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} />
                                            </LightTooltip>
                                        </span>
                                    }
                                    variant="standard"
                                    value={productSku}
                                    onChange={(e) => setProductSku(e.target.value)}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Kích thước<span className={cx('tickRed')}>*</span>
                                        </span>
                                    }
                                    variant="standard"
                                    value={productVolume}
                                    onChange={(e) => setProductVolume(e.target.value)}
                                />
                            </div>

                            <div className={cx('wrapItemInnerContentBox')}>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Số lượng sản phẩm
                                        </span>
                                    }
                                    variant="standard"
                                    value={numeral(productQuantity).format(0, 0)}
                                    onChange={(e) => setProductQuantity(parseFloat(e.target.value.replace(/,/g, '')))}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Giá nhập
                                        </span>
                                    }
                                    variant="standard"
                                    value={numeral(importPrice).format(0, 0)}
                                    onChange={(e) => setImportPrice(parseFloat(e.target.value.replace(/,/g, '')))}
                                />
                            </div>

                            <div className={cx('wrapItemInnerContentBox')}>
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Giá bán lẻ
                                        </span>
                                    }
                                    variant="standard"
                                    value={numeral(retailPrice).format(0, 0)}
                                    onChange={(e) => setRetailPrice(parseFloat(e.target.value.replace(/,/g, '')))}
                                />
                                <TextField
                                    className={cx('itemInnerContentBox')}
                                    label={
                                        <span>
                                            Giá bán buôn
                                        </span>
                                    }
                                    variant="standard"
                                    value={numeral(wholeSalePrice).format(0, 0)}
                                    onChange={(e) => setWholeSalePrice(parseFloat(e.target.value.replace(/,/g, '')))}
                                />
                            </div>
                        </div>

                        <div className={cx('footer')}>
                            <Button variant="outlined" onClick={handleCloseAddProduct}>
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={handleAddProduct}>
                                Thêm
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default ModalNewProduct;
