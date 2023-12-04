import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Popper from '@mui/material/Popper';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Tooltip from '@mui/material/Tooltip';
import HomeIcon from '@mui/icons-material/Home';

import { DefaultIcon } from '../../../components/Icons';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../../../contexts/AuthContex';
import * as VariantsServices from '../../../services/VariantsServices';

const cx = classNames.bind(styles);

function Header({ onButtonAddNewCustomer, onDataFromHeader }) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { token } = useContext(AuthContext);
    const [inputSearchProduct, setInputSearchProduct] = useState('');

    const [products, setProducts] = useState([
        {
            name: 'Balo LV nâu',
            price: 110000,
            code: 'PVN01',
            amount: 10,
            image: 'https://tse3.mm.bing.net/th?id=OIP.EGKH8awt-Fd4l_eXjbH_lQHaHa&pid=Api&P=0&h=180',
        },
        {
            name: 'Kính mắt nữ nhiều màu',
            price: 599000,
            code: 'PVN02',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvcu-lf6r3vmuslfj38',
        },
        {
            name: 'Dép lông con sóc siêu cute',
            price: 85000,
            code: 'PVN03',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/sg-11134201-22100-64nigkkzx8hv30',
        },
        {
            name: 'Thắt lưng nam da cao cấp',
            price: 990000,
            code: 'PVN04',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/sg-11134201-23010-qusbwpefyylvd3',
        },
        {
            name: 'Đồng hồ nam nữ Led LP22',
            price: 669000,
            code: 'PVN05',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/d79d87546a12c1620a57ce1e02e355b2',
        },
        {
            name: 'Dép quai ngang in chữ COVER',
            price: 99000,
            code: 'PVN06',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-zivkcoaff8nva3',
        },
        {
            name: 'Bàn Chải đánh Răng điện IPX7',
            price: 230000,
            code: 'PVN07',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/sg-11134201-22100-vhlvgzbez0iv37',
        },
        {
            name: 'Quạt đeo cổ mini',
            price: 110000,
            code: 'PVN08',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/98b7b6bc1390cfc7fc251e3d84d0ae0d',
        },
        {
            name: 'Mũ Lưỡi Trai Nam Nữ',
            price: 68000,
            code: 'PVN09',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/6a60ed1e94582b58bf6604f76ed4d677',
        },
        {
            name: 'Balo LV chính hãng',
            price: 1299000,
            code: 'PVN10',
            amount: 10,
            image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lk1tw6buvwuace',
        },
    ]);

    const handlePopperClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleButtonAddNewProduct = () => {
        // Gọi hàm xử lý được truyền từ component cha
        onButtonAddNewCustomer();
    };

    const handleClickAddNewProduct = (product) => {
        if (product.quantity <= 0) {
            toast.warn('Sản phẩm này đã hết hàng', {
                autoClose: 2000,
            });
        } else {
            onDataFromHeader(product);
        }
    };

    const handleInputSearchChange = (e) => {
        setInputSearchProduct(e.target.value);
    };

    const handleOutsideClick = (event) => {
        if (anchorEl && anchorEl.contains(event.target)) {
            // Click is inside the Popper, do nothing
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await VariantsServices.getAllVariants(1, 10, token);
                // console.log(result);
                setProducts(result.data);
            } catch (error) {
                console.log('fetchApi getAllVariantsServices' + error);
            }
        };
        fetchApi();
    }, [open, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await VariantsServices.searchVariants(inputSearchProduct, token);
                setProducts(result);
            } catch (error) {
                console.log('fetchApi searchVariants Header.js' + error);
            }
        };
        fetchApi();
    }, [inputSearchProduct, token]);

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [anchorEl]);

    return (
        <div className={cx('wrap')}>
            <ToastContainer />
            <div className={cx('header')}>
                <div className={cx('wrapSearch')} onClick={handlePopperClick}>
                    <SearchIcon sx={{ color: '#637381', fontSize: '22px' }} />
                    <input
                        className={cx('searchInput')}
                        placeholder="Thêm mới sản phẩm vào đơn"
                        value={inputSearchProduct}
                        onChange={handleInputSearchChange}
                    ></input>
                </div>
                <div className={cx('toolSection')}>
                    <Link to="/" className={cx('toAdmin')}>
                        <Tooltip title="Quay về trang quản trị">
                            <HomeIcon />
                        </Tooltip>
                    </Link>
                    <div className={cx('nameStore')}>
                        <StorefrontIcon />
                        <span>Shop Vip</span>
                    </div>
                </div>
            </div>

            <Popper open={open} anchorEl={anchorEl}>
                <div className={cx('popper')}>
                    <div className={cx('innerPopper', 'addProduct')} onClick={handleButtonAddNewProduct}>
                        <AddIcon className={cx('iconInPopper')} />
                        <div className={cx('verticalDividing')}></div>
                        <span>Thêm mới sản phẩm</span>
                    </div>
                    {products?.map((product, index) => (
                        <div
                            key={index}
                            className={cx('innerPopper', 'itemProduct')}
                            onClick={() => {
                                handleClickAddNewProduct(product);
                            }}
                        >
                            <div className={cx('imageProduct')}>
                                {product.image ? (
                                    <div className={cx('alignImageProduct')}>
                                        <img alt="image product" src={product.image}></img>
                                    </div>
                                ) : (
                                    <DefaultIcon />
                                )}
                            </div>
                            <div className={cx('verticalDividing')}></div>
                            <div className={cx('contentProduct')}>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('nameProduct')}>{product.name}</span>
                                    <span className={cx('priceProduct')}>{product.retailPrice}</span>
                                </div>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('codeProduct')}>{product.sku}</span>
                                    <span className={cx('quantityProduct')}>Có thể bán: {product.quantity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Popper>
        </div>
    );
}

export default Header;
