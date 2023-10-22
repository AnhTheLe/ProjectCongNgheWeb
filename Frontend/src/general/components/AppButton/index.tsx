import React, { ReactNode } from 'react';
import Button from '@mui/material/Button';
import './style.scss';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export interface AppButtonProps {
  id?: string;
  className?: string;
  text?: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const AppButton = ({
  id,
  className,
  text,
  variant,
  size = 'medium',
  disabled,
  loading,
  type = 'button',
  children,
  startIcon,
  endIcon,
  onClick,
}: AppButtonProps) => {
  function clicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (onClick) {
      onClick(e);
    }
  }
  return (
    <Button
      size={size}
      className={`AppButton ${className}`}
      onClick={clicked}
      variant={variant}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {text}
    </Button>
  );
};
