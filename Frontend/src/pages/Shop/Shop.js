import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import classNames from 'classnames/bind';
import styles from './Shop.module.scss';
import { makeStyles, withTheme } from '@mui/styles';
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { getListCountryVietNam } from '../../services/provinceServices/getListCountryVietNam';
import { useState } from 'react';
import { getShopInfo, updateShopInfo } from '../../services/shopServices'
import { AuthContext } from '../../contexts/AuthContex';
import { getProvince } from '../../services/provinceServices';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ImageUploader from '../../components/Upload/ImageUploader';
const cx = classNames.bind(styles);
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const listBusiness = ["Thời trang - May mặc", "Thủ công mỹ nghệ", "Dược", "Xây dựng"];
const useStyles = makeStyles({
  customTextField: {
    '& .MuiOutlinedInput-root': {
      height: '40px',
      'background-color': 'white',
    },
  },
});

function Shop() {
  const classes = useStyles();
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shopInfo, setShopInfo] = useState({});
  const { token } = useContext(AuthContext);

  //
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProvince()
        if (data.data) {
          setCitys(data.data)
          handleSelectChangeDistrict(data.data[0].districts)
          handleSelectChangeWard(data.data[0].districts[0].wards)
        }
      } catch (error) {

      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    getShopInfoData()
  }, [])

  const getShopInfoData = async () => {
    try {
      const res = await getShopInfo(token);
      console.log(res.data);
      if (res.data) {
        setShopInfo(res.data)
        handleSelectChangeCity(res.data.city)
      }
    }
    catch (error) {

    }
  }

  const handleChangeInput = (key, value) => {
    const newShop = { ...shopInfo, [key]: value };
    setShopInfo(newShop);
  }

  const handleSelectChangeCity = (value) => {
    const city = citys.find(item => item.name === value);
    const listDistrict = city.districts
    setDistricts(listDistrict)
    setWards(listDistrict[0].wards)
    const newShop = { ...shopInfo, city: value, district: listDistrict[0].name, wards: listDistrict[0].wards[0].name };
    setShopInfo(newShop);
  }

  const handleSelectChangeDistrict = (value) => {
    const district = districts.find(item => item.name === value);
    const listWards = district.wards
    setWards(listWards)
    const newShop = { ...shopInfo, district: value, wards: listWards[0].name };
    setShopInfo(newShop);
  }

  const handleSelectChangeWard = (value) => {
    const newShop = { ...shopInfo, wards: value };
    setShopInfo(newShop);
  }

  const handleSave = async () => {
    if (validateData()) {
      try {
        const res = await updateShopInfo(shopInfo, token);
        if (res.data) {
          console.log(res.data);
          handleOpenAlert('Cập nhật thành công', 'success')
        }
      } catch (error) {

      }
    }
  }

  const validateData = () => {
    if (shopInfo.name === '') {
      handleOpenAlert('Hãy nhập tên cửa hàng', 'error')
      return false
    }
    if (shopInfo.phone === '') {
      handleOpenAlert('Hãy nhập số điện thoại', 'error')
      return false
    }
    if (shopInfo.phone !== '') {
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(shopInfo.phone)) {
        handleOpenAlert('Số điện thoại phải có 10 chữ số', 'error')
        return false;
      }
    }

    if (shopInfo.email !== '') {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(shopInfo.email)) {
        handleOpenAlert('Không đúng định dạng email', 'error')
        return false
      }
    }

    return true;


  }
  return (
    <>
      <div className={cx('wrap')}>
        <div className={cx('shopinfo-root')}>
          <div className={cx('shopinfo-box')}>
            <div className={cx('shopinfo-box-title')}>
              <p>Thông tin liên hệ</p>
              <p>Thông tin được sử dụng để khách hàng liên hệ đến cửa hàng</p>
            </div>
            <div className={cx('shopinfo-box-content')}>
              <div className={cx('shopinfo-avatar')}>
                <ImageUploader
                  keyInput={1}
                  witdh={'120px'}
                  height={'120px'}
                  fontSize={'40px'}
                  imageUrl={shopInfo.avatar}
                  onImageUpload={(image) => handleChangeInput('avatar', image)} />
              </div>
              <div className={cx('personalInfoContent')}>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('oneColumnPerRow')}>
                    <div className={cx('personalInfoTitle')}>
                      Tên của hàng <span style={{ color: 'red' }}>*</span>
                    </div>
                    <div className={cx('personalInfoValue')}>
                      <input
                        value={shopInfo.name}
                        onChange={(e) => handleChangeInput('name', e.target.value)}
                        placeholder="Nhập tên của hàng"
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('oneColumnPerRow')}>
                    <div className={cx('personalInfoTitle')}>
                      Số điện thoại <span style={{ color: 'red' }}>*</span>
                    </div>
                    <div className={cx('personalInfoValue')}>
                      <input

                        onChange={(e) => handleChangeInput('phone', e.target.value)}
                        value={shopInfo.phone}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('personalInfoContentCol')}>
                    <div className={cx('personalInfoTitle')}>Email

                    </div>
                    <div className={cx('personalInfoValue')}>
                      <input
                        type='email'
                        onChange={(e) => handleChangeInput('email', e.target.value)}
                        value={shopInfo.email}
                        placeholder="Nhập email"
                      ></input>
                    </div>
                  </div>
                  <div className={cx('personalInfoContentCol')}>
                    <div className={cx('personalInfoTitle')}>Lĩnh vực kinh doanh </div>
                    <div className={cx('personalInfoValue')}>
                      {shopInfo.business ? <TextField
                        className={classes.customTextField}
                        select
                        defaultValue={shopInfo.business}
                        onChange={(e) => handleChangeInput('business', e.target.value)}
                      >
                        {listBusiness.map((business) => (
                          <MenuItem key={business} value={business}>
                            {business}
                          </MenuItem>
                        ))}
                      </TextField> :
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue="Thời trang - May mặc"
                          onChange={(e) => handleChangeInput('business', e.target.value)}
                        >
                          {listBusiness.map((business) => (
                            <MenuItem key={business} value={business}>
                              {business}
                            </MenuItem>
                          ))}
                        </TextField>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('shopinfo-box')}>
            <div className={cx('shopinfo-box-title')}>
              <p>Địa chỉ cửa hàng</p>
              <p>Thông tin được sử dụng để khách hàng tìm đến cửa hàng</p>
            </div>
            <div className={cx('shopinfo-box-content')}>
              <div className={cx('personalInfoContent')}>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('oneColumnPerRow')}>
                    <div className={cx('personalInfoTitle')}>
                      Địa chỉ hiển thị
                    </div>
                    <div className={cx('personalInfoValue')}>
                      <input
                        className={cx('input-disable')}
                        value={shopInfo.city ? (shopInfo.address ? shopInfo.address + " - " : '') + shopInfo.wards + " - " + shopInfo.district + " - " + shopInfo.city : ''}
                        disabled
                        style={{ background: '#F4F6F8' }}
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('oneColumnPerRow')}>
                    <div className={cx('personalInfoTitle')}>
                      Địa chỉ cụ thể
                    </div>
                    <div className={cx('personalInfoValue')}>
                      <input

                        onChange={(e) => handleChangeInput('address', e.target.value)}
                        value={shopInfo.address}
                        placeholder="Nhập địa chỉ cụ thể"
                      />
                    </div>
                  </div>
                </div>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('oneColumnPerRow')}>
                    <div className={cx('personalInfoTitle')}>
                      Tỉnh/Thành phố
                    </div>
                    <div className={cx('personalInfoValue')}>
                      {shopInfo.city ?
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue={shopInfo.city}
                          onChange={(event) => handleSelectChangeCity(event.target.value)}
                        >
                          {citys.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        :
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue=''
                          onChange={(event) => handleSelectChangeCity(event.target.value)}
                        >
                          {citys.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      }

                    </div>
                  </div>
                </div>
                <div className={cx('personalInfoContentRow')}>
                  <div className={cx('personalInfoContentCol')}>
                    <div className={cx('personalInfoTitle')}>
                      Quận/Huyện
                    </div>
                    <div className={cx('personalInfoValue')}>
                      {shopInfo.district ? 
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue={shopInfo.district}
                          onChange={(event) => handleSelectChangeDistrict(event.target.value)}
                        >
                          {districts.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        :
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue=''
                          onChange={(event) => handleSelectChangeDistrict(event.target.value)}
                        >
                          {districts.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      }

                    </div>
                  </div>
                  <div className={cx('personalInfoContentCol')}>
                    <div className={cx('personalInfoTitle')}>Phường xã</div>
                    <div className={cx('personalInfoValue')}>
                      {shopInfo.wards ? 
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue={shopInfo.wards}
                          onChange={(event) => handleSelectChangeWard(event.target.value)}
                        >
                          {wards.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        :
                        <TextField
                          className={classes.customTextField}
                          select
                          defaultValue=''
                          onChange={(event) => handleSelectChangeWard(event.target.value)}
                        >
                          {wards.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('button')}>
            <Button variant="contained" onClick={() => handleSave()}>
              Lưu
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

export default Shop;