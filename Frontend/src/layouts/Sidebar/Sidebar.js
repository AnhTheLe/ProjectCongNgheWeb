import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { HomeIcon, OrderIcon, ProductIcon, ClientIcon, StatsIcon, SalesCounterIcon } from '../../components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContex';
import routes from '../../config/routes';

const cx = classNames.bind(styles);

function Sidebar({ setToggleButton }) {
    const { handleLoggedOut, user } = useContext(AuthContext);
    const roles = user.roles?.map((item) => item.name);
    const [details, setDetails] = useState({
        showDetailOrder: false,
        showDetailProduct: false,
        showDetailClient: false,
        showDetailCustomerCare: false,
        showDetailWarehouse: false,
        showDetailStats: false,
        showDetailManage: false,
    });

    const [active, setActive] = useState({
        home: true,
        listOrder: false,
        returnOrder: false,
        listProduct: false,
        listProvider: false,
        listCustomer: false,
        listResponse: false,
        importWarehouse: false,
        statisticSale: false,
        manageStaff: false,
    });
    const [toggle, setToggle] = useState({
        action: false,
        value: 0,
    });

    const handleShowDetail = (detailName) => {
        setDetails((prevState) => ({
            showDetailOrder: false,
            showDetailProduct: false,
            showDetailClient: false,
            showDetailCustomerCare: false,
            showDetailWarehouse: false,
            showDetailStats: false,
            showDetailManage: false,
            manageStaff: false,
            [detailName]: !prevState[detailName],
        }));
    };

    const handleActive = (detailName) => {
        setActive((prevState) => ({
            home: false,
            listOrder: false,
            returnOrder: false,
            listProduct: false,
            listProvider: false,
            listCustomer: false,
            listResponse: false,
            importWarehouse: false,
            statisticSale: false,
            [detailName]: true,
        }));
    };

    const handleToggle = () => {
        if (toggle.action) {
            setToggle({
                action: false,
                value: 0,
                display: 'block',
            });
            console.log(setToggleButton());

            setToggleButton({
                action: false,
                value: 0,
            });
        } else {
            setToggle({
                action: true,
                value: 178,
                display: 'none',
            });
            console.log(setToggleButton());
            setToggleButton({
                action: true,
                value: 178,
            });
        }
    };

    return (
        <div className={cx('wrapper')} style={{ width: `calc(230px - ${toggle.value}px)` }}>
            <nav>
                <div className={cx('menuTopHeader')}>
                    <div className={cx('menuTopLogo')}>
                        {!toggle.action && (
                            <a href="/">
                                <img
                                    src="https://sapo.dktcdn.net/fe-cdn-production/images/logo_sapo_white.svg"
                                    className={cx('logo')}
                                    alt="logoSapo"
                                ></img>
                            </a>
                        )}
                        <button className={cx('buttonArrowLeft')} onClick={handleToggle}>
                            {toggle.action ? (
                                <FontAwesomeIcon className={cx('iconArrowLeft')} icon={faAngleRight} />
                            ) : (
                                <FontAwesomeIcon className={cx('iconArrowLeft')} icon={faAngleLeft} />
                            )}
                        </button>
                    </div>
                </div>
                <hr className={cx('menuDivider')}></hr>

                <div className={cx('menuInnerWrapper')}>
                    <div className={cx('menuPrimaryInner')}>
                        <nav className={cx('menuList')}>
                            <Link
                                to="/"
                                className={cx('homeMenuItem', 'itemNav', { active: active.home })}
                                onClick={() => handleActive('home')}
                            >
                                <div className={cx('wrapIconItem')}>
                                    <HomeIcon />
                                </div>
                                {!toggle.action && (
                                    <div className={cx('menuItemTitle')}>
                                        <span>Tổng quan</span>
                                    </div>
                                )}
                            </Link>

                            {roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE') && (
                                <>
                                    {/* Đơn hàng */}
                                    <div
                                        className={cx('homeMenuItem', 'itemNav', {
                                            active: active.listOrder || active.returnOrder,
                                        })}
                                        onClick={() => handleShowDetail('showDetailOrder')}
                                    >
                                        <div className={cx('wrapIconItem')}>
                                            <OrderIcon />
                                        </div>
                                        {!toggle.action && (
                                            <>
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Đơn hàng</span>
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        className={cx('iconArrowRight', {
                                                            activeIcon: details.showDetailOrder,
                                                        })}
                                                        icon={faAngleRight}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Chi tiết trong đơn hàng */}
                                    {!toggle.action && (
                                        <div
                                            className={cx('wrapCollapseItem', {
                                                showCollapseItem: details.showDetailOrder,
                                            })}
                                        >
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) => permission === 'ADMIN' || permission === 'SALE',
                                                    )
                                                        ? '/orders'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('listOrder')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Danh sách đơn hàng</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) => permission === 'ADMIN' || permission === 'SALE',
                                                    )
                                                        ? '/order_returns'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('returnOrder')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Khách trả hàng</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Sản phẩm */}
                            <div
                                className={cx('homeMenuItem', 'itemNav', {
                                    active: active.listProduct || active.listProvider,
                                })}
                                onClick={() => handleShowDetail('showDetailProduct')}
                            >
                                <div className={cx('wrapIconItem')}>
                                    <ProductIcon />
                                </div>
                                {!toggle.action && (
                                    <>
                                        <div className={cx('menuItemTitle')}>
                                            <span>Sản phẩm</span>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon
                                                className={cx('iconArrowRight', {
                                                    activeIcon: details.showDetailProduct,
                                                })}
                                                icon={faAngleRight}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* Chi tiết trong sản phẩm */}
                            {!toggle.action && (
                                <div
                                    className={cx('wrapCollapseItem', { showCollapseItem: details.showDetailProduct })}
                                >
                                    <Link
                                        to="/admin/base-products"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                        onClick={() => handleActive('listProduct')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Danh sách sản phẩm</span>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/vendor_list"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                        onClick={() => handleActive('listProvider')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Danh sách nhà cung cấp</span>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {roles?.some(
                                (permission) =>
                                    permission === 'ADMIN' || permission === 'SALE' || permission === 'CARE',
                            ) && (
                                <>
                                    {/* Khách hàng */}
                                    <div
                                        className={cx('homeMenuItem', 'itemNav', {
                                            active: active.listCustomer || active.listResponse,
                                        })}
                                        onClick={() => handleShowDetail('showDetailClient')}
                                    >
                                        <div className={cx('wrapIconItem')}>
                                            <ClientIcon />
                                        </div>
                                        {!toggle.action && (
                                            <>
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Khách hàng</span>
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        className={cx('iconArrowRight', {
                                                            activeIcon: details.showDetailClient,
                                                        })}
                                                        icon={faAngleRight}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Chi tiết trong khách hàng */}
                                    {!toggle.action && (
                                        <div
                                            className={cx('wrapCollapseItem', {
                                                showCollapseItem: details.showDetailClient,
                                            })}
                                        >
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) =>
                                                            permission === 'ADMIN' ||
                                                            permission === 'SALE' ||
                                                            permission === 'CARE',
                                                    )
                                                        ? '/customer_all'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('listCustomer')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Danh sách khách hàng</span>
                                                </div>
                                            </Link>
                                            {/* <Link
                                        to={
                                            roles?.some(
                                                (permission) =>
                                                    permission === 'ADMIN' ||
                                                    permission === 'SALE' ||
                                                    permission === 'CARE',
                                            )
                                                ? '/customer_group'
                                                : '/403'
                                        }
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                        onClick={() => handleActive('listCustomer')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Nhóm khách hàng</span>
                                        </div>
                                    </Link> */}
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) =>
                                                            permission === 'ADMIN' ||
                                                            permission === 'SALE' ||
                                                            permission === 'CARE',
                                                    )
                                                        ? '/customer_response'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('listResponse')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Danh sách phản hồi</span>
                                                </div>
                                            </Link>
                                            {/* <Link href="/" className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}>
                                        <div className={cx('menuItemTitle')}>
                                            <span>Nhóm khách hàng</span>
                                        </div>
                                    </Link> */}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Chăm sóc khách hàng */}
                            {/* <div
                                className={cx('homeMenuItem', 'itemNav')}
                                onClick={() => handleShowDetail('showDetailCustomerCare')}
                            >
                                <div className={cx('wrapIconItem')}>
                                    <SupportAgentIcon />
                                </div>
                                {!toggle.action && (
                                    <>
                                        <div className={cx('menuItemTitle')}>
                                            <span>Chăm sóc khách hàng</span>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon
                                                className={cx('iconArrowRight', {
                                                    activeIcon: details.showDetailCustomerCare,
                                                })}
                                                icon={faAngleRight}
                                            />
                                        </div>
                                    </>
                                )}
                            </div> */}
                            {/* Chi tiết chăm sóc khách hàng */}
                            {/* {!toggle.action && (
                                <div
                                    className={cx('wrapCollapseItem', {
                                        showCollapseItem: details.showDetailCustomerCare,
                                    })}
                                >
                                    <Link
                                        to="/customer_all"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Danh sách khách hàng</span>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/customer_response"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Danh sách phản hồi</span>
                                        </div>
                                    </Link>
                                </div>
                            )} */}

                            {roles?.some((permission) => permission === 'ADMIN' || permission === 'WAREHOUSE') && (
                                <>
                                    {/* Kho */}
                                    <div
                                        className={cx('homeMenuItem', 'itemNav', { active: active.importWarehouse })}
                                        onClick={() => handleShowDetail('showDetailWarehouse')}
                                    >
                                        <div className={cx('wrapIconItem')}>
                                            <WarehouseIcon />
                                        </div>
                                        {!toggle.action && (
                                            <>
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Kho</span>
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        className={cx('iconArrowRight', {
                                                            activeIcon: details.showDetailWarehouse,
                                                        })}
                                                        icon={faAngleRight}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Chi tiết trong kho */}
                                    {!toggle.action && (
                                        <div
                                            className={cx('wrapCollapseItem', {
                                                showCollapseItem: details.showDetailWarehouse,
                                            })}
                                        >
                                            {/* <Link
                                        to="/"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                        onClick={() => handleActive('importWarehouse')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Quản lý kho</span>
                                        </div>
                                    </Link> */}
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) =>
                                                            permission === 'ADMIN' || permission === 'WAREHOUSE',
                                                    )
                                                        ? '/import_order'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('importWarehouse')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Nhập hàng</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) =>
                                                            permission === 'ADMIN' || permission === 'WAREHOUSE',
                                                    )
                                                        ? '/admin/balances'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('importWarehouse')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Kiểm hàng</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}

                            {roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE') && (
                                <>
                                    {/* Thống kê */}
                                    <div
                                        className={cx('homeMenuItem', 'itemNav', { active: active.statisticSale })}
                                        onClick={() => handleShowDetail('showDetailStats')}
                                    >
                                        <div className={cx('wrapIconItem')}>
                                            <StatsIcon />
                                        </div>
                                        {!toggle.action && (
                                            <>
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Thống kê</span>
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        className={cx('iconArrowRight', {
                                                            activeIcon: details.showDetailStats,
                                                        })}
                                                        icon={faAngleRight}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Chi tiết trong thống kê */}
                                    {!toggle.action && (
                                        <div
                                            className={cx('wrapCollapseItem', {
                                                showCollapseItem: details.showDetailStats,
                                            })}
                                        >
                                            {/* <Link
                                        to="/statistics_general"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                        onClick={() => handleActive('statisticSale')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Thống kê chung</span>
                                        </div>
                                    </Link> */}
                                            <Link
                                                to={
                                                    roles?.some(
                                                        (permission) => permission === 'ADMIN' || permission === 'SALE',
                                                    )
                                                        ? '/statistics_sales'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('statisticSale')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Thống kê bán hàng</span>
                                                </div>
                                            </Link>
                                            {/* <Link
                                        to="/statistics_import"
                                        className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                        onClick={() => handleActive('statisticSale')}
                                    >
                                        <div className={cx('menuItemTitle')}>
                                            <span>Thống kê nhập hàng</span>
                                        </div>
                                    </Link> */}
                                        </div>
                                    )}
                                </>
                            )}

                            {roles?.some((permission) => permission === 'ADMIN') && (
                                <>
                                    {/* Quản lý */}
                                    <div
                                        className={cx('homeMenuItem', 'itemNav', {
                                            active: active.manageStaff,
                                        })}
                                        onClick={() => handleShowDetail('showDetailManage')}
                                    >
                                        <div className={cx('wrapIconItem')}>
                                            <ManageAccountsIcon />
                                        </div>
                                        {!toggle.action && (
                                            <>
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Quản lý</span>
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon
                                                        className={cx('iconArrowRight', {
                                                            activeIcon: details.showDetailManage,
                                                        })}
                                                        icon={faAngleRight}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Chi tiết trong quản lý */}
                                    {!toggle.action && (
                                        <div
                                            className={cx('wrapCollapseItem', {
                                                showCollapseItem: details.showDetailManage,
                                            })}
                                        >
                                            <Link
                                                to={
                                                    roles?.some((permission) => permission === 'ADMIN')
                                                        ? '/admin/staffs'
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('manageStaff')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Quản lý nhân viên</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to={
                                                    roles?.some((permission) => permission === 'ADMIN')
                                                        ? routes.shopInfo
                                                        : '/403'
                                                }
                                                className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                                                onClick={() => handleActive('manageStaff')}
                                            >
                                                <div className={cx('menuItemTitle')}>
                                                    <span>Thông tin cửa hàng</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}

                            <hr className={cx('menuDivider')}></hr>

                            {roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE') && (
                                <>
                                    <Link
                                        to={
                                            roles?.some((permission) => permission === 'ADMIN' || permission === 'SALE')
                                                ? '/sales_counter'
                                                : '/403'
                                        }
                                        className={cx('homeMenuItem', 'itemNav')}
                                    >
                                        <div className={cx('wrapIconItem')}>
                                            <SalesCounterIcon />
                                        </div>
                                        {!toggle.action && (
                                            <div className={cx('menuItemTitle')}>
                                                <span>Bán tại quầy</span>
                                            </div>
                                        )}
                                    </Link>
                                    <hr className={cx('menuDivider')}></hr>
                                </>
                            )}

                            <Link to="/login" className={cx('homeMenuItem', 'itemNav')} onClick={handleLoggedOut}>
                                <div className={cx('wrapIconItem')}>
                                    <LogoutIcon />
                                </div>
                                {!toggle.action && (
                                    <div className={cx('menuItemTitle')}>
                                        <span>Đăng xuất</span>
                                    </div>
                                )}
                            </Link>
                        </nav>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
