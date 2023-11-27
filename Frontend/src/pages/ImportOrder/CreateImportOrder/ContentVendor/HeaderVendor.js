import { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Popper from '@mui/material/Popper';
import 'react-toastify/dist/ReactToastify.css';
import styles from './HeaderVendor.module.scss';
import classNames from 'classnames/bind';
import { DefaultIcon } from '../../../../components/Icons';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../../../../contexts/AuthContex';
import { getListVendor } from '../../../../services/vendorService/getListVendor';

const cx = classNames.bind(styles);

function HeaderVendor({ onButtonAddNewVendor, onDataFromHeaderVendor }) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { token } = useContext(AuthContext);
    const [inputSearchProduct, setInputSearchProduct] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [vendors, setVendors] = useState([]);

    const handlePopperClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleButtonAddNewVendor = () => {
        // Gọi hàm xử lý được truyền từ component cha
        onButtonAddNewVendor();
    };

    const handleClickAddVendor = (vendor) => {
        console.log(vendor);
        onDataFromHeaderVendor(vendor);
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
        document.title = 'Tạo đơn nhập hàng';
        const fetchApi = async () => {
            try {
                const result = await getListVendor(token);
                console.log(result);
                setVendorList(result);
                setVendors(result);
            } catch (error) {
                console.log('fetchApi getAllVariantsServices' + error);
            }
        };
        fetchApi();
    }, [open, token]);

    useEffect(() => {
        if(!inputSearchProduct){
            setVendors(vendorList);
        } else{
            const filteredResults = vendors.filter((result) => {
                return result.name.toLowerCase().includes(inputSearchProduct);
            });
            setVendors(filteredResults);
        }
    }, [inputSearchProduct, vendorList, vendors]);

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
                        placeholder="Thêm nhà cung vào đơn nhập"
                        value={inputSearchProduct}
                        onChange={handleInputSearchChange}
                    ></input>
                </div>
            </div>

            <Popper open={open} anchorEl={anchorEl}>
                <div className={cx('popper')}>
                    <div className={cx('innerPopper', 'addProduct')} onClick={handleButtonAddNewVendor}>
                        <AddIcon className={cx('iconInPopper')} />
                        <div className={cx('verticalDividing')}></div>
                        <span>Thêm mới nhà cung cấp</span>
                    </div>
                    {vendors?.map((vendor, index) => (
                        <div
                            key={index}
                            className={cx('innerPopper', 'itemProduct')}
                            onClick={() => {
                                handleClickAddVendor(vendor);
                            }}
                        >
                            <div className={cx('imageProduct')}>
                                {vendor.image ? (
                                    <div className={cx('alignImageProduct')}>
                                        <img alt="vendor" src={vendor.image}></img>
                                    </div>
                                ) : (
                                    <DefaultIcon />
                                )}
                            </div>
                            <div className={cx('verticalDividing')}></div>
                            <div className={cx('contentProduct')}>
                                <div className={cx('innerContentProduct')}>
                                    <span className={cx('nameProduct')}>{vendor.name}</span>
                                    <span className={cx('priceProduct')}>SĐT: {vendor.phone}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Popper>
        </div>
    );
}

export default HeaderVendor;
