import classNames from 'classnames/bind';
import styles from './InputVariantTable.module.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContex';
import { getListVariant, searchVariant } from '../../services/productManagerServices/getListVariant';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import Checkbox from '@mui/material/Checkbox';
import { Link } from '@mui/material';
import Button from '@mui/material/Button';

const cx = classNames.bind(styles);
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
function InputVariantTable({ width, height, onAddVariantList, onInputSearchChange, openPopup, onClosePopup }) {
  const { token } = useContext(AuthContext)
  const [variantList, setVariantList] = useState([]);
  const [variantSelectedList, setVariantSelectedList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListVariant({ page: 1, pageSize: 10 }, token);
        setVariantList(res.data);
      } catch (error) {
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await searchVariant(onInputSearchChange, token);
        setVariantList(res.data);
      } catch (error) {
      }
    }
    fetchData()
  }, [onInputSearchChange])


  const handleAddVariant = (variant) => {
    const isVariantSelected = variantSelectedList.some((item) => item.id === variant.id);

    if (!isVariantSelected) {
      const newVariantSelectedList = [...variantSelectedList, variant];
      setVariantSelectedList(newVariantSelectedList);
    }
  };


  const handleDeleteVariant = (variant) => {
    const index = variantSelectedList.findIndex((item) => item.id === variant.id);
    if (index !== -1) {
      const newVariantSelectedList = [...variantSelectedList];
      newVariantSelectedList.splice(index, 1);
      setVariantSelectedList(newVariantSelectedList);
    }
  };

  const handleClickAddButton = () => {
    onAddVariantList(variantSelectedList);

    onClosePopup()
  }

  const handleDoubleClickVariant = (variant) => {
    onAddVariantList([variant])
    onClosePopup()
  }


  return (
    <div className='popup-input-varant'>
      <div className={cx('wrap')} style={{ width: width, height: height }}>
        <div className={cx('variant-list')} >
          {variantList.map((variant, index) => (
            <div className={cx('variant-item')} onDoubleClick={() => handleDoubleClickVariant(variant)}>
              <div className={cx('checkbox')}>
                <input
                  type="checkbox"
                  checked={variantSelectedList.some((item) => item.id === variant.id)}
                  onChange={() => {
                    if (variantSelectedList.some((item) => item.id === variant.id)) {
                      handleDeleteVariant(variant);
                    } else {
                      handleAddVariant(variant);
                    }
                  }}
                />
              </div>
              <div className={cx('image')}>
                {variant.image ?
                  <img src={variant.image} alt={variant.image} /> :
                  <CropOriginalIcon />
                }
              </div>
              <div className={cx('name-sku')}>
                <span>{variant.name}</span>
                <a href="http://localhost:3000/admin/base-products">{variant.sku}</a>
              </div>
              <div className={cx('quantity')}>
                <span>Tồn kho: </span>
                <span>{variant.quantity}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={cx('buttonAdd')}>
          <Button variant="contained" onClick={() => handleClickAddButton()}>Thêm</Button>
        </div>
      </div>

    </div>
  )

}

export default InputVariantTable;
