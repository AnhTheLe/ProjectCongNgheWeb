import { Fragment, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { AuthContext } from './contexts/AuthContex';

import { publicRoutes, privateRoutes } from '../../sale-management/src/routes';
import DefaultLayout from '../../sale-management/src/layouts/DefaultLayout';

function App() {
    const { token } = useContext(AuthContext);

    return (
        <div className="App">
            {/* {console.log('app user login', user)} */}
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout title={route.title} link={route.link} btn_title={route.btn_title}>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {/* privateRoutes */}
                {token && // Kiểm tra user có tồn tại hay không
                    privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout title={route.title}>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}

                {/* Điều hướng mặc định */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;
