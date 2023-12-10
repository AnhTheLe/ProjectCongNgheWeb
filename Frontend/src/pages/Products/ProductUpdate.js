import { Link, generatePath, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductUpdate.module.scss';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getProductDetail, deleteProduct, updateBaseProduct, updateAttribute, createVariant, updateVariant, deleteAttribute, deleteVariant, createAttribute } from '../../services/productManagerServices'
import routes from '../../config/routes';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { AuthContext } from '../../contexts/AuthContex';
import Tooltip from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import ImageUploader from '../../components/Upload/ImageUploader';
import { LightTooltip } from '../../components/LightTooltip/LightTooltip';
import numeral from 'numeral';
const cx = classNames.bind(styles);
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



function ProductUpdate() {
  const [product, setProduct] = useState({});
  const [variant, setVariant] = useState({});
  const [active, setActive] = useState();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [nameFunctionOnAgreeClick, setNameFunctionOnAgreeClick] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState('');
  const [variantList, setVariantList] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [dataDialogInput, setDataDialogInput] = useState({});
  const [openAddNewAttributeInput, setOpenAddNewAttributeInput] = useState(false);
  const [nameAttributeNew, setNameAttributeNew] = useState('');
  const [valueAttributeNew, setValueAttributeNew] = useState('');
  const [openDialogVariantCreateNew, setOpenDialogVariantCreateNew] = useState(false);
  const [variantCreateNew, setVariantCreateNew] = useState(
    {
      name: '',
      sku: '',
      barcode: '',
      quantity: 0,
      importPrice: 0,
      retailPrice: 0,
      wholeSalePrice: 0,
      image: '',
      value1: '',
      value2: '',
      value3: ''
    }
  );

  const { token } = useContext(AuthContext);
  const { id, variantId } = useParams();

  const navigate = useNavigate();
  //openDialogVariantCreateNew
  const handleCloseDialogVariantCreateNew = () => {
    setOpenDialogVariantCreateNew(false)
  }
  const handleOpenDialogVariantCreateNew = () => {
    setOpenDialogVariantCreateNew(true)
  }

  const validateVariantCreateNew = () => {
    if (variantCreateNew.name === '') {
      handleOpenAlert('Tên phiên bản không được trống', 'error');
      return false
    }

    if (isNaN(variantCreateNew.quantity) || variantCreateNew.quantity > 9999 || variantCreateNew.quantity < 0) {
      handleOpenAlert('Số lượng tồn kho phải nhỏ hơn 9999, không âm', 'error');
      return false
    }
    if (isNaN(variantCreateNew.importPrice)) {
      handleOpenAlert('Giá nhập phải là số', 'error');
      return false
    }
    if (variantCreateNew.quantity < 0) {
      handleOpenAlert('Giá nhập không được âm', 'error');
      return false
    }
    if (isNaN(variantCreateNew.retailPrice)) {
      handleOpenAlert('Giá bán lẻ phải là số', 'error');
      return false
    }
    if (variantCreateNew.retailPrice < 0) {
      handleOpenAlert('Giá bán lẻ không được âm', 'error');
      return false
    }
    if (isNaN(variantCreateNew.wholeSalePrice)) {
      handleOpenAlert('Giá bán buôn không được âm', 'error');
      return false
    }
    if (variantCreateNew.wholeSalePrice < 0) {
      handleOpenAlert('Giá bán buôn không được âm', 'error');
      return false
    }

    if (product.attribute1 !== null && product.attribute1 !== '' && variantCreateNew.value1 === '') {
      handleOpenAlert(product.attribute1 + ' phiên bản không được trống', 'error')
      return false
    }
    if (product.attribute2 !== null && product.attribute2 !== '' && variantCreateNew.value2 === '') {
      handleOpenAlert(product.attribute2 + ' phiên bản không được trống', 'error')
      return false
    }
    if (product.attribute3 !== null && product.attribute3 !== '' && variantCreateNew.value3 === '') {
      handleOpenAlert(product.attribute3 + ' phiên bản không được trống', 'error')
      return false
    }
    return true;
  }

  //
  //attribute
  const handleAttributeChange = (index, value) => {
    const updatedAttributes = [...attributeList];
    updatedAttributes[index] = value;
    setAttributeList(updatedAttributes);
  };

  const handleDeleteAttribute = (indexDelete) => {
    if (attributeList.length > 1) {

      const data = {
        keyAttribute: 'attribute' + (indexDelete + 1)
      }

      handleOpenDialogConfirm('Bạn có chắc chắn muốn xóa thuộc tính?', 'deleteAttb', data)
    } else alert('Không thể xóa thuộc tính duy nhất')
  }
  const handleUpdateAttribute = (indexDelete, value) => {
    const data = {
      keyAttribute: 'attribute' + (indexDelete + 1),
      name: value
    }
    handleOpenDialogConfirm('Cập nhật thuộc tính?', 'updateAttb', data)
  }

  const handleCreateAttribute = () => {
    const data = {
      name: nameAttributeNew,
      value: valueAttributeNew
    }
    handleOpenDialogConfirm('Thêm mới thuộc tính?', 'addAttb', data)
  }

  //
  //
  const [openAttributeManager, setOpenAttributeManager] = useState(false);
  const handleOpenAttributeManager = () => {
    setOpenAttributeManager(true);
  }
  const handleCloseAttributeManager = () => {
    setOpenAttributeManager(false);
  }
  //
  const [open, setOpen] = useState(false);

  const handleOpenAlert = (messageAlert, typeAlert) => {
    setMessageAlert(messageAlert);
    setTypeAlert(typeAlert);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  //
  const handleOpenDialogConfirm = (alertContent, nameFunctionOnAgreeClick, data) => {
    setAlertContent(alertContent)
    setNameFunctionOnAgreeClick(nameFunctionOnAgreeClick);
    setOpenDialogConfirm(true);
    setDataDialogInput(data)
  }
  const handleOnClickAgree = () => {
    if (nameFunctionOnAgreeClick === 'deletePro') {
      deletePro();

    }
    if (nameFunctionOnAgreeClick === 'updatePro') {
      updatePro()
    }
    if (nameFunctionOnAgreeClick === 'createVar') {
      createVar();
    }

    if (nameFunctionOnAgreeClick === 'updateVar') {
      updateVar();
    }

    if (nameFunctionOnAgreeClick === 'deleteVar') {
      deleteVar();
    }

    if (nameFunctionOnAgreeClick === 'deleteAttb') {
      deleteAttb();
    }

    if (nameFunctionOnAgreeClick === 'updateAttb') {
      updateAttb();
    }
    if (nameFunctionOnAgreeClick === 'addAttb') {
      addAttb();
    }

    setOpenDialogConfirm(false)
  }
  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false)
  }
  const handleOnChangeProduct = (key, value) => {
    const newProduct = { ...product, [key]: value };
    setProduct(newProduct);
  }

  const handleVariantChange = (key, value) => {
    const newVariant = { ...variant, [key]: value }
    setVariant(newVariant);
  };
  //

  const handleOnClickVariant = (variant) => {
    setActive(variant.id)
    setVariant(variant);
  }
  //
  const formattedDate = (date) => {
    return new Date(date).toLocaleTimeString() + ' ' + new Date(date).toLocaleDateString()
  }

  //
  useEffect(() => {
    fetchData()

  }, [id])
  //
  const fetchData = async (newVariant) => {
    try {
      const res = await getProductDetail(id, token);
      setProduct(res)
      setVariantList(res.variants)
      if (variantId) {
        const variant = res.variants.find((item) => item.id == variantId);
        if (variant) {
          setActive(variantId)
          setVariant(variant);
        } else {
          setActive(res.variants[0].id)
          setVariant(res.variants[0])
        }
      }
      else {
        setActive(res.variants[0].id)
        setVariant(res.variants[0])
      }
      if (newVariant != null) {
        setVariant(newVariant)
      }

      let newListAttribute = [];

      if (res.attribute1 !== null && res.attribute1 !== '') newListAttribute = [...newListAttribute, res.attribute1]
      if (res.attribute2 !== null && res.attribute2 !== '') newListAttribute = [...newListAttribute, res.attribute2]
      if (res.attribute3 !== null && res.attribute3 !== '') newListAttribute = [...newListAttribute, res.attribute3]
      setAttributeList(newListAttribute);

      return res
    } catch (error) {
    }
  }
  const updatePro = async () => {
    const baseId = product.id;
    const data = {
      name: product.name,
      label: product.label
    }
    try {
      const res = await updateBaseProduct(baseId, data, token);
      if (res && res.responseCode === 200) {
        handleOpenAlert('Cập nhật thành công', 'success')

      } else {
        handleOpenAlert(res.response.data.message, 'error')
      }
    } catch (error) {
      return error
    }
  }
  const deletePro = async () => {
    try {
      const res = await deleteProduct(id, token);
      if (res.responseCode && res.responseCode === 200) {
        handleOpenAlert('Đã xóa sản phẩm', 'success')
        setTimeout(() => {
          navigate(routes.productList)
        }, 1000);
      } else {

        handleOpenAlert(res.response.data.message, 'error');

      }
    } catch (error) {
      return error
    }
  }
  const createVar = async () => {

    const baseId = product.id;
    const data = { ...variantCreateNew, baseId: baseId };
    if (validateVariantCreateNew())
      try {
        const res = await createVariant(baseId, data, token);
        if (res.responseCode && res.responseCode === 200) {
          // setVariant(res.data)
          fetchData(res.data)
          handleOpenAlert('Đã thêm phiên bản', 'success');
          setOpenDialogVariantCreateNew(false)
          console.log(res.data);
          navigate(generatePath(routes.productUpdate2, {
            id: id, variantId: res.data.id
          }))
          setVariantCreateNew({
            name: '',
            sku: '',
            barcode: '',
            quantity: 0,
            importPrice: 0,
            retailPrice: 0,
            wholeSalePrice: 0,
            image: '',
            value1: '',
            value2: '',
            value3: ''
          })
        } else {
          handleOpenAlert(res.response.data.message, 'error');
        }

      } catch (error) {
        return error
      }
  }
  const updateVar = async () => {

    const baseId = product.id;
    const data = formatAndValidateVariants();
    if (data != false)
      try {
        const res = await updateVariant(baseId, data, token);
        if (res.responseCode && res.responseCode === 200) {
          fetchData();
          handleOpenAlert('Cập nhật thành công', 'success');
        } else {

          handleOpenAlert(res.response.data.message, 'error');

        }
      } catch (error) {
        return error
      }
  }

  const deleteVar = async () => {

    const baseId = product.id;
    const variantId = variant.id;
    if (variantList.length === 1) handleOpenAlert('Không thể xóa phiên bản duy nhất', 'error');
    else
      try {
        const res = await deleteVariant(baseId, variantId, token);
        if (res.responseCode && res.responseCode === 200) {
          fetchData()
          navigate(generatePath(routes.productUpdate1, { id: id }))
          handleOpenAlert('Đã xóa phiên bản', 'success');

        } else {

          handleOpenAlert(res.response.data.message, 'error');

        }
      } catch (error) {
        return error
      }
  }

  const deleteAttb = async () => {
    const data = dataDialogInput;

    const baseId = product.id;

    try {
      const res = await deleteAttribute(baseId, data, token);

      if (res.responseCode && res.responseCode === 200) {
        fetchData()
        handleOpenAlert('Đã xóa thuộc tính', 'success');
      }
      else {

        handleOpenAlert(res.response.data.message, 'error');
      }

    } catch (error) {
    }

  }

  const updateAttb = async () => {
    const data = dataDialogInput;
    const baseId = product.id;

    try {
      const res = await updateAttribute(baseId, data, token);
      if (res.responseCode && res.responseCode === 200) {
        fetchData()
        handleOpenAlert('Đã cập nhật thuộc tính', 'success');
      } else {

        handleOpenAlert(res.response.data.message, 'error');
      }

    } catch (error) {
      return error
    }

  }

  const addAttb = async () => {
    const data = dataDialogInput;

    const baseId = product.id;

    try {
      const res = await createAttribute(baseId, data, token);
      if (res && res.responseCode === 200) {
        setOpenAddNewAttributeInput(false);
        setNameAttributeNew('')
        setValueAttributeNew('')
        fetchData()
        handleOpenAlert('Đã thêm thuộc tính', 'success');
      }
      else {

        handleOpenAlert(res.response.data.message, 'error');
      }

    } catch (error) {
    }

  }

  const formatAndValidateVariants = () => {

    let formattedVariant = { ...variant };

    const quantity = parseFloat(formattedVariant.quantity);
    if (isNaN(quantity) || quantity < 0 || quantity > 9999) {
      handleOpenAlert('Số lượng tồn kho phải là số lớn hơn 0! Số lượng max: 9999', 'error')
      return false
    }

    const importPrice = parseFloat(formattedVariant.importPrice);
    if (isNaN(importPrice) || importPrice < 0) {
      handleOpenAlert('Giá nhập phải lớn hơn 0', 'error')
      return false
    }

    const retailPrice = parseFloat(formattedVariant.retailPrice);
    if (isNaN(retailPrice) || retailPrice < 0) {
      handleOpenAlert('Giá bán lẻ phải lớn hơn 0', 'error')
      return false
    }

    const wholeSalePrice = parseFloat(formattedVariant.wholeSalePrice);
    if (isNaN(wholeSalePrice) || wholeSalePrice < 0) {
      handleOpenAlert('Giá bán buôn phải lớn hơn 0', 'error')
      return false
    }
    if (product.attribute1 !== '') if (variant.value1 === '') {
      handleOpenAlert(product.attribute1 + ' phiên bản không được trống', 'error')
      return false
    }
    if (product.attribute2 !== '') if (variant.value2 === '') {
      handleOpenAlert(product.attribute2 + ' phiên bản không được trống', 'error')
      return false
    }
    if (product.attribute3 !== '') if (variant.value3 === '') {
      handleOpenAlert(product.attribute3 + ' phiên bản không được trống', 'error')
      return false
    }


    formattedVariant = {
      ...variant,
      quantity,
      importPrice,
      retailPrice,
      wholeSalePrice
    };
    return formattedVariant;
  }
  return (
    <>

      <div className={cx('wrap')}>
        <div className={cx('header')}>
          <Button onClick={() => navigate(generatePath(routes.productDetail1, { id: id }))} variant="outlined" startIcon={<ArrowBackIosIcon />}>
            Quay lại
          </Button>
          <div>
            <Button variant="outlined" color="error" onClick={() => { handleOpenDialogConfirm('Bạn có chắc chắn muốn xóa sản phẩm?', 'deletePro', {}) }}>
              Xóa sản phẩm
            </Button>

          </div>
        </div>



        <div className={cx('base-product-content')}>
          <h1 className={cx('product-name')}>{product.name ? product.name : '---'}</h1>
          <div className={cx('personalInfo')}>
            <div className={cx('personalInfoHeader')}>
              <span>Thông tin chung</span>
              <Button variant="contained" onClick={() => { handleOpenDialogConfirm('Cập nhật sản phẩm?', 'updatePro', {}) }}>
                Cập nhật
              </Button>
            </div>
            <div className={cx('personalInfoContent')}>
              <div className={cx('personalInfoContentRow')}>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Tên sản phẩm</div>
                  <div className={cx('personalInfoValue')}>
                    :
                    <input value={product.name} onChange={(e) => { handleOnChangeProduct('name', e.target.value) }} />


                  </div>
                </div>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Nhãn hiệu</div>
                  <div className={cx('personalInfoValue')}>
                    :
                    <input value={product.label} onChange={(e) => { handleOnChangeProduct('label', e.target.value) }} />

                  </div>
                </div>
              </div>

              <div className={cx('personalInfoContentRow')}>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Số lượng</div>
                  <div className={cx('personalInfoValue')}>
                    : {product.quantity ? <span >{product.quantity}</span> : <span>0</span>}
                  </div>
                </div>
                <div className={cx('personalInfoContentCol')}>
                  <div className={cx('personalInfoTitle')}>Số phiên bản</div>
                  <div className={cx('personalInfoValue')}>
                    :
                    <span >{product.variantNumber}</span>

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
          <div className={cx('variant-header')}>
            <h1 className={cx('variant-title')}>Chi tiết phiên bản</h1>
            <div className={cx('variant-button')}>
              <Button variant="outlined" color="error" onClick={() => { handleOpenDialogConfirm('Bạn có chắc chắn muốn phiên bản?', 'deleteVar', {}) }}>
                Xóa
              </Button>
              <Button variant="contained" onClick={() => { handleOpenDialogConfirm('Cập nhật phiên bản?', 'updateVar', {}) }}>
                Lưu
              </Button>
            </div>

          </div>
          <div className={cx('variant-content')}>
            <div className={cx('variant-list')}>
              <div className={cx('variant-number')}>
                <div>
                  Phiên bản ({product.variantNumber})
                </div>
                <div>
                  <Button className={cx('add-button')} variant="text" startIcon={<CreateIcon />} onClick={() => handleOpenAttributeManager()}>Sửa thuộc tính
                  </Button>
                </div>
              </div>
              <div className={cx('variant-list-content')}>
                {
                  variantList ? variantList.map((variant, index) => (
                    <Link to={generatePath(routes.productUpdate2, { id: id, variantId: variant.id })}>
                      <div key={variant.id} className={cx('variant-item', variant.id === active || variant.id == variantId ? 'active' : '')} onClick={() => handleOnClickVariant(variant)}>
                        <div className={cx('variant-image')}>
                          {variant.image ?
                            <img src={variant.image} alt={variant.image} />
                            :
                            <CropOriginalIcon />
                          }
                        </div>
                        <div className={cx('variant-info')}>
                          <span className={cx('variant-name')}>{variant.name}</span>
                          <span className={cx('variant-quantity')}>Tồn kho: {variant.quantity}</span>
                        </div>
                      </div>
                    </Link>
                  )) : ''}
              </div>
              <div>
                <Button className={cx('add-button')} variant="text" startIcon={<AddOutlinedIcon />} onClick={() => handleOpenDialogVariantCreateNew()}>Thêm phiên bản
                </Button>
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
                        <div className={cx('personalInfoTitle')}>Tên phiên bản <span style={{ color: 'red' }}>*</span></div>
                        <div className={cx('personalInfoValue')}>
                          :
                          <input value={variant.name} onChange={(e) => handleVariantChange('name', e.target.value)} />

                        </div>
                      </div>

                    </div>
                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Mã SKU
                          <LightTooltip
                            title={
                              <div>
                                <span>Mã <strong>không trùng lặp</strong> để định danh giữa các sản phẩm</span>
                                <br></br>
                                <span>Nếu để trống mã sản phẩm sẽ được tự sinh với <strong>tiền tố SKU</strong>.</span>
                              </div>
                            }
                            placement="top">
                            <ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} />
                          </LightTooltip>
                        </div>
                        <div className={cx('personalInfoValue')}>:
                          <input value={variant.sku} onChange={(e) => handleVariantChange('sku', e.target.value)} />

                        </div>
                      </div>

                    </div>
                    <div className={cx('personalInfoContentRow')}>
                      <div className={cx('personalInfoContentCol')}>
                        <div className={cx('personalInfoTitle')}>Mã Barcode<LightTooltip title="Nếu để trống, mã Barcode sẽ được đặt trùng với SKU" placement="top"><ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} /></LightTooltip></div>
                        <div className={cx('personalInfoValue')}>:
                          <input value={variant.barcode} onChange={(e) => handleVariantChange('barcode', e.target.value)} />

                        </div>
                      </div>

                    </div>

                    {
                      product.attribute1 ?
                        <div className={cx('personalInfoContentRow')}>
                          <div className={cx('personalInfoContentCol')}>
                            <div className={cx('personalInfoTitle')}>{product.attribute1} <span style={{ color: 'red' }}>*</span></div>
                            <div className={cx('personalInfoValue')}>:
                              <input value={variant.value1} onChange={(e) => handleVariantChange('value1', e.target.value)} />

                            </div>
                          </div>

                        </div> : ''
                    }

                    {
                      product.attribute2 ?
                        <div className={cx('personalInfoContentRow')}>
                          <div className={cx('personalInfoContentCol')}>
                            <div className={cx('personalInfoTitle')}>{product.attribute2} <span style={{ color: 'red' }}>*</span></div>
                            <div className={cx('personalInfoValue')}>:
                              <input value={variant.value2} onChange={(e) => handleVariantChange('value2', e.target.value)} />

                            </div>
                          </div>

                        </div> : ''
                    }
                    {
                      product.attribute3 ?
                        <div className={cx('personalInfoContentRow')}>
                          <div className={cx('personalInfoContentCol')}>
                            <div className={cx('personalInfoTitle')}>{product.attribute3} <span style={{ color: 'red' }}>*</span></div>
                            <div className={cx('personalInfoValue')}>:
                              <input value={variant.value3} onChange={(e) => handleVariantChange('value3', e.target.value)} />

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
                    <div>
                      <ImageUploader keyInput="2" witdh={'230px'} height={'230px'} fontSize={'100px'} imageUrl={variant.image} onImageUpload={(image) => handleVariantChange('image', image)} />
                    </div>
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
                        :
                        <input value={numeral(variant.retailPrice).format(0, 0)} type="text" onChange={(e) => handleVariantChange("retailPrice", parseFloat(e.target.value.replace(/,/g, '')))} />

                      </div>
                    </div>

                  </div>
                  <div className={cx('personalInfoContentRow')}>
                    <div className={cx('personalInfoContentCol')}>
                      <div className={cx('personalInfoTitle')}>Giá bán buôn</div>
                      <div className={cx('personalInfoValue')}>
                        :
                        <input value={numeral(variant.wholeSalePrice).format(0, 0)} type="text" onChange={(e) => handleVariantChange("wholeSalePrice", parseFloat(e.target.value.replace(/,/g, '')))} />

                      </div>
                    </div>

                  </div>
                  <div className={cx('personalInfoContentRow')}>
                    <div className={cx('personalInfoContentCol')}>
                      <div className={cx('personalInfoTitle')}>Giá nhập</div>
                      <div className={cx('personalInfoValue')}>
                        :
                        <input value={numeral(variant.importPrice).format(0, 0)} type="text" onChange={(e) => handleVariantChange("importPrice", parseFloat(e.target.value.replace(/,/g, '')))} />

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
          {alertContent}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDialogConfirm}>Không</Button>
          <Button onClick={handleOnClickAgree} autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={typeAlert} sx={{ width: '100%' }}>
            {messageAlert}
          </Alert>
        </Snackbar>
      </Stack>

      <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={openAttributeManager}
        onClose={handleCloseAttributeManager}
      >
        <DialogTitle>Chỉnh sửa thuộc tính</DialogTitle>
        <DialogContent>
          <div className={cx('attributeContent')}>
            {
              attributeList.map((attribute, index) => (
                <div className={cx('attributeRow')}>
                  <span>Thuộc tính {index + 1}</span>
                  <input
                    value={attribute}
                    onChange={(e) => {
                      handleAttributeChange(index, e.target.value)
                    }}
                    placeholder="Nhập tên thuộc tính mới"
                  />
                  <Button className={cx('update-button')} variant="text" startIcon={<CheckIcon />} onClick={() => handleUpdateAttribute(index, attribute)}>
                  </Button>
                  <Button className={cx('delete-button')} variant="text" startIcon={<ClearIcon />} onClick={() => handleDeleteAttribute(index)}>
                  </Button>

                </div>
              ))
            }

          </div>

          {
            openAddNewAttributeInput ?
              <div className={cx('addnew-attribute')}>
                <div>
                  <input
                    value={nameAttributeNew}
                    onChange={(e) => {
                      setNameAttributeNew(e.target.value)
                    }}
                    placeholder="Nhập tên thuộc tính mới"
                  />

                  <input
                    value={valueAttributeNew}
                    onChange={(e) => {
                      setValueAttributeNew(e.target.value)
                    }}
                    placeholder="Nhập giá trị thuộc tính"
                  />
                </div>
                <Button className={cx('update-button')} variant="text" startIcon={<CheckIcon />} onClick={() => handleCreateAttribute()}>
                </Button>
                <Button className={cx('delete-button')} variant="text" startIcon={<ClearIcon />} onClick={() => setOpenAddNewAttributeInput(false)}>
                </Button>
              </div>

              : ''
          }

          <div className={cx('attribute-add-button')}>
            {
              attributeList.length < 3 ?
                <Button className={cx('add-button')} variant="text" startIcon={<AddOutlinedIcon />} onClick={() => setOpenAddNewAttributeInput(true)}>
                </Button> : ''
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseAttributeManager}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={openDialogVariantCreateNew}
        onClose={() => handleCloseDialogVariantCreateNew()}
      >
        <DialogTitle>Thêm phiên bản</DialogTitle>
        <DialogContent>
          <div className={cx('attributeContent')}>
            <div className={cx('avatar-variant')}>
              <div>
                <ImageUploader
                  keyInput="1"
                  witdh={'160px'}
                  height={'160px'}
                  fontSize={'60px'}
                  imageUrl={variantCreateNew.image}
                  onImageUpload={(image) => setVariantCreateNew({ ...variantCreateNew, ["image"]: image })}
                />
              </div>
            </div>

            <div className={cx('attributeRow')}>
              <span>Tên phiên bản<strong style={{ color: 'red', fontWeight: 300 }}>*</strong></span>
              <input
                value={variantCreateNew.name}
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["name"]: e.target.value })
                }}
                placeholder="Nhập tên phiên bản"
              />

            </div>
            <div className={cx('attributeRow')}>
              <span>Mã SKU
                <LightTooltip
                  title={
                    <div>
                      <span>Mã <strong>không trùng lặp</strong> để định danh giữa các sản phẩm</span>
                      <br></br>
                      <span>Nếu để trống mã sản phẩm sẽ được tự sinh với <strong>tiền tố SKU</strong>.</span>
                    </div>
                  }
                  placement="top">
                  <ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} />
                </LightTooltip>
              </span>
              <input
                value={variantCreateNew.sku}
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["sku"]: e.target.value })
                }}
                placeholder="Nhập mã SKU"
              />

            </div>
            <div className={cx('attributeRow')}>
              <span>Barcode<LightTooltip title="Nếu để trống, mã Barcode sẽ được đặt trùng với SKU" placement="top"><ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} /></LightTooltip></span>
              <input
                value={variantCreateNew.barcode}
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["barcode"]: e.target.value })
                }}
                placeholder="Nhập barcode"
              />

            </div>
            <div className={cx('attributeRow')}>
              <span>Tồn kho ban đầu</span>
              <input
                value={numeral(variantCreateNew.quantity).format(0, 0)}
                type='text'
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["quantity"]: parseFloat(e.target.value.replace(/,/g, '')) })
                }}
                placeholder="Nhập số lượng tồn kho"
              />

            </div>
            <div className={cx('attributeRow')}>
              <span>Giá nhập</span>
              <input
                value={numeral(variantCreateNew.importPrice).format(0, 0)}
                type='text'
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["importPrice"]: parseFloat(e.target.value.replace(/,/g, '')) })
                }}
                placeholder="Giá nhập"
              />

            </div>
            <div className={cx('attributeRow')}>
              <span>Giá bán lẻ</span>
              <input
                value={numeral(variantCreateNew.retailPrice).format(0, 0)}
                type='text'
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["retailPrice"]: parseFloat(e.target.value.replace(/,/g, '')) })
                }}
                placeholder="Giá bán lẻ"
              />

            </div>
            <div className={cx('attributeRow')}>
              <span>Giá bán buôn</span>
              <input
                value={numeral(variantCreateNew.wholeSalePrice).format(0, 0)}
                type='text'
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["wholeSalePrice"]: parseFloat(e.target.value.replace(/,/g, '')) })
                }}
                placeholder="Giá bán buôn"
              />

            </div>
            {!product.attribute1 ? '' : <div className={cx('attributeRow')}>
              <span>{product.attribute1}<strong style={{ color: 'red', fontWeight: 300 }}>*</strong></span>
              <input
                value={variantCreateNew.value1}
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["value1"]: e.target.value })
                }}
                placeholder="Giá trị thuộc tính"
              />

            </div>}
            {!product.attribute2 ? '' : <div className={cx('attributeRow')}>
              <span>{product.attribute2}<strong style={{ color: 'red', fontWeight: 300 }}>*</strong></span>
              <input
                value={variantCreateNew.value2}
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["value2"]: e.target.value })
                }}
                placeholder="Giá trị thuộc tính"
              />

            </div>}
            {!product.attribute3 ? '' : <div className={cx('attributeRow')}>
              <span>{product.attribute3}<strong style={{ color: 'red', fontWeight: 300 }}>*</strong></span>
              <input
                value={variantCreateNew.value3}
                onChange={(e) => {
                  setVariantCreateNew({ ...variantCreateNew, ["value3"]: e.target.value })
                }}
                placeholder="Giá trị thuộc tính"
              />

            </div>}



          </div>
        </DialogContent>
        <DialogActions>

          <Button autoFocus onClick={() => handleCloseDialogVariantCreateNew()}>
            Hủy
          </Button>
          <Button autoFocus onClick={() => handleOpenDialogConfirm('Bạn có chắc chắn tạo phiên bản?', 'createVar', {})}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default ProductUpdate;