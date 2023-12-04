import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './StatisticsGeneral.module.scss';
import PrintOrder from '../../../components/PDFFile/PrintOrder';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function StatisticsGeneral() {
    return (
        <div>
            <div>Thống kê chung</div>
        </div>
    );
}

export default StatisticsGeneral;
