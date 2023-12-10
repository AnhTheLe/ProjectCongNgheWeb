import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';

import classNames from 'classnames/bind';
import styles from './CreateOrderReturn.module.scss';
import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from 'react-router-dom';
import FeedIcon from '@mui/icons-material/Feed';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SearchIcon from '@mui/icons-material/Search';
import numeral from 'numeral';
import { DefaultIcon } from '../../components/Icons';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PaymentsIcon from '@mui/icons-material/Payments';
import { AuthContext } from '../../contexts/AuthContex';
import { PAYMENT_STATUS } from '../../utils/constant';
import { getOrderDetailInfo } from '../../services/orderServices/getOrderDetailInfo';
import { getOrderLines } from '../../services/orderServices/getOrderLines';
import TextField from '@mui/material/TextField';
import Popper from '@mui/material/Popper';
import validator from 'validator';
import { searchVariants } from '../../services/VariantsServices';
import DiscountInput from './DiscountInput';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createReturnOrder } from '../../services/orderServices/createReturnOrder';

const cx = classNames.bind(styles);

const buttonStyle = {
    fontSize: '12px',
};

const textFieldStyle = {
    fontSize: '14px',
    textAlign: 'right',
};

function CreateOrderReturn() {
    const currentUrl = new URL(window.location.href);
    const baseOrderId = currentUrl.searchParams.get('order_id');
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSwap, setOpenSwap] = useState(false);
    const [anchorElSwap, setAnchorElSwap] = useState(null);
    const [inputSearchOrderLine, setInputSearchOrderLine] = useState('');
    const [inputSearchSwapVariant, setInputSearchSwapVariant] = useState('');
    const [orderInfo, setOrderInfo] = useState({
        id: 0,
        customerName: '',
        phone: '',
        customerId: 0,
        createdAt: null,
        staffName: '',
        paymentStatus: PAYMENT_STATUS.INIT,
        amount: 0,
    });
    const [orderLines, setOrderLines] = useState([]);
    const [variants, setVariants] = useState([]);
    const [selectedReturns, setSelectedReturns] = useState([]);
    const [selectedSwaps, setSelectedSwaps] = useState([]);

    const handlePopperClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleOutsideClick = useCallback(
        (event) => {
            if (
                (anchorEl && anchorEl.contains(event.target)) ||
                (anchorElSwap && anchorElSwap.contains(event.target))
            ) {
                // Click is inside the Popper, do nothing
                return;
            }

            setOpenSwap(false);
            setOpen(false);
        },
        [anchorEl, anchorElSwap],
    );

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [anchorEl, handleOutsideClick]);

    const handleInputSearchOrderLineChange = (e) => {
        setInputSearchOrderLine(e.target.value);
    };

    const handleReturnQuantityChange = (id, value) => {
        if (!validator.isInt(value) || value < 0) {
            value = 0;
        }
        const newSelectedReturns = selectedReturns.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    intendedReturnQuantity: +value > item.quantity ? item.quantity : +value,
                };
            }

            return item;
        });
        setSelectedReturns(newSelectedReturns);
    };

    const handleReturnPriceChange = (id, value) => {
        const newSelectedReturns = selectedReturns.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    returnPrice: value,
                };
            }

            return item;
        });
        setSelectedReturns(newSelectedReturns);
    };

    const handleAddReturn = (orderLine) => {
        const returnOrderLine = {
            ...orderLine,
            intendedReturnQuantity: 0,
            returnPrice: orderLine.price,
        };

        setSelectedReturns((old) => [...old, returnOrderLine]);
        setOrderLines((old) => {
            const newOrderLines = old.filter((item) => item.id !== orderLine.id);
            return newOrderLines;
        });
    };

    const handleRemoveReturn = (id) => {
        const selectedRemove = selectedReturns.find((item) => item.id === id);
        delete selectedRemove.intendedReturnQuantity;
        delete selectedRemove.returnPrice;

        const newSelectedReturns = selectedReturns.filter((item) => item.id !== id);
        setOrderLines((old) => [...old, selectedRemove]);
        setSelectedReturns(newSelectedReturns);
    };

    const handlePopperClickSwap = (event) => {
        setAnchorElSwap(event.currentTarget);
        setOpenSwap(!openSwap);
    };

    const handleInputSearchSwapVariantChange = (e) => {
        setInputSearchSwapVariant(e.target.value);
    };

    const handleSwapQuantityChange = (id, value) => {
        if (!validator.isInt(value) || value < 0) {
            value = 0;
        }
        const newSelectedSwaps = selectedSwaps.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    intendedSwapQuantity: +value > item.quantity ? item.quantity : +value,
                };
            }

            return item;
        });
        setSelectedSwaps(newSelectedSwaps);
    };

    const handleSwapPriceChange = (id, value) => {
        const newSelectedSwaps = selectedSwaps.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    swapPrice: value,
                };
            }

            return item;
        });
        setSelectedSwaps(newSelectedSwaps);
    };

    const handleSwapDiscountChange = (id, value) => {
        const newSelectedSwaps = selectedSwaps.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    discount: value,
                };
            }

            return item;
        });
        setSelectedSwaps(newSelectedSwaps);
    };

    const handleAddSwap = (variant) => {
        const swapVariant = {
            ...variant,
            intendedSwapQuantity: 0,
            swapPrice: variant.retailPrice,
            discount: 0,
        };

        setSelectedSwaps((old) => [...old, swapVariant]);
    };

    const handleRemoveSwap = (id) => {
        const newSelectedSwaps = selectedSwaps.filter((item) => item.id !== id);
        setSelectedSwaps(newSelectedSwaps);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderDetailInfo(baseOrderId, token);
            setOrderInfo(response.data);
        };
        fetchData();
    }, [baseOrderId, token]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderLines(baseOrderId, token);
            setOrderLines(response.data.filter((item) => item.quantity > item.returnQuantity));
        };
        fetchData();
    }, [baseOrderId, token]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await searchVariants(inputSearchSwapVariant, token);
            setVariants(
                response.filter((item) => item.quantity > 0 && !selectedSwaps.some((swap) => swap.id === item.id)),
            );
        };
        fetchData();
    }, [inputSearchSwapVariant, token, selectedSwaps]);

    const returnValue = selectedReturns.reduce(
        (total, item) => total + item.intendedReturnQuantity * item.returnPrice,
        0,
    );

    const swapDiscount = selectedSwaps.reduce((total, item) => total + item.discount * item.intendedSwapQuantity, 0);

    const swapValue = selectedSwaps.reduce((total, item) => total + item.intendedSwapQuantity * item.swapPrice, 0);

    const swapAmount = swapValue - swapDiscount;

    const handleReturn = () => {
        navigate('/order_returns');
    };

    const handleCreateReturnOrder = () => {
        const returnVariantList = [];
        const swapVariantList = [];

        if (selectedReturns.length === 0) {
            toast.error('Vui lòng chọn sản phẩm trả');
            return;
        }

        for (const returnItem of selectedReturns) {
            if (returnItem.intendedReturnQuantity === 0) {
                toast.error('Vui lòng điền số lượng sản phẩm trả');
                return;
            }

            const returnVariant = {
                variantId: returnItem.variant.id,
                returnQuantity: returnItem.intendedReturnQuantity,
                returnPrice: returnItem.returnPrice,
            };

            returnVariantList.push(returnVariant);
        }

        for (const swapItem of selectedSwaps) {
            if (swapItem.intendedSwapQuantity === 0) {
                toast.error('Vui lòng điền số lượng sản phẩm đổi');
                return;
            }

            const swapVariant = {
                variantId: swapItem.id,
                swapQuantity: swapItem.intendedSwapQuantity,
                swapPrice: swapItem.swapPrice,
                discount: swapItem.discount,
            };

            swapVariantList.push(swapVariant);
        }

        createReturnOrder(
            {
                returnVariantList,
                swapVariantList,
            },
            baseOrderId,
            token,
        )
            .then((response) => {
                alert('Tạo đổi trả thành công');
                navigate(`/order_returns/${response.data}`);
            })
            .catch((err) => toast.error('Đã có lỗi xảy ra'));
    };

    return (
        <div className={cx('container')}>
            <ToastContainer />
            <div className={cx('button-container')}>
                <Button variant="outlined" sx={buttonStyle} onClick={handleReturn}>
                    <ArrowBackIosIcon sx={{ fontSize: 13 }} />
                    Thoát
                </Button>
                <Button variant="contained" sx={buttonStyle} onClick={handleCreateReturnOrder}>
                    Tạo đơn trả hàng
                </Button>
            </div>
            <div className={cx('infos')}>
                <div className={cx('personalInfo')}>
                    <div className={cx('personalInfoHeader')}>
                        <span>
                            <FeedIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                            Thông tin phiếu
                        </span>
                    </div>
                    <div className={cx('personalInfoContent')}>
                        <div>
                            <div>Khách hàng</div>
                            <div>
                                <Link style={{ textDecoration: 'none' }} to={`/customer/${orderInfo.customerId}`}>
                                    <span style={{ color: '#0088FF', cursor: 'pointer' }}>
                                        {orderInfo.customerName}
                                    </span>
                                </Link>{' '}
                                {orderInfo.phone === '-1' ? '' : ' -' + orderInfo.phone}
                            </div>
                        </div>
                        <div>
                            <div>Mã đơn hàng gốc</div>
                            <Link style={{ textDecoration: 'none' }} to={`/order/${baseOrderId}`}>
                                <div style={{ color: '#0088FF', cursor: 'pointer' }}>SON000{baseOrderId}</div>
                            </Link>
                        </div>
                        <div>
                            <div>Chi nhánh trả hàng</div>
                            <div style={{ fontWeight: 600 }}>Chi nhánh mặc định</div>
                        </div>
                    </div>
                </div>
                <div className={cx('purchaseInfo')}>
                    <div className={cx('purchaseInfoHeader')}>
                        <span>Thông tin bổ sung</span>
                    </div>
                    <div className={cx('purchaseInfoContent')}>
                        <div>Ghi chú</div>
                        <textarea name="note" rows="3" className={cx('note')}></textarea>
                    </div>
                </div>
            </div>
            <div className={cx('return-products')}>
                <div style={{ fontWeight: 600 }}>
                    <KeyboardReturnIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                    Sản phẩm trả
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')} onClick={handlePopperClick}>
                        <SearchIcon
                            className={cx('iconSearch')}
                            value={inputSearchOrderLine}
                            onChange={handleInputSearchOrderLineChange}
                        />
                        <input placeholder="Tìm kiếm sản phẩm theo tên hoặc mã SKU"></input>
                    </div>
                </div>
                <div className={cx('historyContent')}>
                    <div className={cx('historyContentTitle')}>
                        <div className={cx('number', 'header')}>STT</div>
                        <div className={cx('image', 'header')}>Ảnh</div>
                        <div className={cx('sku', 'header')}>SKU</div>
                        <div className={cx('name', 'header')}>Tên sản phẩm</div>
                        <div className={cx('quantity', 'header')}>Số lượng</div>
                        <div className={cx('price', 'header')}>Đơn giá gốc</div>
                        <div className={cx('discount', 'header')}>Đơn giá trả</div>
                        <div className={cx('amount', 'header')}>Thành tiền</div>
                        <div className={cx('delete')}></div>
                    </div>

                    <div className={cx('wrapItem')}>
                        {selectedReturns.map((item, index) => (
                            <div className={cx('historyContentRow')} key={item.id}>
                                <div className={cx('number', 'row')}>{index + 1}</div>
                                <div className={cx('image', 'row')}>
                                    {item.variant.image ? (
                                        <div className={cx('alignImageProduct', 'row')}>
                                            <img alt="product" src={item.variant.image} />
                                        </div>
                                    ) : (
                                        <DefaultIcon />
                                    )}
                                </div>
                                <div className={cx('sku', 'row')}>{item.variant.sku}</div>
                                <div className={cx('name', 'row')}>{item.variant.name}</div>
                                <div
                                    className={cx('quantity', 'row')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        justifyContent: 'flex-end',
                                        gap: '10px',
                                    }}
                                >
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        sx={{ width: '30px' }}
                                        inputProps={{ style: { ...textFieldStyle } }}
                                        value={item.intendedReturnQuantity === 0 ? '' : item.intendedReturnQuantity}
                                        onChange={(event) => handleReturnQuantityChange(item.id, event.target.value)}
                                    />
                                    /{' ' + (item.quantity - item.returnQuantity)}
                                </div>
                                <div className={cx('price', 'row')}>
                                    {numeral(item.variant.retailPrice).format('0,0')}
                                </div>
                                <div className={cx('discount', 'row')}>
                                    <TextField
                                        sx={{ width: '70px' }}
                                        inputProps={{ style: { ...textFieldStyle } }}
                                        id="standard-basic"
                                        variant="standard"
                                        value={numeral(item.returnPrice).format('0,0')}
                                        onChange={(event) =>
                                            handleReturnPriceChange(item.id, numeral(event.target.value).value())
                                        }
                                    />
                                </div>
                                <div className={cx('amount', 'row')}>
                                    {numeral(item.returnPrice * item.intendedReturnQuantity).format('0,0')}
                                </div>
                                <div className={cx('delete')} onClick={() => handleRemoveReturn(item.id)}>
                                    <CloseIcon sx={{ cursor: 'pointer', color: '#747c87' }} />
                                </div>
                            </div>
                        ))}
                        {selectedReturns.length === 0 && <div className={cx('historyEmpty')}>Chọn sản phẩm trả</div>}
                    </div>
                    <div className={cx('summary')}>
                        <div className={cx('summary-item')}>
                            <div>Số lượng sản phẩm trả</div>
                            <div>{selectedReturns.reduce((total, item) => total + item.intendedReturnQuantity, 0)}</div>
                        </div>

                        <div style={{ fontWeight: 600 }} className={cx('summary-item')}>
                            <div>Cần hoàn tiền trả hàng</div>
                            <div>{returnValue}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('return-products')}>
                <div style={{ fontWeight: 600 }}>
                    <AddIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                    Đổi hàng
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')} onClick={handlePopperClickSwap}>
                        <SearchIcon className={cx('iconSearch')} />
                        <input
                            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã SKU"
                            onChange={handleInputSearchSwapVariantChange}
                            value={inputSearchSwapVariant}
                        ></input>
                    </div>
                </div>
                <div className={cx('historyContent')}>
                    <div className={cx('historyContentTitle')}>
                        <div className={cx('number', 'header')}>STT</div>
                        <div className={cx('image', 'header')}>Ảnh</div>
                        <div className={cx('sku', 'header')}>SKU</div>
                        <div className={cx('name', 'header')}>Tên sản phẩm</div>
                        <div className={cx('quantity', 'header')}>Số lượng</div>
                        <div className={cx('price', 'header')}>Đơn giá</div>
                        <div className={cx('discount', 'header')}>Chiết khấu</div>
                        <div className={cx('amount', 'header')}>Thành tiền</div>
                        <div className={cx('delete')}></div>
                    </div>

                    <div className={cx('wrapItem')}>
                        {selectedSwaps.map((item, index) => (
                            <div className={cx('historyContentRow')} key={item.id}>
                                <div className={cx('number', 'row')}>{index + 1}</div>
                                <div className={cx('image', 'row')}>
                                    {item.image ? (
                                        <div className={cx('alignImageProduct', 'row')}>
                                            <img alt="product" src={item.image} />
                                        </div>
                                    ) : (
                                        <DefaultIcon />
                                    )}
                                </div>
                                <div className={cx('sku', 'row')}>{item.sku}</div>
                                <div className={cx('name', 'row')}>{item.name}</div>
                                <div
                                    className={cx('quantity', 'row')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        justifyContent: 'flex-end',
                                        gap: '10px',
                                    }}
                                >
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        sx={{ width: '30px' }}
                                        inputProps={{ style: { ...textFieldStyle } }}
                                        value={item.intendedSwapQuantity === 0 ? '' : item.intendedSwapQuantity}
                                        onChange={(event) => handleSwapQuantityChange(item.id, event.target.value)}
                                    />
                                    /{' ' + item.quantity}
                                </div>
                                <div className={cx('price', 'row')}>
                                    <TextField
                                        sx={{ width: '70px' }}
                                        inputProps={{ style: { ...textFieldStyle } }}
                                        id="standard-basic"
                                        variant="standard"
                                        value={numeral(item.swapPrice).format('0,0')}
                                        onChange={(event) =>
                                            handleSwapPriceChange(item.id, numeral(event.target.value).value())
                                        }
                                    />
                                </div>
                                <div className={cx('discount', 'row')}>
                                    <DiscountInput
                                        discount={item.discount}
                                        handleSwapDiscountChange={handleSwapDiscountChange}
                                        variantId={item.id}
                                        price={item.retailPrice}
                                    />
                                </div>
                                <div className={cx('amount', 'row')}>
                                    {numeral((item.swapPrice - item.discount) * item.intendedSwapQuantity).format(
                                        '0,0',
                                    )}
                                </div>
                                <div className={cx('delete')} onClick={() => handleRemoveSwap(item.id)}>
                                    <CloseIcon sx={{ cursor: 'pointer', color: '#747c87' }} />
                                </div>
                            </div>
                        ))}
                        {selectedSwaps.length === 0 && <div className={cx('historyEmpty')}>Chọn sản phẩm đổi</div>}
                    </div>
                    <div className={cx('summary')}>
                        <div className={cx('summary-item')}>
                            <div>Tổng tiền ({10} sản phẩm)</div>
                            <div>{numeral(swapDiscount).format('0,0')}</div>
                        </div>
                        <div className={cx('summary-item')}>
                            <div>Chiết khấu</div>
                            <div>{numeral(swapDiscount).format('0,0')}</div>
                        </div>
                        <div style={{ fontWeight: 600 }} className={cx('summary-item')}>
                            <div>Khách phải trả</div>
                            <div>{numeral(swapValue - swapDiscount).format('0,0')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('payment')}>
                <div style={{ fontWeight: 600 }}>
                    <PaymentsIcon sx={{ color: '#747c87', marginRight: '10px' }} />
                    Thanh toán
                </div>
                <div className={cx('summary')}>
                    <div className={cx('summary-item')}>
                        <div>Cần hoàn tiền trả hàng</div>
                        <div>{numeral(returnValue).format('0,0')}</div>
                    </div>
                    <div className={cx('summary-item')}>
                        <div>Khách cần trả đơn đổi</div>
                        <div>{numeral(swapAmount).format(0, 0)}</div>
                    </div>

                    <div style={{ fontWeight: 600 }} className={cx('summary-item')}>
                        <div>{returnValue <= swapAmount ? 'Tổng tiền khách phải trả' : 'Tổng tiền phải trả khách'}</div>
                        <div>
                            {returnValue <= swapAmount
                                ? numeral(swapAmount - returnValue).format('0,0')
                                : numeral(returnValue - swapAmount).format('0,0')}
                        </div>
                    </div>
                </div>
            </div>
            <Popper open={open} anchorEl={anchorEl}>
                <div className={cx('popper')}>
                    {orderLines?.map((orderLine, index) => (
                        <div
                            key={index}
                            className={cx('innerPopper', 'itemProduct')}
                            onClick={() => {
                                handleAddReturn(orderLine);
                            }}
                        >
                            <div className={cx('imageProduct')}>
                                {orderLine.variant.image ? (
                                    <div className={cx('alignImageProduct')}>
                                        <img alt="product" src={orderLine.variant.image}></img>
                                    </div>
                                ) : (
                                    <DefaultIcon />
                                )}
                            </div>
                            <div className={cx('verticalDividing')}></div>
                            <div className={cx('contentProduct')}>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('nameProduct')}>{orderLine.variant.name}</span>
                                    <span className={cx('priceProduct')}>{orderLine.price}</span>
                                </div>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('codeProduct')}>{orderLine.variant.sku}</span>
                                    <span className={cx('quantityProduct')}>
                                        Số lượng mua: {orderLine.quantity - orderLine.returnQuantity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Popper>
            <Popper open={openSwap} anchorEl={anchorElSwap}>
                <div className={cx('popper-swap')}>
                    {variants?.map((variant, index) => (
                        <div
                            key={index}
                            className={cx('innerPopper', 'itemProduct')}
                            onClick={() => {
                                handleAddSwap(variant);
                            }}
                        >
                            <div className={cx('imageProduct')}>
                                {variant.image ? (
                                    <div className={cx('alignImageProduct')}>
                                        <img alt="product" src={variant.image}></img>
                                    </div>
                                ) : (
                                    <DefaultIcon />
                                )}
                            </div>
                            <div className={cx('verticalDividing')}></div>
                            <div className={cx('contentProduct')}>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('nameProduct')}>{variant.name}</span>
                                    <span className={cx('priceProduct')}>{variant.retailPrice}</span>
                                </div>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('codeProduct')}>{variant.sku}</span>
                                    <span className={cx('quantityProduct')}>Số lượng: {variant.quantity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Popper>
        </div>
    );
}

export default CreateOrderReturn;
