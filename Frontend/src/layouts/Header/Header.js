import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContex';

const cx = classNames.bind(styles);

function Header({ title }) {
    const { user } = useContext(AuthContext);
    console.log('user:', user);

    return (
        <div className={cx('wrapHeader')}>
            <h3>{title}</h3>
            <div className={cx('group')}>
                <div className={cx('sub')}>
                    <svg width="24" height="24">
                        <path></path>
                    </svg>
                    <FontAwesomeIcon style={{ fontSize: '28px' }} icon={faCircleUser} />
                    <p>{user.fullName}</p>
                </div>
            </div>
        </div>
    );
}

export default Header;
