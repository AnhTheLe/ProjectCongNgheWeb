import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Popper from '@mui/material/Popper';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import numeral from 'numeral';

const textFieldStyle = {
    fontSize: '14px',
    textAlign: 'right',
};

const optionStyle = {
    fontSize: '12px',
    textTransform: 'none',
    fontWeight: 600,
    width: '50px',
    height: '30px',
    padding: '2px 3px !important',
};

function Discount({
    openDiscount,
    anchorElDiscount,
    popoverRef,
    handleSwapDiscountChange,
    discount,
    price,
    variantId,
}) {
    const [option, setOption] = useState('value');
    const [input, setInput] = useState(discount);

    const setVariant = (type) => {
        if (type === option) {
            return 'contained';
        }

        return 'outlined';
    };

    const handleChange = (currentOption, value) => {
        if (currentOption === 'value') {
            if (value > price) {
                value = price;
                handleSwapDiscountChange(variantId, price);
            } else {
                handleSwapDiscountChange(variantId, value);
            }
        } else if (currentOption === '%') {
            if (value > 100) {
                value = 100;
                handleSwapDiscountChange(variantId, price);
            } else {
                handleSwapDiscountChange(variantId, (price * value) / 100);
            }
        }

        setInput(value);
        setOption(currentOption);
    };

    return (
        <Popper open={openDiscount} anchorEl={anchorElDiscount} ref={popoverRef}>
            <div
                style={{
                    zIndex: 1300,
                    display: 'flex',
                    marginTop: '10px',
                    padding: '15px',
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    gap: '20px',
                }}
            >
                <ButtonGroup>
                    <Button onClick={() => handleChange('value', input)} variant={setVariant('value')} sx={optionStyle}>
                        Giá trị
                    </Button>
                    <Button onClick={() => handleChange('%', input)} variant={setVariant('%')} sx={optionStyle}>
                        %
                    </Button>
                </ButtonGroup>
                <TextField
                    sx={{ width: '70px' }}
                    inputProps={{ style: { ...textFieldStyle } }}
                    id="standard-basic"
                    variant="standard"
                    contentEditable="false"
                    value={numeral(input).format('0,0')}
                    onChange={(event) => handleChange(option, numeral(event.target.value).value())}
                />
            </div>
        </Popper>
    );
}

function DiscountInput({ discount, price, handleSwapDiscountChange, variantId }) {
    const popoverRef = useRef(null);
    const toggleDiscountRef = useRef(null);
    const [openDiscount, setOpenDiscount] = useState(false);
    const [anchorElDiscount, setAnchorElDiscount] = useState(null);

    const handlePopperClickDiscount = (event) => {
        setAnchorElDiscount(event.currentTarget);
        setOpenDiscount(!openDiscount);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDiscount &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                !toggleDiscountRef.current.contains(event.target)
            ) {
                setOpenDiscount(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [openDiscount]);

    return (
        <div>
            <TextField
                sx={{ width: '70px' }}
                inputProps={{ style: { ...textFieldStyle } }}
                id="standard-basic"
                variant="standard"
                value={numeral(discount).format('0,0')}
                onClick={handlePopperClickDiscount}
                ref={toggleDiscountRef}
            />
            <Discount
                openDiscount={openDiscount}
                anchorElDiscount={anchorElDiscount}
                popoverRef={popoverRef}
                discount={discount}
                price={price}
                handleSwapDiscountChange={handleSwapDiscountChange}
                variantId={variantId}
            />
        </div>
    );
}

export default DiscountInput;
