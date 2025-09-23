/**
 * Feature Flags for Facticity App
 * 
 * Centralized feature flag management for gradual rollouts
 * during the shadcn/ui migration
 */

/**
 * Check if the new shadcn/ui components should be used globally
 * @returns {boolean} True if new UI should be used
 */
export const useNewUI = () => {
  return process.env.NEXT_PUBLIC_USE_NEW_UI === 'true';
};

/**
 * Check if a specific component should use the new UI
 * @param {string} componentName - Name of the component (Button, Input, Card, etc.)
 * @returns {boolean} True if component should use new UI
 */
export const useNewUIForComponent = (componentName) => {
  // Check global flag first
  if (!useNewUI()) {
    return false;
  }
  
  // Check component-specific flag
  const componentFlag = process.env[`NEXT_PUBLIC_USE_NEW_UI_${componentName.toUpperCase()}`];
  if (componentFlag !== undefined) {
    return componentFlag === 'true';
  }
  
  // Default to global flag if no specific flag is set
  return true;
};

/**
 * Feature flag constants for easy reference
 */
export const FEATURE_FLAGS = {
  NEW_UI: 'NEXT_PUBLIC_USE_NEW_UI',
  NEW_BUTTON: 'NEXT_PUBLIC_USE_NEW_UI_BUTTON',
  NEW_INPUT: 'NEXT_PUBLIC_USE_NEW_UI_INPUT',
  NEW_CARD: 'NEXT_PUBLIC_USE_NEW_UI_CARD',
};

/**
 * Development helper to check all current flag values
 * @returns {Object} Current flag values
 */
export const getFeatureFlagStatus = () => {
  return {
    globalNewUI: useNewUI(),
    newButton: useNewUIForComponent('Button'),
    newInput: useNewUIForComponent('Input'),
    newCard: useNewUIForComponent('Card'),
  };
};
