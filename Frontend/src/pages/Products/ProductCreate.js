import classNames from 'classnames/bind';
import React from 'react';
import styles from './ProductCreate.module.scss';
import Button from '@mui/material/Button';
import { useContext, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { createProduct } from '../../services/productManagerServices/createProduct';
import { useNavigate } from 'react-router-dom';
import routes from '../../config/routes';
import { AuthContext } from '../../contexts/AuthContex';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import numeral from 'numeral';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LightTooltip } from '../../components/LightTooltip/LightTooltip';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import ImageUploader from '../../components/Upload/ImageUploader';
const cx = classNames.bind(styles);
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ProductCreate() {
  const [product, setProduct] = useState({});
  const [nameBase, setNameBase] = useState('');
  const [label, setLabel] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [importPrice, setImportPrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [wholeSalePrice, setWholeSalePrice] = useState(0)
  const [image, setImage] = useState('');
  const [variantList, setVariantList] = useState([]);
  const [idPrevVariant, setIdPrevVariant] = useState(0);
  const [typeAlert, setTypeAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [open, setOpen] = useState(false);

  const { token } = useContext(AuthContext);
  //
  const [attributeList, setAttributeList] = useState(['Kích thước']);

  const navigate = useNavigate();
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
  //attribute
  const handleAttributeChange = (index, value) => {
    const updatedAttributes = [...attributeList];
    updatedAttributes[index] = value;
    setAttributeList(updatedAttributes);
  };

  const handleDeleteAttribute = (indexDelete) => {
    if (attributeList.length > 1) {
      const newArray = attributeList.filter((element, index) => index !== indexDelete);
      setAttributeList(newArray)

      //update value attribute
      const newVariantList = [...variantList];
      for (let i = 0; i < newVariantList.length; i++) {
        const variant = newVariantList[i];

        if (indexDelete + 1 === 2) {
          const newVariant = { ...variant, value2: variant.value3, value3: '' };
          newVariantList[i] = newVariant;
        } else if (indexDelete + 1 === 3) {
          const newVariant = { ...variant, value3: '' };
          newVariantList[i] = newVariant;
        }
      }

      setVariantList(newVariantList);

    }
  }

  const handleAddAttribute = () => {
    if (attributeList.length < 3) {
      setAttributeList([...attributeList, 'Thuộc tính mới']);
    }
  }
  //

  // variants:

  const handleVariantChange = (index, key, value) => {
    const newVariantList = [...variantList];
    const variant = variantList[index];

    const newVariant = { ...variant, [key]: value }
    newVariantList[index] = newVariant;

    setVariantList(newVariantList);

  };

  const handleDeleteVariant = (indexDelete) => {
    // if (variantList.length > 1) {
    const newVariantList = variantList.filter((element, index) => index !== indexDelete);
    setVariantList(newVariantList)
    // }
  }
  const [numVar, setNumVar] = useState(1);

  const handleAddVariant = () => {
    const nameVar = nameBase + " - PB" + numVar;
    const tmp = {
      name: nameVar,
      quantity: quantity,
      importPrice: importPrice,
      retailPrice: retailPrice,
      wholeSalePrice: wholeSalePrice,
      image: image,
      value1: '',
      value2: '',
      value3: ''
    }
    const newSku = sku !== '' ? sku + '-' + (idPrevVariant + 1) : ''
    setIdPrevVariant(idPrevVariant + 1)
    const newBarCode = newSku;

    const newVariant = { ...tmp, sku: newSku, barcode: newBarCode }
    setVariantList([...variantList, newVariant]);
    setNumVar(numVar+1);
  }
  const formatAndValidateVariants = () => {

    const formattedVariants = [...variantList];
    for (let i = 0; i < formattedVariants.length; i++) {
      const variant = formattedVariants[i];
      if (variant.name === '') {
        handleOpenAlert('Hãy nhập tên của phiên bản ' + (i + 1), 'error')
        return false
      }
      const quantity = parseFloat(variant.quantity);
      if (isNaN(quantity) || quantity < 0 || quantity > 9999) {
        handleOpenAlert('Số lượng tồn kho phải là số lớn hơn 0! Số lượng max: 9999', 'error')
        return false
      }

      const importPrice = parseFloat(variant.importPrice);
      if (isNaN(importPrice) || importPrice < 0) {
        handleOpenAlert('Giá nhập phải lớn hơn 0', 'error')
        return false
      }

      const retailPrice = parseFloat(variant.retailPrice);
      if (isNaN(retailPrice) || retailPrice < 0) {
        handleOpenAlert('Giá bán lẻ phải lớn hơn 0', 'error')
        return false
      }

      const wholeSalePrice = parseFloat(variant.wholeSalePrice);
      if (isNaN(wholeSalePrice) || wholeSalePrice < 0) {
        handleOpenAlert('Giá bán buôn phải lớn hơn 0', 'error')
        return false
      }
      for (let j = 0; j < attributeList.length; j++) {
        if (j === 0) if (variant.value1 === '') {
          handleOpenAlert('Hãy nhập đủ các thuộc tính của phiên bản ' + (i + 1), 'error')
          return false

        }
        if (j === 1) if (variant.value2 === '') {
          handleOpenAlert('Hãy nhập đủ các thuộc tính của phiên bản ' + (i + 1), 'error')
          return false


        }
        if (j === 2) if (variant.value3 === '') {
          handleOpenAlert('Hãy nhập đủ các thuộc tính của phiên bản ' + (i + 1), 'error')
          return false

        }

      }
      formattedVariants[i] = {
        ...variant,
        quantity,
        importPrice,
        retailPrice,
        wholeSalePrice
      };
    }

    return formattedVariants;
  }

  const validateInput = () => {
    for (let i = 0; i < attributeList.length; i++) {
      if (attributeList[i] === '') {
        handleOpenAlert('Tên thuộc tính không được để trống', 'error')
        return false
      }
    }
    if (nameBase === '') {
      handleOpenAlert('Hãy nhập tên sản phẩm', 'error')
      return false
    }

    if (variantList.length < 1) {
      handleOpenAlert('Hãy thêm ít nhất 1 phiên bản', 'error')
      return false
    }
    return true
  }

  const handleOnClickSave = () => {
    if (validateInput() && formatAndValidateVariants() !== false) {
      const newProduct = {
        name: nameBase,
        label: label,
        attribute1: attributeList[0] ? attributeList[0] : '',
        attribute2: attributeList[1] ? attributeList[1] : '',
        attribute3: attributeList[2] ? attributeList[2] : '',
        variants: formatAndValidateVariants()
      }
      // setProduct(newProduct);

      saveProduct(newProduct);

    }

  }

  const saveProduct = async (product) => {
    try {
      const res = await createProduct(product, token);
      if (res && res.responseCode === 200) {
        handleOpenAlert('Đã tạo sản phẩm', 'success')
        setTimeout(() => {
          navigate(routes.productList);
        }, 1500);
      } else {
        handleOpenAlert(res.response.data.message, 'error')
      }
    } catch (error) {
      return error
    }
  }

  const hanldleOnClickExit = () => {
    navigate(routes.productList)

  }

  return (
    <>
      <div className={cx('wrap', 'container')}>
        <div className={cx('header')}>
          <Button variant="outlined" onClick={hanldleOnClickExit}>
            Thoát
          </Button>
          <Button variant="contained" onClick={handleOnClickSave}>
            Lưu
          </Button>
        </div>
        <div className={cx('personalInfo')}>
          <div className={cx('personalInfoHeader')}>
            <span>Thông tin chung</span>
          </div>
          <div className={cx('personalInfoContent')}>
            <div className={cx('personalInfoContentRow')}>
              <div className={cx('oneColumnPerRow')}>
                <div className={cx('personalInfoTitle')}>
                  Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                </div>
                <div className={cx('personalInfoValue')}>
                  <input

                    value={nameBase}
                    onChange={(e) => setNameBase(e.target.value)
                    }
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>
              </div>
            </div>
            <div className={cx('personalInfoContentRow')}>
              <div className={cx('oneColumnPerRow')}>
                <div className={cx('personalInfoTitle')}>
                  Nhãn hiệu
                </div>
                <div className={cx('personalInfoValue')}>
                  <input

                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Nhập nhãn hiệu"
                  />
                </div>
              </div>
            </div>
            <div className={cx('personalInfoContentRow')}>
              <div className={cx('personalInfoContentCol')}>
                <div className={cx('personalInfoTitle')}>Mã sản phẩm/SKU
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
                <div className={cx('personalInfoValue')}>
                  <input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Nhập mã SKU"
                  ></input>
                </div>
              </div>
              <div className={cx('personalInfoContentCol')}>
                <div className={cx('personalInfoTitle')}>Tồn kho ban đầu</div>
                <div className={cx('personalInfoValue')}>
                  <input
                    value={numeral(quantity).format(0,0)}
                    type="text"
                    onChange={(e) => setQuantity(parseFloat(e.target.value.replace(/,/g, '')))}
                    placeholder="Nhập tồn kho ban đầu"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('personalInfo')}>
          <div className={cx('personalInfoHeader')}>
            <span>Giá sản phẩm</span>
          </div>
          <div className={cx('personalInfoContent')}>
            <div className={cx('personalInfoContentRow')}>
              <div className={cx('personalInfoContentCol')}>
                <div className={cx('personalInfoTitle')}>Giá bán lẻ</div>
                <div className={cx('personalInfoValue')}>
                  <input
                    value={numeral(retailPrice).format(0, 0)}
                    type="text"
                    onChange={(e) => {
                      setRetailPrice(parseFloat(e.target.value.replace(/,/g, '')))
                    }}
                    placeholder="Nhập giá bán lẻ"
                  ></input>
                </div>
              </div>
              <div className={cx('personalInfoContentCol')}>
                <div className={cx('personalInfoTitle')}>Giá bán buôn</div>
                <div className={cx('personalInfoValue')}>
                  <input
                    value={numeral(wholeSalePrice).format(0,0)}
                    type="text"
                    onChange={(e) => setWholeSalePrice(parseFloat(e.target.value.replace(/,/g, '')))}
                    placeholder="Nhập giá bán buôn"
                  ></input>
                </div>
              </div>
            </div>
            <div className={cx('personalInfoContentRow')}>
              <div className={cx('personalInfoContentCol')}>
                <div className={cx('personalInfoTitle')}>Giá nhập</div>
                <div className={cx('personalInfoValue')}>
                  <input
                    value={numeral(importPrice).format(0,0)}
                    type="text"
                    onChange={(e) => setImportPrice(parseFloat(e.target.value.replace(/,/g, '')))}
                    placeholder="Nhập giá nhập"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('attribute')}>
          <div className={cx('attributeHeader')}>
            <span>Thuộc tính</span>
          </div>
          <div className={cx('attributeContent')}>
            {
              attributeList.map((attribute, index) => (
                <div className={cx('attributeRow')}>
                  <span>Thuộc tính {index + 1} <span style={{ color: 'red', paddingLeft: 0 }}>*</span> </span>
                  <input
                    value={attribute}
                    onChange={(e) => {
                      handleAttributeChange(index, e.target.value)
                    }}
                    placeholder="Nhập tên thuộc tính mới"
                  />
                  {index === 0 ? '' : <Button className={cx('delete-button')} variant="text" startIcon={<ClearIcon />} onClick={() => handleDeleteAttribute(index)}>
                  </Button>}

                </div>
              ))
            }

          </div>
          <div className={cx('attribute-add-button')}>
            {
              attributeList.length < 3 ?
                <Button className={cx('add-button')} variant="text" startIcon={<AddOutlinedIcon />} onClick={handleAddAttribute}>
                </Button> : ''
            }
          </div>
        </div>

        <div className={cx('variants')}>
          <div className={cx('variantsHeader')}>
            <span>Phiên bản ({variantList.length})</span>
          </div>
          <div className={cx('variantContainer')}>
            {
              variantList.map((variant, index) => (
                <div>
                  <div className={cx('variantNumber')}>
                    <span>{index + 1}</span>
                    <Button className={cx('add-button')} variant="text" startIcon={<ClearIcon />} onClick={() => handleDeleteVariant(index)}>
                      Xóa phiên bản
                    </Button>
                  </div>
                  <div className={cx('variantItem')}>
                    <div className={cx('variantName')}>
                      <div>
                        <ImageUploader
                          keyInput={index}
                          witdh={'120px'}
                          height={'120px'}
                          fontSize={'30px'}
                          imageUrl={variant.image}
                          onImageUpload={(image) => handleVariantChange(index, 'image', image)} />
                      </div>
                      <input className={cx('inputItem')} value={variant.name} onChange={(e) => { handleVariantChange(index, 'name', e.target.value) }} />
                    </div>
                    <div className={cx('variantDetail')}>
                      <div className={cx('detailGroup')}>
                        <div className={cx('itemGroup')}>
                          <span className={cx('labelItem')}>Mã SKU:
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
                          <input className={cx('inputItem')} value={variant.sku} onChange={(e) => { handleVariantChange(index, 'sku', e.target.value) }} />
                        </div>
                        <div className={cx('itemGroup')}>
                          <span className={cx('labelItem')}>Barcode:<LightTooltip title="Nếu để trống, mã Barcode sẽ được đặt trùng với mã SKU" placement="top"><ErrorOutlineIcon style={{ height: '15px', color: 'blue' }} /></LightTooltip></span>
                          <input className={cx('inputItem')} value={variant.barcode} onChange={(e) => { handleVariantChange(index, 'barcode', e.target.value) }} />
                        </div>
                        <div className={cx('itemGroup')}>
                          <span className={cx('labelItem')}>Tồn kho:</span>
                          <input className={cx('inputItem')} type="text" value={numeral(variant.quantity).format(0,0)} onChange={(e) => { handleVariantChange(index, 'quantity', parseFloat(e.target.value.replace(/,/g, ''))) }} />
                        </div>
                      </div>
                      <div className={cx('detailGroup')}>
                        <div className={cx('itemGroup')}>
                          <span className={cx('labelItem')}>Giá bán lẻ:</span>
                          <input className={cx('inputItem')} type="text" value={numeral(variant.retailPrice).format(0,0)} onChange={(e) => { handleVariantChange(index, 'retailPrice', parseFloat(e.target.value.replace(/,/g, ''))) }} />
                        </div>
                        <div className={cx('itemGroup')}>
                          <span className={cx('labelItem')}>Giá bán buôn:</span>
                          <input className={cx('inputItem')} type="text" value={numeral(variant.wholeSalePrice).format(0,0)} onChange={(e) => { handleVariantChange(index, 'wholeSalePrice', parseFloat(e.target.value.replace(/,/g, ''))) }} />
                        </div>
                        <div className={cx('itemGroup')}>
                          <span className={cx('labelItem')}>Giá nhập:</span>
                          <input className={cx('inputItem')} type="text" value={numeral(variant.importPrice).format(0,0)} onChange={(e) => { handleVariantChange(index, 'importPrice', parseFloat(e.target.value.replace(/,/g, ''))) }} />
                        </div>
                      </div>
                      <div className={cx('detailGroup')}>
                        {attributeList.map((attribute, indexAttb) => (
                          <div className={cx('itemGroup')}>
                            <span className={cx('labelItem')}>{attribute}:<span style={{ color: 'red' }}>*</span></span>
                            <input
                              className={cx('inputItem')}

                              value={indexAttb === 0 ? variant.value1 : indexAttb === 1 ? variant.value2 : variant.value3}
                              onChange={(e) => {
                                indexAttb === 0 ? handleVariantChange(index, 'value1', e.target.value) :
                                  indexAttb === 1 ? handleVariantChange(index, 'value2', e.target.value) :
                                    handleVariantChange(index, 'value3', e.target.value)
                              }}
                            />
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                </div>
              ))
            }

          </div>
          <div className={cx('variant-add-button')}>
            <Button className={cx('add-button')} variant="text" startIcon={<AddOutlinedIcon />} onClick={handleAddVariant}>
            </Button>
          </div>
        </div>
      </div>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={typeAlert} sx={{ width: '100%' }}>
            {messageAlert}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  )
}

export default ProductCreate;