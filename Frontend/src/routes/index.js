import routesConfig from '../config/routes';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';

//import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
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
    { path: routesConfig.notfound404, component: NotFound404, title: '' },
    { path: routesConfig.forbiden403, component: Forbiden403, title: '' },
];

export { publicRoutes, privateRoutes };
