# Facticity Component Wrappers

This directory contains wrapper components that maintain existing Material-UI APIs while using shadcn/ui components underneath.

## Purpose

During the migration from Material-UI to shadcn/ui, these wrappers allow us to:

1. **Maintain existing APIs** - No need to change props across 80+ files
2. **Gradual migration** - Can be deployed with feature flags
3. **Mobile optimization** - Add mobile-first enhancements without breaking existing code
4. **Consistent branding** - Apply Facticity-specific styling consistently

## Usage Pattern

### Before (Material-UI)
```jsx
import { Button } from '@mui/material';

<Button variant="contained" color="primary" onClick={handleClick}>
  Fact Check
</Button>
```

### After (Facticity Wrapper)
```jsx
import { FacticityButton } from '@/components/wrappers';

<FacticityButton variant="contained" color="primary" onClick={handleClick}>
  Fact Check
</FacticityButton>
```

The wrapper translates MUI props to shadcn/ui equivalents while maintaining the same API.

## File Naming Convention

- `FacticityButton.jsx` - Button wrapper
- `FacticityInput.jsx` - Input/TextField wrapper
- `FacticityCard.jsx` - Card/Container wrapper
- etc.

## Mobile-First Guidelines

All wrappers should:
- Use minimum 44px touch targets
- Implement proper focus states for accessibility
- Support responsive sizing out of the box
- Include haptic feedback where appropriate (for Base Mini App)
