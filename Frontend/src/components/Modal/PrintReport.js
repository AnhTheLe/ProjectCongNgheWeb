import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PDFFile from '../../components/PDFFile';
import ReactToPrint from 'react-to-print';

import { AuthContext } from '../../contexts/AuthContex';
import * as OrderServices from '../../services/OrderServices';
import moment from 'moment';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 300,
    borderRadius: '6px',
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
};

const optionsStatisticsOrder = [
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
        width: '280px',
    }),
};

function PrintReport({ openModal, closeModal }) {
    const [openPrintReport, setOpenPrintReport] = useState(false);
    const componentRef = useRef();
    const [selectedStatisticOrder, setSelectedStatisticOrder] = useState({ value: 'day', label: 'Thống kê theo ngày' });
    const { token } = useContext(AuthContext);

    const [dayOrder, setDayOrder] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [dataStatistic, setDataStatistic] = useState({});

    const handleClosePrintReport = () => {
        closeModal();
        setOpenPrintReport(false);
    };

    const handleStatisticOrderChange = (selectedOption) => {
        setSelectedStatisticOrder(selectedOption);
    };

    const handleDateOrderStartChange = (date) => {
        setDayOrder((prev) => {
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
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await OrderServices.statisticalByTime(
                    moment(dayOrder.startDate).format('YYYY/MM/DD'),
                    moment(dayOrder.endDate).add(1, 'days').format('YYYY/MM/DD'),
                    token,
                );
                // console.log(moment(dayOrder.endDate).add(1, 'days').format('YYYY/MM/DD'));

                setDataStatistic(result.data);
            } catch (error) {
                console.log('fetchApi getAllCustomerServices Sidebar.js' + error);
            }
        };
        fetchApi();
    }, [dayOrder.endDate, dayOrder.startDate, token]);

    useEffect(() => {
        if (openModal) {
            setOpenPrintReport(true);
        }
    }, [openModal, openPrintReport]);

    return (
        <>
            <ToastContainer />
            <Modal
                open={openPrintReport}
                onClose={handleClosePrintReport}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={cx('box')}>
                        <div className={cx('headerBox')}>
                            <span>Chọn thời gian báo cáo</span>
                            <IconButton aria-label="add" size="small" onClick={handleClosePrintReport}>
                                <CloseIcon sx={{ color: '#637381', fontSize: '24px' }} />
                            </IconButton>
                        </div>
                        <div className={cx('contentBox')}>
                            <div className={cx('dateStatistic')}>
                                <div className={cx('wrapDatePicker')}>
                                    <span>Từ</span>
                                    <div style={{ width: '170px' }}>
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
                                    <span>Tới</span>
                                    <div style={{ width: '170px' }}>
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

                        <div className={cx('footer')}>
                            <Button variant="outlined" onClick={handleClosePrintReport}>
                                Thoát
                            </Button>

                            <ReactToPrint
                                trigger={() => {
                                    return <Button variant="contained">Lưu</Button>;
                                }}
                                content={() => componentRef.current}
                            />
                            <div style={{ display: 'none' }}>
                                <PDFFile
                                    componentRef={componentRef}
                                    dayRequest={dayOrder}
                                    dataStatistic={dataStatistic}
                                />
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default PrintReport;
