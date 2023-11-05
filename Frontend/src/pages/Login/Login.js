import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import sapoLogo from '../../images/logo192.png';
import validator from 'validator';
import { toast, ToastContainer } from 'react-toastify';

import { login } from '../../services/auth/login';
import { AuthContext } from '../../contexts/AuthContex';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import classNames from 'classnames/bind';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

const defaultTheme = createTheme();

export default function Login() {
    const { handleLoggedin } = React.useContext(AuthContext);
    const [isPhoneEmpty, setIsPhoneEmpty] = React.useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const payload = {
            phone: data.get('phone'),
            password: data.get('password'),
        };

        if (validator.isEmpty(payload.phone)) {
            setIsPhoneEmpty(true);
        }

        if (validator.isEmpty(payload.password)) {
            setIsPasswordEmpty(true);
        }

        if (!validator.isEmpty(payload.phone) && !validator.isEmpty(payload.password)) {
            login(payload)
                .then((res) => {
                    const token = res.data.token;
                    const user = res.data.userInfoDto;
                    handleLoggedin(token, user);
                    navigate('/');
                })
                .catch((err) => {
                    toast.error('Sai thông tin đăng nhập !');
                });
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <ToastContainer />
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img className={cx('img')} src={sapoLogo} alt="logo" />
                    <Typography component="h1" variant="h5">
                        Đăng nhập
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Số điện thoại"
                            error={isPhoneEmpty}
                            helperText={isPhoneEmpty && 'Bạn phải điền số điện thoại'}
                            name="phone"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type="password"
                            error={isPasswordEmpty}
                            helperText={isPasswordEmpty && 'Bạn phải điền mật khẩu'}
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Đăng nhập
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Quên mật khẩu?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {'Đăng ký'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
