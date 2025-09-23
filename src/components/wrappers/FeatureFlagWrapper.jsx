/**
 * FeatureFlagWrapper Component
 * 
 * A utility component that conditionally renders new or old UI
 * based on feature flags. This enables gradual rollout during migration.
 */

import React from 'react';
import { useNewUI, useNewUIForComponent } from '../../lib/featureFlags';

/**
 * Conditionally render new or old component based on global feature flag
 * @param {Object} props
 * @param {React.Component} props.newComponent - The shadcn/ui component
 * @param {React.Component} props.oldComponent - The Material-UI component
 * @param {React.ReactNode} props.children - Children to pass to active component
 * @param {Object} props.componentProps - Props to pass to the active component
 */
export const FeatureFlagWrapper = ({ 
  newComponent: NewComponent, 
  oldComponent: OldComponent, 
  children,
  componentProps = {},
  ...restProps 
}) => {
  const shouldUseNewUI = useNewUI();
  
  if (shouldUseNewUI && NewComponent) {
    return <NewComponent {...componentProps} {...restProps}>{children}</NewComponent>;
  }
  
  return <OldComponent {...componentProps} {...restProps}>{children}</OldComponent>;
};

/**
 * Component-specific feature flag wrapper
 * @param {Object} props
 * @param {string} props.componentName - Name of the component for specific flag checking
 * @param {React.Component} props.newComponent - The shadcn/ui component
 * @param {React.Component} props.oldComponent - The Material-UI component
 * @param {React.ReactNode} props.children - Children to pass to active component
 * @param {Object} props.componentProps - Props to pass to the active component
 */
export const ComponentFeatureFlagWrapper = ({ 
  componentName,
  newComponent: NewComponent, 
  oldComponent: OldComponent, 
  children,
  componentProps = {},
  ...restProps 
}) => {
  const shouldUseNewUI = useNewUIForComponent(componentName);
  
  if (shouldUseNewUI && NewComponent) {
    return <NewComponent {...componentProps} {...restProps}>{children}</NewComponent>;
  }
  
  return <OldComponent {...componentProps} {...restProps}>{children}</OldComponent>;
};

/**
 * Hook for conditional logic based on feature flags
 * @param {string} componentName - Optional component name for specific checks
 * @returns {Object} Feature flag state and utilities
 */
export const useFeatureFlags = (componentName = null) => {
  const globalNewUI = useNewUI();
  const componentNewUI = componentName ? useNewUIForComponent(componentName) : globalNewUI;
  
  return {
    useNewUI: globalNewUI,
    useNewUIForComponent: componentNewUI,
    // Helper function to get the right component
    getComponent: (newComp, oldComp) => componentNewUI ? newComp : oldComp,
    // Helper function to get conditional props
    getProps: (newProps = {}, oldProps = {}) => componentNewUI ? newProps : oldProps,
  };
};

export default FeatureFlagWrapper;
