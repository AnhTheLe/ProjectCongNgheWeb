import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductList.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getListProduct, searchProduct } from '../../services/productManagerServices/getListProduct';
import { Box, Button } from '@mui/material';
import routesConfig from '../../config/routes';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import { AuthContext } from '../../contexts/AuthContex';
import { LightTooltip } from '../../components/LightTooltip/LightTooltip';
import { ErrorOutline } from '@mui/icons-material';
const columns = [
    {
        field: 'id',
        headerName: 'ID Sản phẩm',
        width: 153,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell quantity',
        headerAlign: 'left',
        renderHeader: () => <span style={{ paddingLeft: '10px' }}>ID Sản phẩm</span>,
        renderCell: (params) => <span style={{ paddingLeft: '10px' }}>{params ? params.row.id : ''}</span>,
    },
    {
        field: 'name',
        headerName: 'Tên Sản phẩm',
        width: 191,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'left',
        renderHeader: () => <span>Tên Sản phẩm</span>,
        renderCell: (params) => <span>{params ? params.row.name : ''}</span>,
    },
    {
        field: 'label',
        headerName: 'Nhãn hiệu',
        width: 204,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'left',
        renderHeader: () => <span>Nhãn hiệu</span>,
        renderCell: (params) => <span>{params ? params.row.label : ''}</span>,
    },
    {
        field: 'variantNumber',
        headerName: 'Số phiên bản',
        width: 204,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell variant-number',
        headerAlign: 'left',
        renderHeader: () => <span>Số phiên bản</span>,
        renderCell: (params) => <span>{params ? params.row.variantNumber : ''}</span>,
    },
    {
        field: 'quantity',
        headerName: 'Tồn kho',
        width: 153,
        filterable: false,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell quantity',
        headerAlign: 'left',
        renderHeader: () => <span>Tồn kho</span>,
        renderCell: (params) => <span>{params ? params.row.quantity : ''}</span>,
    },
    {
        field: 'createdAt',
        width: 200,
        filterable: false,

        headerClassName: 'super-app-theme--header',
        cellClassName: 'super-app-theme--cell',
        headerAlign: 'left',
        renderHeader: () => <span>Ngày tạo</span>,
        renderCell: (params) => (
            <span>
                {moment(params.row.createdAt).format('DD-MM-YYYY hh:mm:ss')}{' '}
                {params.row.quantity == 0 ? (
                    <LightTooltip title="Hết hàng" placement="top">
                        <ErrorOutline style={{ height: '15px', color: 'red' }} />
                    </LightTooltip>
                ) : (
                    ''
                )}
            </span>
        ),
    },
];

const cx = classNames.bind(styles);
function ProductList() {
    const [rows, setRows] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const [totalPages, setTotalPages] = useState();
    const { token } = useContext(AuthContext);
    const [buttonAllResponse, setButtonAllResponse] = useState(true);
    const [keyword, setKeyword] = useState('');

    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const fetchData = async (paginationModel) => {
        try {
            const res = await getListProduct(paginationModel, token);
            setRows(res.data);
            setTotalItems(res.totalItems);
            setTotalPages(res.totalPages);
        } catch (error) {}
    };

    const searchData = async (keyword) => {
        try {
            const res = await searchProduct(keyword, token);
            setRows(res.data);
        } catch (error) {}
    };

    useEffect(() => {
        document.title = 'Danh sách sản phẩm';
        fetchData(paginationModel);
    }, [paginationModel.page, paginationModel.pageSize]);

    const handleRowClick = (event) => {
        const baseId = event.row.id;
        navigate(`/admin/base-products/${baseId}`);
    };

    const handleOnClickAddNewProduct = () => {
        navigate(routesConfig.productCreate);
    };

    return (
        <div className={cx('wrap')}>
            <div className={cx('header')}>
                <div>
                    <Button variant="contained" onClick={handleOnClickAddNewProduct}>
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>
            <div className={cx('header-all-product')}>
                <div className={cx('headerTitle')}>
                    <button className={cx({ active: buttonAllResponse })} onClick={() => fetchData(paginationModel)}>
                        Tất cả sản phẩm
                    </button>
                </div>
                <div className={cx('headerSearch')}>
                    <div className={cx('inputSearch')}>
                        <button>
                            <SearchIcon className={cx('iconSearch')} />
                        </button>
                        <input
                            placeholder="Tìm kiếm theo tên và nhãn hiệu"
                            onChange={(e) => searchData(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') searchData(keyword);
                            }}
                        ></input>
                    </div>                   
                </div>
            </div>
            <div className={cx('table')}>
                <div style={{ width: '100%' }}>
                    <Box
                        sx={{
                            height: 'fit-content',
                            width: '100%',
                            '& .quantity': {
                                paddingLeft: '30px',
                            },
                            '& .variant-number': {
                                paddingLeft: '50px',
                            },
                        }}
                    >
                        <DataGrid
                            className={cx('dataGrid')}
                            rows={rows}
                            columns={columns}
                            rowCount={totalItems}
                            pageSizeOptions={[5, 10, 20]}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={setPaginationModel}
                            onRowClick={handleRowClick}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
