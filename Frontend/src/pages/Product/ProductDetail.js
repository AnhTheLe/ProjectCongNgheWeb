import { Link, generatePath, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getProductDetail, deleteProduct } from '../../services/productManagerServices'
import routes from '../../config/routes';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthContext } from '../../contexts/AuthContex';
import MuiAlert from '@mui/material/Alert';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import numeral from 'numeral';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { LightTooltip } from '../../components/LightTooltip/LightTooltip';
import { CircleNotificationsOutlined, ErrorOutline } from '@mui/icons-material';
const cx = classNames.bind(styles);
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ProductDetail() {
  const [product, setProduct] = useState({});
  const [variant, setVariant] = useState({});
  const [active, setActive] = useState();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const { token } = useContext(AuthContext)

  const { id, variantId } = useParams();
  const [variantIdParam, setVariantIdParam] = useState(variantId);


  const navigate = useNavigate();
  const handleOpenDialogConfirm = () => {
    setOpenDialogConfirm(true);
  }
  const handleOnDeleteProduct = () => {
    deletePro()
  }
  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false)
  }
  const handleOnUpdateProduct = () => {
    navigate(generatePath(routes.productUpdate2, { id: id, variantId: variant.id }))
  }
  const handleOnClickVariant = (variant) => {
    // const params = {
    //   id: product.id,
    //   variantId: variant.id
    // };

    // // Sử dụng template string để xây dựng URL với các params
    // const url = routes.productDetail2.replace(/:([a-zA-Z0-9]+)/g, (match, param) => {
    //   return params[param] || match;
    // });
    // document.location.href = url;
    setVariantIdParam(variant.id)
    setActive(variant.id)
    setVariant(variant);
  }
  const numberWithCommas = (number) => {
    return number.toLocaleString();
  };

  const formattedDate = (date) => {
    return new Date(date).toLocaleTimeString() + ' ' + new Date(date).toLocaleDateString()
  }

  useEffect(() => {
    fetchData(id)
  }, [id])
  const [typeAlert, setTypeAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpenAlert = (messageAlert, typeAlert) => {
    setMessageAlert(messageAlert);
    setTypeAlert(typeAlert);
    setOpen(true);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const fetchData = async () => {
    try {
      const res = await getProductDetail(id, token);
      if (res)
        setProduct(res)
      else {
        handleOpenAlert('Sản phẩm đã bị xóa hoặc không tồn tại.', 'error');
        setTimeout(() => {
          navigate(routes.productList)
        }, 1200);
      }
      if (variantId) {
        for (let i = 0; i < res.variants.length; i++) {
          if (res.variants[i].id == variantId) {
            setVariantIdParam(variantId);
            setVariant(res.variants[i]);
            setActive(res.variants[i].id)
            return
          }
        }
        handleOpenAlert('Không tìm thấy phiên bản', 'error')
      }
      setVariant(res.variants[0])
      setActive(res.variants[0].id)
    } catch (error) {
    }
  }
  const deletePro = async () => {
    // handleCloseDialogConfirm()
    try {
      const res = await deleteProduct(id, token);
      if (res.responseCode && res.responseCode === 200) {
        handleCloseDialogConfirm()
        handleOpenAlert('Đã xóa sản phẩm', 'success')
        setTimeout(() => {
          navigate(routes.productList)
        }, 1000);
      } else {
        alert(res.response.data.message)
      }
    } catch (error) {
      return error
    }
  }
  return (
    <>
      <div className={cx('wrap')}>
        <div className={cx('header')}>
          <Button onClick={() => navigate(routes.productList)} variant="outlined" startIcon={<ArrowBackIosIcon />}>
            Quay lại
          </Button>
          <div>
            <Button variant="outlined" color="error" onClick={handleOpenDialogConfirm}>
              Xóa sản phẩm
            </Button>
            <Button variant="contained" onClick={handleOnUpdateProduct}>
              Sửa sản phẩm
            </Button>
          </div>
        </div>

        <div className={cx('base-product-content')}>
          <h1 className={cx('product-name')}>{product.name ? product.name : ''}</h1>
          <div className={cx('personalInfo')}>
            <div className={cx('personalInfoHeader')}>
              <span>Thông tin chung</span>
            </div>
            <div className={cx('personalInfoContent')}>
              <div className={cx('personalInfoContentRow')}>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Tên sản phẩm</div>
                  <div className={cx('personalInfoValue')}>
                    : {product.name ? <strong>{product.name}</strong> : <span>---</span>}
                  </div>
                </div>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Nhãn hiệu</div>
                  <div className={cx('personalInfoValue')}>
                    :{' '}
                    {product.label ? (
                      <span >
                        {product.label}
                      </span>
                    ) : (
                      <span>---</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={cx('personalInfoContentRow')}>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Số lượng</div>
                  <div className={cx('personalInfoValue')}>
                    : {product.quantity ? <span >{numeral(product.quantity).format(0, 0)}</span> : <span>0</span>}
                  </div>
                </div>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Số phiên bản</div>
                  <div className={cx('personalInfoValue')}>
                    :{' '}
                    {product.variantNumber ? (
                      <span >{numeral(product.variantNumber).format(0, 0)}</span>
                    ) : (
                      <span>0</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={cx('personalInfoContentRow')}>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Ngày khởi tạo</div>
                  <div className={cx('personalInfoValue')}>
                    : {product.createdAt ? <span >{formattedDate(product.createdAt)}</span> : <span>---</span>}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        <div className={cx('variant')}>
          <h1 className={cx('variant-title')}>Chi tiết phiên bản</h1>
          <div className={cx('variant-content')}>
            <div className={cx('variant-list')}>
              <div className={cx('variant-number')}>Phiên bản ({product.variantNumber})</div>
              <div className={cx('variant-list-content')}>
                {product.variants ? product.variants.map(variant => (
                  <Link to={generatePath(routes.productDetail2, { id: product.id, variantId: variant.id })}>
                    <div key={variant.id} className={cx('variant-item', variant.id == active || variantIdParam == variant.id ? 'active' : '')} onClick={() => handleOnClickVariant(variant)}>
                      <div className={cx('variant-image')}>
                        {variant.image ?
                          <img src={variant.image} alt={variant.image} /> :
                          <CropOriginalIcon />
                        }
                      </div>
                      <div className={cx('variant-info')}>
                        <span className={cx('variant-name')}>{variant.name}</span>
                        <span className={cx('variant-quantity')}>Tồn kho: {numeral(variant.quantity).format(0, 0)}</span>
                      </div>
                      {variant.quantity === 0 ? <LightTooltip
                        title="Hết hàng"
                        placement="top">
                        <ErrorOutline style={{ height: '15px', color: 'red' }} />
                      </LightTooltip> : ''}
                    </div>
                  </Link>
                )) : ''}
              </div>
            </div>
            <div className={cx('variant-detail')}>
              <div className={cx('variant-info-detail')}>
                <div className={cx('variant-info-detail-title')}>
                  Thông tin chi tiết phiên bản
                </div>
                <div className={cx('variant-info-detail-box')}>
                  <div className={cx('personalInfoContent')}>
                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Tên phiên bản</div>
                        <div className={cx('personalInfoValue')}>
                          : {variant.name ? <span >{variant.name}</span> : <span>---</span>}
                        </div>
                      </div>

                    </div>
                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Mã SKU</div>
                        <div className={cx('personalInfoValue')}>
                          : {variant.sku ? <span >{variant.sku}</span> : <span>---</span>}
                        </div>
                      </div>

                    </div>
                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Mã Barcode</div>
                        <div className={cx('personalInfoValue')}>
                          : {variant.barcode ? <span >{variant.barcode}</span> : <span>---</span>}
                        </div>
                      </div>

                    </div>

                    {
                      product.attribute1 ?
                        <div className={cx('personalInfoContentRow')}>
                          <div className={cx('personalInfoContentCol')}>
                            <div className={cx('personalInfoTitle')}>{product.attribute1}</div>
                            <div className={cx('personalInfoValue')}>
                              : {variant.value1 ? <span >{variant.value1}</span> : <span>---</span>}
                            </div>
                          </div>

                        </div> : ''
                    }

                    {
                      product.attribute2 ?
                        <div className={cx('personalInfoContentRow')}>
                          <div className={cx('personalInfoContentCol')}>
                            <div className={cx('personalInfoTitle')}>{product.attribute2}</div>
                            <div className={cx('personalInfoValue')}>
                              : {variant.value2 ? <span >{variant.value2}</span> : <span>---</span>}
                            </div>
                          </div>

                        </div> : ''
                    }
                    {
                      product.attribute3 ?
                        <div className={cx('personalInfoContentRow')}>
                          <div className={cx('personalInfoContentCol')}>
                            <div className={cx('personalInfoTitle')}>{product.attribute3}</div>
                            <div className={cx('personalInfoValue')}>
                              : {variant.value3 ? <span >{variant.value3}</span> : <span>---</span>}
                            </div>
                          </div>

                        </div> : ''
                    }

                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Tồn kho</div>
                        <div className={cx('personalInfoValue')}>
                          : {variant.quantity ? <span >{variant.quantity}</span> : <span>0</span>}
                        </div>
                      </div>

                    </div>

                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Ngày khởi tạo</div>
                        <div className={cx('personalInfoValue')}>
                          : {variant.createdAt ? <span >{formattedDate(variant.createdAt)}</span> : <span>---</span>}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className={cx('variant-info-detail-image')}>
                    {
                      variant.image ?
                        <img src={variant.image} alt={variant.image} /> : <CropOriginalIcon />
                    }
                  </div>
                </div>

              </div>
              <div className={cx('variant-price')}>
                <div className={cx('variant-price-title')}>
                  Giá sản phẩm
                </div>
                <div className={cx('variant-price-content')}>
                  <div className={cx('personalInfoContentRow')}>
                    <div className={cx('personalInfoContentCol')}>
                      <div className={cx('personalInfoTitle')}>Giá bán lẻ</div>
                      <div className={cx('personalInfoValue')}>
                        : {variant.retailPrice ? <span>{numeral(variant.retailPrice).format(0, 0)}</span> : <span>0</span>}
                      </div>
                    </div>

                  </div>
                  <div className={cx('personalInfoContentRow')}>
                    <div className={cx('personalInfoContentCol')}>
                      <div className={cx('personalInfoTitle')}>Giá bán buôn</div>
                      <div className={cx('personalInfoValue')}>
                        : {variant.wholeSalePrice ? <span>{numeral(variant.wholeSalePrice).format(0, 0)}</span> : <span>0</span>}
                      </div>
                    </div>

                  </div>
                  <div className={cx('personalInfoContentRow')}>
                    <div className={cx('personalInfoContentCol')}>
                      <div className={cx('personalInfoTitle')}>Giá nhập</div>
                      <div className={cx('personalInfoValue')}>
                        : {variant.importPrice ? <span >{numeral(variant.importPrice).format(0, 0)}</span> : <span>0</span>}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Dialog
        open={openDialogConfirm}
        onClose={handleCloseDialogConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có chắc chắn muốn xóa?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDialogConfirm}>Không</Button>
          <Button onClick={handleOnDeleteProduct} autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={typeAlert} sx={{ width: '100%' }}>
            {messageAlert}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}

export default ProductDetail;