/**
 * FacticityButton - MUI-compatible wrapper for shadcn/ui Button
 * 
 * Maintains Material-UI Button API while using shadcn/ui underneath
 * Includes mobile-first optimizations for the Base Mini App
 */

import React from 'react';
import { Button } from '@/components/ui';
import { useNewUIForComponent } from '@/lib/featureFlags';
import { Button as MuiButton } from '@mui/material';

/**
 * Map Material-UI props to shadcn/ui equivalents
 */
const mapMuiPropsToShadcn = (props) => {
  const {
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    fullWidth = false,
    startIcon,
    endIcon,
    sx, // MUI styling - we'll ignore this for shadcn
    ...rest
  } = props;

  // Map MUI variants to shadcn variants
  const variantMap = {
    'contained': color === 'primary' ? 'default' : 'secondary',
    'outlined': 'outline',
    'text': 'ghost',
  };

  // Map MUI sizes to shadcn sizes
  const sizeMap = {
    'small': 'sm',
    'medium': 'default', 
    'large': 'lg',
  };

  // Build shadcn props
  const shadcnProps = {
    variant: variantMap[variant] || 'default',
    size: sizeMap[size] || 'default',
    className: fullWidth ? 'w-full' : '',
    ...rest
  };

  return {
    shadcnProps,
    startIcon,
    endIcon,
  };
};

/**
 * FacticityButton Component
 */
const FacticityButton = React.forwardRef((props, ref) => {
  const shouldUseNewUI = useNewUIForComponent('Button');
  
  // If feature flag is off, use Material-UI Button
  if (!shouldUseNewUI) {
    return <MuiButton ref={ref} {...props} />;
  }

  // Use shadcn Button with mapped props
  const { shadcnProps, startIcon, endIcon } = mapMuiPropsToShadcn(props);
  
  return (
    <Button ref={ref} {...shadcnProps}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {props.children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </Button>
  );
});

FacticityButton.displayName = 'FacticityButton';

export default FacticityButton;
