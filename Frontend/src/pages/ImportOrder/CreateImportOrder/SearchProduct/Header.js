import { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Popper from '@mui/material/Popper';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { DefaultIcon } from '../../../../components/Icons';
import { AuthContext } from '../../../../contexts/AuthContex';
import * as VariantsServices from '../../../../services/VariantsServices';

const cx = classNames.bind(styles);

function Header({ onButtonAddNewCustomer, onDataFromHeader }) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { token } = useContext(AuthContext);
    const [inputSearchProduct, setInputSearchProduct] = useState('');

    const [products, setProducts] = useState([]);

    const handlePopperClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleButtonAddNewProduct = () => {
        // Gọi hàm xử lý được truyền từ component cha
        onButtonAddNewCustomer();
    };

    const handleClickAddNewProduct = (product) => {
            console.log(product);
            onDataFromHeader(product);
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
                console.log(result);
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
                        placeholder="Thêm sản phẩm vào đơn nhập"
                        value={inputSearchProduct}
                        onChange={handleInputSearchChange}
                    ></input>
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
                                        <img alt="product" src={product.image}></img>
                                    </div>
                                ) : (
                                    <DefaultIcon />
                                )}
                            </div>
                            <div className={cx('verticalDividing')}></div>
                            <div className={cx('contentProduct')}>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('nameProduct')}>{product.name}</span>
                                    <span className={cx('priceProduct')}>{product.importPrice}</span>
                                </div>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('codeProduct')}>{product.sku}</span>
                                    <span className={cx('quantityProduct')}>Tồn kho: {product.quantity}</span>
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
