# Facticity Component Wrappers

This folder contains wrapper components that maintain existing Material-UI APIs while using shadcn/ui components underneath.

## Purpose

During the migration from Material-UI to shadcn/ui, these wrappers allow us to:

1. **Maintain existing APIs** - No need to change props for simple components like Button, Card and Badge (I hope)
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

The wrapper translates MUI props to shadcn/ui equivalents while maintaining the (mostly) same API. Transitioning is smooth but complex components will require individual attention for refactoring..

## File Naming Convention

- `FacticityButton.jsx` - Button wrapper
- `FacticityInput.jsx` - Input/TextField wrapper
- `FacticityCard.jsx` - Card/Container wrapper
- etc.

## Feature Flag Usage

Enable gradual rollout with environment variables in `.env.local`:

### Main idea/flow for switching between new and old components:

Global flag OFF → Everything uses MUI (safe default)

Global flag ON → Check individual component flags
  
  └─ Component flag ON → Use shadcn
  
  └─ Component flag OFF → Use MUI  
  
  └─ No component flag → Use shadcn (default to new)

This scheme is to quickly sitch between mui and shadcn copmonents ro that rollback is possible with one global flag
```bash
# Global flag - enables/disables all shadcn components
NEXT_PUBLIC_USE_NEW_UI=true

# Component-specific flags (only work if global flag is true)
NEXT_PUBLIC_USE_NEW_UI_BUTTON=true
NEXT_PUBLIC_USE_NEW_UI_INPUT=true
NEXT_PUBLIC_USE_NEW_UI_CARD=true
```

### Using Feature Flag Wrappers

```jsx
import { FeatureFlagWrapper } from '@/components/wrappers';
import { Button } from '@mui/material';
import { Button as ShadcnButton } from '@/components/ui';

<FeatureFlagWrapper
  oldComponent={Button}
  newComponent={ShadcnButton}
  variant="contained"
  color="primary"
>
  Fact Check
</FeatureFlagWrapper>
```

### Using Component-Specific Flags

```jsx
import { ComponentFeatureFlagWrapper } from '@/components/wrappers';

<ComponentFeatureFlagWrapper
  componentName="Button"
  oldComponent={MuiButton}
  newComponent={ShadcnButton}
  variant="contained"
>
  Click me
</ComponentFeatureFlagWrapper>
```

### Using Feature Flag Hooks

```jsx
import { useFeatureFlags } from '@/components/wrappers';

const MyComponent = () => {
  const { useNewUIForComponent, getComponent } = useFeatureFlags('Button');
  
  const ButtonComponent = getComponent(ShadcnButton, MuiButton);
  
  return <ButtonComponent>Click me</ButtonComponent>;
};
```

## Mobile-First Guidelines

All wrappers should:
- Use minimum 44px touch targets
- Implement proper focus states for accessibility
- Support responsive sizing out of the box
