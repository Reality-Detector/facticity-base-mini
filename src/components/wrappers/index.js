// Export all Facticity wrapper components from this index
// These wrappers maintain existing APIs while using shadcn/ui underneath
// This allows for clean imports like: import { FacticityButton, FacticityInput } from '@/components/wrappers'

// Feature Flag Utilities
export { 
  FeatureFlagWrapper, 
  ComponentFeatureFlagWrapper, 
  useFeatureFlags 
} from './FeatureFlagWrapper';

// Wrapper Components
export { default as FacticityButton } from './FacticityButton';
