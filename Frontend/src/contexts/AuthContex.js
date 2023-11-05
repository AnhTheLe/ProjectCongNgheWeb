import { createContext, useEffect, useState } from 'react';
import { verifyToken } from '../services/auth/verifyToken';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            verifyToken(token)
                .then((res) => {
                    setUser(res.data);
                    setToken(token);
                })
                .catch((err) => {
                    setToken(null);
                });
        }
    }, []);

    const handleLoggedin = (token, user) => {
        localStorage.setItem('token', token);

        setUser(user);
        setToken(token);
    };

    const handleLoggedOut = () => {
        localStorage.removeItem('token');

        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        handleLoggedin,
        handleLoggedOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
