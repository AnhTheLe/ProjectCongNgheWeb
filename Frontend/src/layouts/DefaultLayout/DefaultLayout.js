import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

import Header from '../Header';
import Sidebar from '../Sidebar';
import { useState } from 'react';

const cx = classNames.bind(styles);

function DefaultLayout({ title, children }) {
    const [toggleButton, setToggleButton] = useState({
        action: false,
        value: 0,
    });

    return (
        <div className={cx('wrapper')}>
            <Sidebar setToggleButton={setToggleButton} />
            <div className={cx('wrapContent')} style={{ width: `calc(100% - 230px + ${toggleButton.value}px)`, marginLeft: `calc(230px - ${toggleButton.value}px)` }}>
                <Header title={title} />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
