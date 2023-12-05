import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './StatisticsSales.module.scss';
import { DailySalesChart, WeeklySalesChart, MonthlySalesChart } from '../../../components/Charts/Charts';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Select from 'react-select';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PrintIcon from '@mui/icons-material/Print';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import ReactToPrint from 'react-to-print';
import PDFFile from '../../../components/PDFFile/PDFFile';
import PrintReport from '../../../components/Modal/PrintReport';

import { AuthContext } from '../../../contexts/AuthContex';
import * as OrderServices from '../../../services/OrderServices';
import moment from 'moment';

const cx = classNames.bind(styles);

const optionsStatisticsOrder = [
    { value: 'day', label: 'Thống kê theo ngày' },
    { value: 'week', label: 'Thống kê theo tuần' },
    { value: 'month', label: 'Thống kê theo tháng' },
];

const optionsStatisticsRevenue = [
    { value: 'day', label: 'Thống kê theo ngày' },
    { value: 'week', label: 'Thống kê theo tuần' },
    { value: 'month', label: 'Thống kê theo tháng' },
];

const customStyles = {
    option: (provided, state) => ({
        ...provided,

        cursor: 'pointer',
    }),

    control: (provided) => ({
        ...provided,
        minHeight: '40px',
        width: '230px',
    }),
};

const today = dayjs().add(0, 'day');

function StatisticsSales() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const componentRef = useRef();

    const [selectedStatisticOrder, setSelectedStatisticOrder] = useState({ value: 'day', label: 'Thống kê theo ngày' });
    const [selectedStatisticRevenue, setSelectedStatisticRevenue] = useState({
        value: 'day',
        label: 'Thống kê theo ngày',
    });
    const [dataOrder, setDataOrder] = useState([]);
    const [dataRevenue, setDataRevenue] = useState([]);
    const [dayOrder, setDayOrder] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [dayRevenue, setDayRevenue] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });

    const [openPrintReport, setOpenPrintReport] = useState(false);

    const handleClosePrintReport = () => setOpenPrintReport(false);
    const handleOpenPrintReport = (content) => {
        setOpenPrintReport(true);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.statisticalListByTime(
                    moment(dayOrder.startDate).format('YYYY/MM/DD'),
                    moment(dayOrder.endDate).add(1, 'days').format('YYYY/MM/DD'),
                    token,
                );

                setDataOrder(
                    result.data.map((item) => {
                        return {
                            date: moment(item.createdAt).format('YYYY/MM/DD'),
                            value: item.orderNumber,
                        };
                    }),
                );

                // setDataOrder([
                //     { date: '2023-01-01', value: 100 },
                //     { date: '2023-02-02', value: 150 }])

                // setDataStatistic(result.data);
            } catch (error) {
                console.log('fetchApi statisticalListByTime StatisticsSale.js' + error);
            }
        };
        fetchApi();
    }, [dayOrder.endDate, dayOrder.startDate, token]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.statisticalListByTime(
                    moment(dayRevenue.startDate).format('YYYY/MM/DD'),
                    moment(dayRevenue.endDate).add(1, 'days').format('YYYY/MM/DD'),
                    token,
                );

                setDataRevenue(
                    result.data.map((item) => {
                        return {
                            date: moment(item.createdAt).format('YYYY/MM/DD'),
                            value: item.revenue,
                        };
                    }),
                );

                // setDataOrder([
                //     { date: '2023-01-01', value: 100 },
                //     { date: '2023-02-02', value: 150 }])

                // setDataStatistic(result.data);
            } catch (error) {
                console.log('fetchApi statisticalListByTime StatisticsSale.js' + error);
            }
        };
        fetchApi();
    }, [dayRevenue.endDate, dayRevenue.startDate, token]);

    const handleStatisticOrderChange = (selectedOption) => {
        setSelectedStatisticOrder(selectedOption);
    };

    const handleStatisticRevenueChange = (selectedOption) => {
        setSelectedStatisticRevenue(selectedOption);
    };

    const handleDateOrderStartChange = (date) => {
        setDayOrder((prev) => {
            return { ...prev, startDate: date.$d };
        });
        setDayRevenue((prev) => {
            return { ...prev, startDate: date.$d };
        });
    };

    const handleDateOrderEndChange = (date) => {
        if (date.$d < dayOrder.startDate) {
            toast.error('Lỗi ngày bắt đầu lớn hơn ngày kết thúc');
        } else {
            setDayOrder((prev) => {
                return { ...prev, endDate: date.$d };
            });
            setDayRevenue((prev) => {
                return { ...prev, endDate: date.$d };
            });
        }
    };

    const handleDateRevenueStartChange = (date) => {
        setDayRevenue((prev) => {
            return { ...prev, startDate: date.$d };
        });
    };

    const handleDateRevenueEndChange = (date) => {
        if (date.$d < dayRevenue.startDate) {
            toast.error('Lỗi ngày bắt đầu lớn hơn ngày kết thúc');
        } else {
            setDayRevenue((prev) => {
                return { ...prev, endDate: date.$d };
            });
        }
    };

    const handleDateChange = (date) => {
        console.log(date);
        console.log(date.$D, date.$M + 1, date.$y);
        const ngayDate = dayjs(`${date.$y}-${date.$M + 1}-${date.$D}`).toDate();
        console.log(date.$d);
        // setDay(date);
    };

    const weeklyData = (data) => {
        return data.reduce((result, item) => {
            const weekNumber = getWeekNumber(new Date(item.date));
            if (!result[weekNumber]) {
                result[weekNumber] = { week: `Tuần ${weekNumber}`, value: 0 };
            }
            result[weekNumber].value += item.value;
            return result;
        }, {});
    };

    const monthlyData = (data) => {
        return data.reduce((result, item) => {
            const month = item.date.substring(0, 7);
            if (!result[month]) {
                result[month] = { month, value: 0 };
            }
            result[month].value += item.value;
            return result;
        }, {});
    };

    function getWeekNumber(date) {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / 86400000);
        return Math.ceil((days + startDate.getDay() + 1) / 7);
    }

    const handleCreateReport = () => {
        console.log('create report');
    };

    return (
        <>
            {/* <PrintReport openModal={openPrintReport} closeModal={handleClosePrintReport} /> */}
            <ToastContainer />
            <div style={{ display: 'none' }}>
                <PDFFile componentRef={componentRef} dayRequest={dayOrder} />
            </div>
            <div className={cx('wrap')}>
                <div className={cx('header')}>
                    {/* <Button variant="contained" startIcon={<PrintIcon />} onClick={handleOpenPrintReport}>
                        In báo cáo
                    </Button> */}
                    <ReactToPrint
                        trigger={() => {
                            return (
                                <Button variant="contained" startIcon={<PrintIcon />}>
                                    In báo cáo
                                </Button>
                            );
                        }}
                        content={() => componentRef.current}
                    />
                </div>
                <div className={cx('content')}>
                    <div className={cx('contentTitle')}>Thống kê</div>
                    <div className={cx('contentHeader')}>
                        <div className={cx('optionsStatistic')}>
                            <span>Chọn loại thống kê</span>
                            <div className={cx('innerOptionsStatistic')}>
                                <Select
                                    value={selectedStatisticOrder}
                                    onChange={handleStatisticOrderChange}
                                    options={optionsStatisticsOrder}
                                    styles={customStyles}
                                    placeholder="Chọn nhóm bán hàng"
                                />
                            </div>
                        </div>
                        <div className={cx('dateStatistic')}>
                            <div className={cx('wrapDatePicker')}>
                                <span>Từ ngày</span>
                                <div style={{ width: '230px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            defaultValue={dayjs().add(0, 'day')}
                                            onChange={handleDateOrderStartChange}
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <span className={cx('lineTo')}></span>
                            <div className={cx('wrapDatePicker')}>
                                <span>Tới ngày</span>
                                <div style={{ width: '230px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            defaultValue={dayjs().add(0, 'day')}
                                            onChange={handleDateOrderEndChange}
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('wraContentBody')}>
                        <div className={cx('contentBody')}>
                            <div className={cx('contentBodyTitle')}>
                                <span>
                                    Thống kê số lượng đơn hàng theo{' '}
                                    {selectedStatisticOrder.value === 'day' && <span>ngày</span>}
                                    {selectedStatisticOrder.value === 'week' && <span>tuần</span>}
                                    {selectedStatisticOrder.value === 'month' && <span>tháng</span>}
                                </span>
                            </div>
                            <div className={cx('contentBodyCharts')}>
                                {selectedStatisticOrder.value === 'day' && (
                                    <DailySalesChart data={dataOrder} nameChart="đơn" />
                                )}
                                {selectedStatisticOrder.value === 'week' && (
                                    <WeeklySalesChart data={Object.values(weeklyData(dataOrder))} nameChart="đơn" />
                                )}
                                {selectedStatisticOrder.value === 'month' && (
                                    <MonthlySalesChart data={Object.values(monthlyData(dataOrder))} nameChart="đơn" />
                                )}
                            </div>
                        </div>

                        <div className={cx('contentBody')}>
                            <div className={cx('contentBodyTitle')}>
                                <span>
                                    Thống kê doanh thu theo{' '}
                                    {selectedStatisticOrder.value === 'day' && <span>ngày</span>}
                                    {selectedStatisticOrder.value === 'week' && <span>tuần</span>}
                                    {selectedStatisticOrder.value === 'month' && <span>tháng</span>}
                                </span>
                            </div>
                            <div className={cx('contentBodyCharts')}>
                                {selectedStatisticOrder.value === 'day' && (
                                    <DailySalesChart data={dataRevenue} nameChart="doanh thu" />
                                )}
                                {selectedStatisticOrder.value === 'week' && (
                                    <WeeklySalesChart
                                        data={Object.values(weeklyData(dataRevenue))}
                                        nameChart="doanh thu"
                                    />
                                )}
                                {selectedStatisticOrder.value === 'month' && (
                                    <MonthlySalesChart
                                        data={Object.values(monthlyData(dataRevenue))}
                                        nameChart="doanh thu"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className={cx('wrap')}>
                <div className={cx('content')}>
                    <div className={cx('contentTitle')}>Thống kê doanh thu</div>
                    <div className={cx('contentHeader')}>
                        <div className={cx('optionsStatistic')}>
                            <span>Chọn loại thống kê</span>
                            <div className={cx('innerOptionsStatistic')}>
                                <Select
                                    value={selectedStatisticRevenue}
                                    onChange={handleStatisticRevenueChange}
                                    options={optionsStatisticsRevenue}
                                    styles={customStyles}
                                    placeholder="Chọn nhóm bán hàng"
                                />
                            </div>
                        </div>
                        <div className={cx('dateStatistic')}>
                            <div className={cx('wrapDatePicker')}>
                                <span>Từ ngày</span>
                                <div style={{ width: '230px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            defaultValue={dayjs().add(0, 'day')}
                                            onChange={handleDateRevenueStartChange}
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <span className={cx('lineTo')}></span>
                            <div className={cx('wrapDatePicker')}>
                                <span>Tới ngày</span>
                                <div style={{ width: '230px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            defaultValue={dayjs().add(0, 'day')}
                                            onChange={handleDateRevenueEndChange}
                                            disableFuture
                                            views={['day', 'month', 'year']}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('contentBody')}>
                        <div className={cx('contentBodyTitle')}>
                            <span>
                                Thống kê doanh thu theo {selectedStatisticRevenue.value === 'day' && <span>ngày</span>}
                                {selectedStatisticRevenue.value === 'week' && <span>tuần</span>}
                                {selectedStatisticRevenue.value === 'month' && <span>tháng</span>}
                            </span>
                        </div>
                        <div className={cx('contentBodyCharts')}>
                            {selectedStatisticRevenue.value === 'day' && (
                                <DailySalesChart data={dataRevenue} nameChart="doanh thu" />
                            )}
                            {selectedStatisticRevenue.value === 'week' && (
                                <WeeklySalesChart data={Object.values(weeklyData(dataRevenue))} nameChart="doanh thu" />
                            )}
                            {selectedStatisticRevenue.value === 'month' && (
                                <MonthlySalesChart
                                    data={Object.values(monthlyData(dataRevenue))}
                                    nameChart="doanh thu"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
}

export default StatisticsSales;
