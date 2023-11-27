import { useContext, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames/bind';
import numeral from 'numeral';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Content.module.scss';
import { AuthContext } from '../../../../contexts/AuthContex';
import { DefaultIcon, NoProduct } from '../../../../components/Icons';
import * as VariantsServices from '../../../../services/VariantsServices';

const cx = classNames.bind(styles);

function Content({ dataFromHeader, onArrayProduct, resetPaymentOrder }) {
    // const [quantity, setQuantity] = useState(1);
    const { token } = useContext(AuthContext);
    const [dataArrayProduct, setDataArrayProduct] = useState([]);
    const [listProductPage, setListProductPage] = useState([]);
    let numberProducts = 0;
    let amountOrder = 0;

    dataArrayProduct.forEach((element) => {
        numberProducts += element.quantity;
        amountOrder += element.importPrice*element.quantity*(1-element.discount/100);
    });

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
    const [addProduct, setAddProduct] = useState(false);

    useEffect(() => {
        console.log(dataFromHeader);
        setDataFrom(dataFromHeader);
    }, [dataFromHeader]);

    // console.log(dataArrayProduct);
    useEffect(() => {
        // Kiểm tra xem sản phẩm đã tồn tại trong mảng chưa

        const existingProductIndex = dataArrayProduct.findIndex((product) => product?.id === dataFrom?.id);

        if (dataFrom) {
            console.log('test 1');
            if (existingProductIndex !== -1) {
                // Sản phẩm đã tồn tại trong mảng, cập nhật quantity của nó quantity
                const updatedArray = [...dataArrayProduct];
                if (updatedArray[existingProductIndex].quantity + 1 > 10000) {
                    toast.warn(`Số lượng nhập phải nhỏ hơn 10000`, {
                        autoClose: 2000,
                    });
                    setDataArrayProduct(updatedArray);
                } else {
                    updatedArray[existingProductIndex].quantity = updatedArray[existingProductIndex].quantity + 1;
                    setDataArrayProduct(updatedArray);
                }
            } else {
                // Sản phẩm chưa tồn tại trong mảng, thêm mới vào mảng
                setDataArrayProduct((prevArray) => {
                    return [...prevArray, { ...dataFrom, quantity: 1 }];
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
                setListProductPage(
                    result.map((item) => {
                        return {
                            ...item,
                            quantity: 1,
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
        console.log("danh sách"+ dataArrayProduct);
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
        const newQuantity = parseInt(event.target.value.replace(/,/g, ''), 10);

        if (newQuantity > 10000) {
            toast.warn(`Số lượng nhập phải nhỏ hơn 10000`, {
                autoClose: 2000,
            });
            const updatedArray = dataArrayProduct.map((product) => {
                if (product.id === id) {
                    return { ...product, quantity: dataArrayProduct[index].quantity };
                }
                return product;
            });
            setDataArrayProduct(updatedArray);
        } else {
            // console.log(event.target.value, newQuantity);
            const updatedArray = dataArrayProduct.map((product) => {
                if (product.id === id) {
                    return { ...product, quantity: newQuantity };
                }
                return product;
            });
            setDataArrayProduct(updatedArray);
        }
    };

    const decreaseQuantity = (index) => {
        if (dataArrayProduct[index].quantity > 0) {
            const updatedArray = dataArrayProduct.map((product, i) =>
                i === index ? { ...product, quantity: product.quantity - 1 } : product,
            );
            setDataArrayProduct(updatedArray);
        }
    };

    const increaseQuantity = (index) => {
        if (dataArrayProduct[index].quantity + 1 > 10000) {
            toast.warn(`Số lượng nhập phải nhỏ hơn 10000`, {
                autoClose: 2000,
            });
        } else {
            const updatedArray = dataArrayProduct.map((product, i) =>
                i === index ? { ...product, quantity: product.quantity + 1 } : product,
            );
            setDataArrayProduct(updatedArray);
        }
    };

    const handlePriceChange = (event, id, index) => {
        const newImportPrice = parseInt(event.target.value.replace(/,/g, ''), 10);

        console.log(event.target.value, newImportPrice);
        const updatedArray = dataArrayProduct.map((product) => {
            if (product.id === id) {
                return { ...product, importPrice: newImportPrice };
            }
            return product;
        });
        setDataArrayProduct(updatedArray);
    };

    const decreasePrice = (index) => {
        if (dataArrayProduct[index].importPrice > 0) {
            const updatedArray = dataArrayProduct.map((product, i) =>
                i === index ? { ...product, importPrice: product.importPrice - 1 } : product,
            );
            setDataArrayProduct(updatedArray);
        }
    };

    const increasePrice = (index) => {
        const updatedArray = dataArrayProduct.map((product, i) =>
            i === index ? { ...product, importPrice: product.importPrice + 1 } : product,
        );
        setDataArrayProduct(updatedArray);
    };

    const handleDiscountChange = (event, id, index) => {
        const newDiscount = parseInt(event.target.value.replace(/,/g, ''), 10);
        console.log(event.target.value, newDiscount);
        if(newDiscount > 100){
            const updatedArray = dataArrayProduct.map((product) => {
                if (product.id === id) {
                    return { ...product, discount: 100 };
                }
                return product;
            });
            setDataArrayProduct(updatedArray);
        } else{
        const updatedArray = dataArrayProduct.map((product) => {
            if (product.id === id) {
                return { ...product, discount: newDiscount };
            }
            return product;
        });
        setDataArrayProduct(updatedArray);
        }
    };

    const decreaseDiscount = (index) => {
        if (dataArrayProduct[index].discount > 0) {
            const updatedArray = dataArrayProduct.map((product, i) =>
                i === index ? { ...product, discount: product.discount - 1 } : product,
            );
            setDataArrayProduct(updatedArray);
        }
    };

    const increaseDiscount = (index) => {
        if (dataArrayProduct[index].discount < 100) {
        const updatedArray = dataArrayProduct.map((product, i) =>
            i === index ? { ...product, discount: product.discount + 1 } : product,
        );
        setDataArrayProduct(updatedArray);
        }
    };

    return (
        <div className={cx('wrap')}>
            <ToastContainer />
            <div className={cx('infoTitle')}>
                <div className={cx('numericalOrder')}>STT</div>
                <div className={cx('wrapDelete')}></div>
                <div className={cx('imageProduct')}>Ảnh</div>
                <div className={cx('codeSKU')}>Mã SKU</div>
                <div className={cx('nameProduct')}>Tên sản phẩm</div>
                <div className={cx('quantity')}>Số lượng nhập</div>
                <div className={cx('price')}>Đơn giá</div>
                <div className={cx('price')}>Chiết khấu</div>
                <div className={cx('intoMoney')}>Thành tiền</div>
            </div>
            <div className={cx('content')} style={{ height: `calc(85vh - ${toggle.value}px - 11px)` }}>
                {dataArrayProduct.length === 0 && (
                    <div className={cx('OrderNoItem')}>
                        <div>
                            <NoProduct />
                        </div>
                        <div>Đơn hàng nhập của bạn chưa có sản phẩm nào</div>
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
                                                <img alt="product" src={product.image}></img>
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
                                                value={numeral(
                                                    product.quantity !== null && !isNaN(product.quantity)
                                                        ? product.quantity
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
                                    {/* <div className={cx('price')}>{numeral(product?.retailPrice).format('0,0')}</div> */}
                                    <div className={cx('price')}>
                                        <div className={cx('innerQuantity')}>
                                            <FontAwesomeIcon
                                                icon={faCaretDown}
                                                className={cx('quantityButton')}
                                                onClick={() => decreasePrice(index)}
                                            />
                                            <input
                                                type="text"
                                                className={cx('quantityValue')}
                                                maxLength={'10'}
                                                value={numeral(
                                                    product.importPrice !== 0 ? product.importPrice : '',
                                                ).format('0,0')}
                                                onChange={(event) => handlePriceChange(event, product?.id, index)}
                                            ></input>
                                            <FontAwesomeIcon
                                                icon={faCaretUp}
                                                className={cx('quantityButton')}
                                                onClick={() => increasePrice(index)}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('price')}>
                                        <div className={cx('innerQuantity')}>
                                            <FontAwesomeIcon
                                                icon={faCaretDown}
                                                className={cx('quantityButton')}
                                                onClick={() => decreaseDiscount(index)}
                                            />
                                            <input
                                                type="text"
                                                className={cx('quantityValue')}
                                                maxLength={'3'}
                                                value={numeral(
                                                    product.discount !== null && !isNaN(product.discount) ? product.discount : '',
                                                ).format('0,0')}
                                                onChange={(event) => handleDiscountChange(event, product?.id, index)}
                                            ></input>
                                            <span>%</span>
                                            <FontAwesomeIcon
                                                icon={faCaretUp}
                                                className={cx('quantityButton')}
                                                onClick={() => increaseDiscount(index)}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('intoMoney')}>
                                        <strong>
                                            {numeral(product?.importPrice * product?.quantity*(1-product?.discount/100)).format('0,0')}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        )
                    );
                })}
            </div>
            <div style={{ fontSize: '18px', padding: '20px 25px 0px 0px', width: '30%', float: 'right' }}>
                <div>
                    <span style={{ fontWeight: '500' }}>Số lượng</span>
                    <span>: {numeral(numberProducts).format(0, 0)}</span>
                </div>
                <div>
                    <span style={{ fontWeight: '500', paddingTop: '10px' }}>Tổng tiền</span>
                    <span>: {numeral(amountOrder).format(0, 0)}</span>
                </div>
            </div>
        </div>
    );
}

export default Content;
