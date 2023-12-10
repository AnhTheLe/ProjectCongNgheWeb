import React, { useContext, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';
import classNames from 'classnames/bind';
import styles from './CreateImportOrder.module.scss';
import SearchProduct from './SearchProduct';
import ContentProduct from './ContentProduct';
import HeaderVendor from './ContentVendor';
import ContentVendor from './SearchVendor';
import ModalNewVendor from '../../../components/Modal/ModalNewVendor';
import ModalNewProduct from '../../../components/Modal/ModalNewProduct';
import { AuthContext } from '../../../contexts/AuthContex';
import { createdImportOrder } from '../../../services/importServices/createImportOrder';

const cx = classNames.bind(styles);

function CreateImportOrder() {
    const navigate = useNavigate();
    const [openAddVendor, setOpenAddVendor] = useState(false);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [dataFromHeaderVendor, setDataFromHeaderVendor] = useState(null);
    const [dataFromHeader, setDataFromHeader] = useState(null);
    const [dataVendor, setDataVendor] = useState(null);
    const [dataArrayProduct, setDataArrayProduct] = useState(null);

    const handleOpenAddVendor = () => setOpenAddVendor(true);
    const handleCloseAddVendor = () => setOpenAddVendor(false);
    const handleOpenAddProduct = () => setOpenAddProduct(true);
    const handleCloseAddProduct = () => setOpenAddProduct(false);

    const handleDataFromHeaderVendor = (data) => {
        setDataFromHeaderVendor(data);
    };
    const handleDataFromHeader = (data) => {
        setDataFromHeader(data);
    };

    const handleDataVendor = (data) => {
        setDataVendor(data);
    };

    const handleDataArrayProduct = (data) => {
        setDataArrayProduct(data);
    };

    const validateVendor = () => {
        if (!dataFromHeaderVendor) {
            toast.warn('Chưa chọn nhà cung cấp!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return false;
        }
        console.log(dataFromHeaderVendor);
        return true;
    };

    const validateProduct = () => {
        if (dataArrayProduct.length === 0) {
            toast.warn('Chưa chọn sản phẩm!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return false;
        }
        console.log(dataArrayProduct);
        return true;
    };

    const { token } = useContext(AuthContext);

    async function createImportOrder() {
        // console.log(result);
        if (validateVendor() && validateProduct()) {
            let result = { vendor: dataFromHeaderVendor, variantDTOList: dataArrayProduct };
            console.log(dataFromHeaderVendor)
            try {
                const res = await createdImportOrder(result, token);
                // console.log(res);
                if (res.responseCode && res.responseCode === 200) {
                    toast.success('Tạo đơn nhập hàng thành công!', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });

                    setTimeout(() => {
                        navigate('/import_order');
                    }, 1000);

                } else if (res.response.data.messages) {
                    // console.log(res.response.data.messages);
                    res.response.data.messages.forEach((message) => {
                        toast.error(message, {
                            position: 'top-right',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        });
                    });
                } else {
                    // console.log(res.response.data.message);
                    toast.error(res.response.data.message, {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                }
            } catch (error) {
                return error;
            }
        }
    }

    return (
        <div>
            <div className={cx('wrap')}>
                <div className={cx('header')}>
                    <Button
                        onClick={() => navigate('/import_order')}
                        variant="outlined"
                        startIcon={<ArrowBackIosIcon />}
                    >
                        Quay lại
                    </Button>
                    <div>
                        <Button variant="contained" onClick={createImportOrder}>
                            Tạo đơn 
                        </Button>
                    </div>
                </div>
                <div className={cx('table')}>
                    <HeaderVendor
                        onButtonAddNewVendor={handleOpenAddVendor}
                        onDataFromHeaderVendor={handleDataFromHeaderVendor}
                    />
                    <ContentVendor dataFromHeader={dataFromHeaderVendor} onVendor={handleDataVendor} />
                </div>
                <br />
                <div className={cx('table')}>
                    <div style={{ padding: '15px 15px 0px 15px', fontWeight: '600', fontSize: '16px' }}>
                        Thông tin sản phẩm
                    </div>
                    <SearchProduct onButtonAddNewCustomer={handleOpenAddProduct} onDataFromHeader={handleDataFromHeader} />
                    <ContentProduct dataFromHeader={dataFromHeader} onArrayProduct={handleDataArrayProduct} />
                </div>
            </div>
            <ModalNewProduct openModal={openAddProduct} closeModal={handleCloseAddProduct}/>
            <ModalNewVendor openModal={openAddVendor} closeModal={handleCloseAddVendor} onDataNewVendor={handleDataFromHeaderVendor}/>
        </div>
    );
}

export default CreateImportOrder;
