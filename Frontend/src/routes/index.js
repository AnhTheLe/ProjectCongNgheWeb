import routesConfig from '../config/routes';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';

//import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Order from '../pages/Order';
import OrderList from '../pages/OrderList';
import OrderReturnList from '../pages/OrderReturnList';
import SalesCounter from '../pages/SalesCounter';
import CustomerAll from '../pages/CustomerCare/CustomerAll';
import CustomerCreate from '../pages/CustomerCare/CustomerCreate';
import CustomerDetail from '../pages/CustomerCare/CustomerDetail';
import CustomerGroup from '../pages/CustomerCare/CustomerGroup/CustomerGroup';
import CustomerCreateGroup from '../pages/CustomerCare/CustomerGroup/CustomerCreateGroup';
import CustomerDetailGroup from '../pages/CustomerCare/CustomerGroup/CustomerDetailGroup';
import CustomerUpdate from '../pages/CustomerCare/CustomerDetail/CustomerUpdate';
import CustomerResponse from '../pages/CustomerCare/CustomerResponse';
import ImportOrderList from '../pages/ImportOrder/ImportOrderList';
import ImportOrderDetail from '../pages/ImportOrder/ImportOrderDetail';
import CreateImportOrder from '../pages/ImportOrder/CreateImportOrder';
import VendorList from '../pages/Vendor/VendorList/VendorList';
import VendorDetail from '../pages/Vendor/VendorDetail/VendorDetail';
import UpdateVendor from '../pages/Vendor/UpdateVendor/UpdateVendor';
import CreateVendor from '../pages/Vendor/CreateVendor/CreateVendor';
import ProductList from '../pages/Products/ProductList';
import ProductDetail from '../pages/Products/ProductDetail';
import ProductCreate from '../pages/Products/ProductCreate';
import ProductUpdate from '../pages/Products/ProductUpdate';
import CreateOrderReturn from '../pages/CreateOrderReturn/CreateOrderReturn';
import OrderReturnDetail from '../pages/OrderReturnDetail/OrderReturnDetail';
import StatisticsGeneral from '../pages/Statistical/StatisticsGeneral';
import StatisticsSales from '../pages/Statistical/StatisticsSales';
import StatisticsImport from '../pages/Statistical/StatisticsImport';
import BalanceCreate from '../pages/Balance/BalanceCreate';
import BalanceList from '../pages/Balance/BalanceList';
import BalanceDetail from '../pages/Balance/BalanceDetail';
import StaffList from '../pages/StaffList';
import StaffDetail from '../pages/StaffDetail';
import Shop from '../pages/Shop/Shop';
import StaffCreate from '../pages/StaffCreate';
import NotFound404 from '../pages/NotFound404/NotFound404';
import Forbiden403 from '../pages/Forbiden403/Forbiden403';

//import layout

//public route

const publicRoutes = [
    { path: routesConfig.login, component: Login, layout: AuthLayout },
    { path: routesConfig.signup, component: Signup, layout: AuthLayout },
];

const privateRoutes = [
    { path: routesConfig.home, component: Home, title: 'Tổng quan' },
    { path: routesConfig.salesCounter, component: SalesCounter, layout: null },
    { path: routesConfig.customerDetail, component: CustomerDetail, title: 'Chi tiết khách hàng' },
    { path: routesConfig.customerUpdate, component: CustomerUpdate, title: 'Cập nhật thông tin khách hàng' },
    { path: routesConfig.customerGroup, component: CustomerGroup, title: 'Danh sách nhóm khách hàng' },
    { path: routesConfig.customerDetailGroup, component: CustomerDetailGroup, title: 'Chi tiết nhóm khách hàng' },
    { path: routesConfig.customerCreateGroup, component: CustomerCreateGroup, title: 'Thêm mới nhóm khách hàng' },
    { path: routesConfig.customerResponse, component: CustomerResponse, title: 'Danh sách phản hồi' },
    { path: routesConfig.productList, component: ProductList, title: 'Danh sách sản phẩm' },
    { path: routesConfig.productDetail1, component: ProductDetail, title: 'Chi tiết sản phẩm' },
    { path: routesConfig.productDetail2, component: ProductDetail, title: 'Chi tiết sản phẩm' },
    { path: routesConfig.productCreate, component: ProductCreate, title: 'Tạo sản phẩm' },
    { path: routesConfig.productUpdate1, component: ProductUpdate, title: 'Cập nhật sản phẩm' },
    { path: routesConfig.productUpdate2, component: ProductUpdate, title: 'Cập nhật sản phẩm' },
    { path: routesConfig.orderReturnDetail, component: OrderReturnDetail, title: 'Chi tiết đơn trả hàng' },
    { path: routesConfig.ordersReturn, component: OrderReturnList, title: 'Danh sách đơn trả hàng' },
    { path: routesConfig.order, component: Order, title: 'Chi tiết đơn hàng' },
    { path: routesConfig.orderList, component: OrderList, title: 'Danh sách đơn hàng' },
    { path: routesConfig.createReturnOrder, component: CreateOrderReturn, title: 'Tạo đơn trả hàng' },
    { path: routesConfig.customerAll, component: CustomerAll, title: 'Danh sách khách hàng' },
    { path: routesConfig.customerCreate, component: CustomerCreate, title: 'Thêm mới khách hàng' },
    { path: routesConfig.orderDetail, component: CustomerUpdate, title: 'Chi tiết đơn hàng' },
    { path: routesConfig.statisticsGeneral, component: StatisticsGeneral, title: 'Thống kê chung' },
    { path: routesConfig.statisticsSales, component: StatisticsSales, title: 'Thống kê bán hàng' },
    { path: routesConfig.statisticsImport, component: StatisticsImport, title: 'Thống kê nhập hàng' },
    { path: routesConfig.balancesCreate, component: BalanceCreate, title: 'Tạo phiếu kiểm hàng' },
    { path: routesConfig.balancesList, component: BalanceList, title: 'Danh sách kiểm hàng' },
    { path: routesConfig.balancesDetail, component: BalanceDetail, title: 'Chi tiết phiếu kiểm' },
    { path: routesConfig.create_import_order, component: CreateImportOrder, title: 'Tạo đơn nhập hàng' },
    { path: routesConfig.detail_import_order, component: ImportOrderDetail, title: 'Chi tiết đơn nhập hàng' },
    { path: routesConfig.import_order, component: ImportOrderList, title: 'Danh sách đơn nhập hàng' },
    { path: routesConfig.create_vendor, component: CreateVendor, title: 'Thêm mới nhà cung cấp' },
    { path: routesConfig.vendor_update, component: UpdateVendor, title: 'Cập nhật thông tin nhà cung cấp'},
    { path: routesConfig.vendor_detail, component: VendorDetail, title: 'Chi tiết nhà cung cấp'},
    { path: routesConfig.vendor_list, component: VendorList, title: 'Danh sách nhà cung cấp' },
    { path: routesConfig.staffList, component: StaffList, title: 'Quản lý nhân viên' },
    { path: routesConfig.staffDetail, component: StaffDetail, title: 'Thông tin nhân viên'},
    { path: routesConfig.staffCreate, component: StaffCreate, title: 'Thêm mới nhân viên'},
    { path: routesConfig.shopInfo, component: Shop, title: 'Thông tin cửa hàng' },
    { path: routesConfig.notfound404, component: NotFound404, title: '' },
    { path: routesConfig.forbiden403, component: Forbiden403, title: '' },
];

export { publicRoutes, privateRoutes };
