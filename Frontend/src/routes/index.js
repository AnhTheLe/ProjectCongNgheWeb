import routesConfig from '../config/routes';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';

//import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Order from '../pages/Order';
import OrderList from '../pages/OrderList';
import CustomerAll from '../pages/CustomerCare/CustomerAll';
import CustomerCreate from '../pages/CustomerCare/CustomerCreate';
import CustomerDetail from '../pages/CustomerCare/CustomerDetail';
import ImportOrderDetail from '../pages/ImportOrder/ImportOrderDetail';
import CreateImportOrder from '../pages/ImportOrder/CreateImportOrder';
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
];

export { publicRoutes, privateRoutes };
