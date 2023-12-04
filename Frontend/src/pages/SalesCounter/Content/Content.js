import classNames from 'classnames/bind';
import styles from './Content.module.scss';

import { useContext, useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCaretDown, faCaretUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import numeral from 'numeral';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { AuthContext } from '../../../contexts/AuthContex';
import * as VariantsServices from '../../../services/VariantsServices';

import { DefaultIcon, NoProduct } from '../../../components/Icons';

const cx = classNames.bind(styles);

function Content({ dataFromHeader, onArrayProduct, resetPaymentOrder }) {
    // const [quantity, setQuantity] = useState(1);
    const { token } = useContext(AuthContext);
    const [dataArrayProduct, setDataArrayProduct] = useState([]);
    const [listProductPage, setListProductPage] = useState([]);
    const [dataFrom, setDataFrom] = useState({});
    const [toggle, setToggle] = useState({
        action: false,
        value: 240,
        display: 'block',
    });
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 8,
    });
    const [totalPages, setTotalPages] = useState(10);
    const [addProduct, setAddProduct] = useState(false);

    useEffect(() => {
        setDataFrom(dataFromHeader);
    }, [dataFromHeader]);

    // console.log(dataArrayProduct);
    useEffect(() => {
        // Kiểm tra xem sản phẩm đã tồn tại trong mảng chưa

        const existingProductIndex = dataArrayProduct.findIndex((product) => product?.id === dataFrom?.id);

        if (dataFrom) {
            console.log('test 1');
            if (existingProductIndex !== -1) {
                // Sản phẩm đã tồn tại trong mảng, cập nhật quantity của nó quantityPurchased
                const updatedArray = [...dataArrayProduct];
                if (
                    updatedArray[existingProductIndex].quantityPurchased + 1 >
                    updatedArray[existingProductIndex].quantity
                ) {
                    toast.warn(
                        `Sản phẩm này chỉ có thể bán tối đa ${updatedArray[existingProductIndex].quantity} sản phẩm`,
                        {
                            autoClose: 2000,
                        },
                    );
                    setDataArrayProduct(updatedArray);
                } else {
                    updatedArray[existingProductIndex].quantityPurchased =
                        updatedArray[existingProductIndex].quantityPurchased + 1;
                    setDataArrayProduct(updatedArray);
                }
            } else {
                // Sản phẩm chưa tồn tại trong mảng, thêm mới vào mảng
                setDataArrayProduct((prevArray) => {
                    return [...prevArray, { ...dataFrom, quantityPurchased: 1 }];
                });
            }
        }
    }, [dataFrom, addProduct]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await VariantsServices.getAllVariants(
                    paginationModel.page,
                    paginationModel.pageSize,
                    token,
                );
                console.log('list product', result);
                setTotalPages(result.totalPages);
                setListProductPage(
                    result.data?.map((item) => {
                        return {
                            ...item,
                            quantityPurchased: 1,
                        };
                    }),
                );
            } catch (error) {
                console.log('fetchApi getAllVariantsServices' + error);
            }
        };
        fetchApi();
    }, [paginationModel.page, paginationModel.pageSize, token]);

    useEffect(() => {
        onArrayProduct(dataArrayProduct);
    }, [dataArrayProduct, onArrayProduct]);

    useEffect(() => {
        setDataArrayProduct([]);
    }, [resetPaymentOrder]);

    const handleDeleteProduct = (code, index) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
        if (confirm) {
            toast.success(`Xóa thành công sản phẩm ${dataArrayProduct[index].name} khỏi đơn hàng`, {
                autoClose: 2000,
            });
            const updatedArray = dataArrayProduct.filter((product) => product?.id !== code);
            setDataArrayProduct(updatedArray);
        }
    };

    const handleQuantityChange = (event, id, index) => {
        const newQuantity = parseInt(event.target.value, 10);
        // var temp = newQuantity <= dataArrayProduct[index].quantity ? newQuantity : dataArrayProduct[index].quantity;
        if (newQuantity > dataArrayProduct[index].quantity) {
            toast.warn(`Sản phẩm này chỉ có thể bán tối đa ${dataArrayProduct[index].quantity} sản phẩm`, {
                autoClose: 2000,
            });
            const updatedArray = dataArrayProduct.map((product) => {
                if (product.id === id) {
                    return { ...product, quantityPurchased: dataArrayProduct[index].quantity };
                }
                return product;
            });
            setDataArrayProduct(updatedArray);
        } else {
            // console.log(event.target.value, newQuantity);
            const updatedArray = dataArrayProduct.map((product) => {
                if (product.id === id) {
                    return { ...product, quantityPurchased: newQuantity };
                }
                return product;
            });
            setDataArrayProduct(updatedArray);
        }
    };

    const decreaseQuantity = (index) => {
        if (dataArrayProduct[index].quantityPurchased > 0) {
            const updatedArray = dataArrayProduct.map((product, i) =>
                i === index ? { ...product, quantityPurchased: product.quantityPurchased - 1 } : product,
            );
            setDataArrayProduct(updatedArray);
        }
    };

    const increaseQuantity = (index) => {
        if (dataArrayProduct[index].quantityPurchased + 1 > dataArrayProduct[index].quantity) {
            toast.warn(`Sản phẩm này chỉ có thể bán tối đa ${dataArrayProduct[index].quantity} sản phẩm`, {
                autoClose: 2000,
            });
        } else {
            const updatedArray = dataArrayProduct.map((product, i) =>
                i === index ? { ...product, quantityPurchased: product.quantityPurchased + 1 } : product,
            );
            setDataArrayProduct(updatedArray);
        }
    };

    const handleToggle = () => {
        if (toggle.action) {
            setToggle({
                action: false,
                value: 240,
                display: 'block',
            });
        } else {
            setToggle({
                action: true,
                value: 0,
                display: 'none',
            });
        }
    };

    const handleChangePagination = (event, page) => {
        setPaginationModel((prev) => ({ ...prev, page: page }));
    };

    const handleAddProductFromQuickAction = (item) => {
        if (item.quantity <= 0) {
            toast.warn('Sản phẩm này đã hết hàng', {
                autoClose: 2000,
            });
        } else {
            setDataFrom(item);
            setAddProduct((prev) => !prev);
        }
    };
   

    return (
        <div className={cx('wrap')}>
            <ToastContainer />
            <div className={cx('infoTitle')}>
                <div className={cx('numericalOrder')}>STT</div>
                <div className={cx('wrapDelete')}></div>
                <div className={cx('imageProduct')}>Ảnh SP</div>
                <div className={cx('codeSKU')}>Mã SKU</div>
                <div className={cx('nameProduct')}>Tên sản phẩm</div>
                <div className={cx('unit')}>Đơn vị</div>
                <div className={cx('quantity')}>Số lượng</div>
                <div className={cx('price')}>Đơn giá</div>
                <div className={cx('intoMoney')}>Thành tiền</div>
            </div>
            <div className={cx('content')} style={{ height: `calc(85vh - ${toggle.value}px - 11px)` }}>
                {dataArrayProduct.length === 0 && (
                    <div className={cx('OrderNoItem')}>
                        <div>
                            <NoProduct />
                        </div>
                        <div>Đơn hàng của bạn chưa có sản phẩm nào</div>
                    </div>
                )}
                {dataArrayProduct?.map((product, index) => {
                    return (
                        product && (
                            <div className={cx('wrapItem')} key={index}>
                                <div className={cx('item')}>
                                    <div className={cx('numericalOrder')}>{index + 1}</div>
                                    <div
                                        className={cx('wrapDelete')}
                                        onClick={() => handleDeleteProduct(product?.id, index)}
                                    >
                                        <IconButton aria-label="delete">
                                            <FontAwesomeIcon icon={faTrashCan} className={cx('iconDelete')} />
                                        </IconButton>
                                    </div>
                                    <div className={cx('imageProduct')}>
                                        {product.image ? (
                                            <div className={cx('alignImageProduct')}>
                                                <img alt="image product" src={product.image}></img>
                                            </div>
                                        ) : (
                                            <DefaultIcon />
                                        )}
                                    </div>
                                    <div className={cx('codeSKU')}>{product?.sku}</div>
                                    <div className={cx('nameProduct')}>{product?.name}</div>
                                    <div className={cx('unit')}></div>
                                    <div className={cx('quantity')}>
                                        <div className={cx('innerQuantity')}>
                                            <FontAwesomeIcon
                                                icon={faCaretDown}
                                                className={cx('quantityButton')}
                                                onClick={() => decreaseQuantity(index)}
                                            />
                                            <input
                                                type="text"
                                                className={cx('quantityValue')}
                                                // value={product?.quantity}
                                                // value={
                                                //     product.quantityPurchased !== null &&
                                                //     !isNaN(product.quantityPurchased)
                                                //         ? product.quantityPurchased
                                                //         : ''
                                                // }
                                                value={numeral(
                                                    product.quantityPurchased !== null &&
                                                        !isNaN(product.quantityPurchased)
                                                        ? product.quantityPurchased
                                                        : '',
                                                ).format('0,0')}
                                                onChange={(event) => handleQuantityChange(event, product?.id, index)}
                                            ></input>
                                            <FontAwesomeIcon
                                                icon={faCaretUp}
                                                className={cx('quantityButton')}
                                                onClick={() => increaseQuantity(index)}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('price')}>{numeral(product?.retailPrice).format('0,0')}</div>
                                    <div className={cx('intoMoney')}>
                                        <strong>
                                            {numeral(product?.retailPrice * product?.quantityPurchased).format('0,0')}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        )
                    );
                })}
            </div>
            <div className={cx('toggle')}>
                <div className={cx('toggleWrap')} onClick={handleToggle}>
                    {toggle.action ? (
                        <FontAwesomeIcon icon={faAngleUp} style={{ color: '#0964CF' }} />
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown} style={{ color: '#0964CF' }} />
                    )}
                </div>
            </div>
            <div className={cx('quickAction')} style={{ height: `${toggle.value}px` }}>
                {listProductPage.length === 0 && <div className={cx('dataEmpty')}>Không có dữ liệu sản phẩm</div>}
                <div className={cx('quickActionContent')}>
                    {listProductPage.map((item) => {
                        return (
                            <div
                                className={cx('wrapItemFeature')}
                                onClick={() => handleAddProductFromQuickAction(item)}
                            >
                                <div className={cx('wrapImage')}>
                                    {item.image ? <img alt="" src={item.image}></img> : <DefaultIcon />}
                                </div>
                                <div className={cx('wrapContentItem')}>
                                    <div className={cx('rowOne')}>
                                        <span>{item.name}</span>
                                    </div>
                                    <div className={cx('rowTwo')}>
                                        <strong>{numeral(item.retailPrice).format('0,0')}</strong>
                                        <div>
                                            SL: <strong>{item.quantity}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={cx('quickActionBottom')} style={{ height: `${toggle.value}px)` }}>
                    <div className={cx('quickActionFeature')}>
                        <Button variant="outlined" className={cx('buttonFeature')}>
                            Danh sách sản phẩm
                        </Button>
                    </div>
                    <div className={cx('quickActionPagination')}>
                        <Pagination count={totalPages + 1} color="primary" onChange={handleChangePagination} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
