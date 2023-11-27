import classNames from 'classnames/bind';
import styles from './SalesCounter.module.scss';

import { useContext, useState } from 'react';

import Header from './Header';
import SideBar from './SideBar';
import Content from './Content';
import ModalNewCustomer from '../../components/Modal/ModalNewCustomer';
import ModalNewProduct from '../../components/Modal/ModalNewProduct';
import DiscountOrder from '../../components/Modal/DiscountOrder';
import { AuthContext } from '../../contexts/AuthContex';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function SalesCounter() {
    const { user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const navigate = useNavigate();
    const [openAddCustomer, setOpenAddCustomer] = useState(false);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [openDiscountOrder, setOpenDiscountOrder] = useState(false);
    const [dataFromHeader, setDataFromHeader] = useState(null);
    const [dataArrayProduct, setDataArrayProduct] = useState(null);
    const [valueDiscountOrder, setValueDiscountOrder] = useState(0);
    const [typeDiscountOrder, setTypeDiscountOrder] = useState(true);
    const [resetPaymentOrder, setResetPaymentOrder] = useState(false);
    const [newCustomer, setNewCustomer] = useState(null);

    const handleOpenAddCustomer = () => setOpenAddCustomer(true);
    const handleCloseAddCustomer = () => setOpenAddCustomer(false);
    const handleOpenAddProduct = () => setOpenAddProduct(true);
    const handleCloseAddProduct = () => setOpenAddProduct(false);
    const handleOpenDiscountOrder = () => setOpenDiscountOrder(true);
    const handleCloseDiscountOrder = () => setOpenDiscountOrder(false);
    const handleChangeValueDiscountOrder = (value, type) => {
        setValueDiscountOrder(value);
        setTypeDiscountOrder(type);
    };

    const handleDataFromHeader = (data) => {
        setDataFromHeader(data);
    };

    const handleDataArrayProduct = (data) => {
        setDataArrayProduct(data);
    };

    if (!roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE')) {
        navigate('/403');
    }

    return (
        <div>
            <div className={cx('wrap')}>
                <Header onButtonAddNewCustomer={handleOpenAddProduct} onDataFromHeader={handleDataFromHeader} />
                <Content
                    dataFromHeader={dataFromHeader}
                    onArrayProduct={handleDataArrayProduct}
                    resetPaymentOrder={resetPaymentOrder}
                />
                <SideBar
                    onButtonAddNewCustomer={handleOpenAddCustomer}
                    dataArrayProduct={dataArrayProduct}
                    onButtonDiscountOrder={handleOpenDiscountOrder}
                    valueDiscountOrder={valueDiscountOrder}
                    typeDiscountOrder={typeDiscountOrder}
                    onButtonPaymentOrder={setResetPaymentOrder}
                    newCustomer={newCustomer}
                    setNewCustomer={setNewCustomer}
                />
            </div>

        </div>
    );
}

export default SalesCounter;
