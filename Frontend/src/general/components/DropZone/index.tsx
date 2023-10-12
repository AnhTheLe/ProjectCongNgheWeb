/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Box } from '@mui/material';

// BaseDropzone.propTypes = {
//   parentCallback: PropTypes.func,
//   isClear: PropTypes.bool,
// };
// BaseDropzone.defaultProps = {
//   parentCallback: null,
//   isClear: false,
// };

interface Props {
  parentCallback: (image: any) => void;
  isClear: boolean;
}

function BaseDropzone(props: Props) {
  const { parentCallback, isClear } = props;
  const [images, setImages] = useState<any>([]);
  const [clearImg, setClearImg] = useState(isClear);
  const [isDrapping, setIsDrapping] = useState(false);
  const fileInputRef = useRef<any>(null);
  useEffect(() => {
    parentCallback(images);
  }, [images]);
  useEffect(() => {
    setImages([]);
  }, [isClear]);
  const selectFiles = () => {
    fileInputRef.current !== null && fileInputRef.current.click();
  };
  const onFileSelect = (e: any) => {
    const files = e.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
      if (!images.some((e: { name: any }) => e.name === files[i].name)) {
        setImages((prevImages: any) => [
          ...prevImages,
          files[i],
          // {
          //     name: files[i].name,
          //     url: URL.createObjectURL(files[i]),
          // },
        ]);
      }
    }
  };
  const deleteImage = (index: any) => {
    setImages((prevImages: any) => prevImages.filter((_: any, i: any) => i !== index));
  };
  const onDragOver = (e: any) => {
    e.preventDefault();
    setIsDrapping(true);
    e.dataTransfer.dropEffect = 'copy';
  };
  const onDragLeave = (e: any) => {
    e.preventDefault();
    setIsDrapping(false);
  };
  const onDrop = (e: any) => {
    e.preventDefault();
    setIsDrapping(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
      if (!images.some((e: any) => e.name === files[i].name)) {
        setImages((prevImages: any) => [...prevImages, files[i]]);
      }
    }
  };
  return (
    <Box className="BaseDropzone w-100">
      <Box className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {isDrapping ? (
          <span>Kéo thả ảnh vào đây</span>
        ) : (
          <Box>
            Kéo thả ảnh hoặc{' '}
            <span className="btn-upload" role="button" onClick={selectFiles}>
              tải ảnh từ thiết bị
            </span>
          </Box>
        )}
        <input className="d-none" type="file" name="file" multiple ref={fileInputRef} onChange={onFileSelect} />
      </Box>
      <Box className="img-list w-100 d-flex justify-content-start align-items-start flex-wrap">
        {images.map((fileImg: any, index: any) => (
          <Box className="image-item m-2" key={index}>
            <span
              className="delete-img d-flex justify-content-center align-items-center rounded-circle"
              onClick={() => deleteImage(index)}
            >
              <i className="fa-solid fa-xmark"></i>
            </span>
            <img src={URL.createObjectURL(fileImg)} alt={fileImg.name} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default BaseDropzone;
