import classNames from 'classnames/bind';
import styles from './Forbiden403.module.scss';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import routes from '../../config/routes';

const cx = classNames.bind(styles);

function Forbiden403() {
    const navigate = useNavigate();
    return (
        <>
        <div className={cx('wrap')}>
            <img src='https://res.cloudinary.com/dnfqh0xor/image/upload/v1695115050/blajwtizdnszfowcozd9.png' alt=""/>
            <Button variant="contained" onClick={() => navigate(routes.home)}>Quay lại trang chủ</Button>
            <p>Bạn không có quyền truy cập trang này!</p>
            <span>Hãy liên hệ với quản trị viên để cấp quyền truy cập</span>
        </div>
        </>
    )
}

export default Forbiden403;