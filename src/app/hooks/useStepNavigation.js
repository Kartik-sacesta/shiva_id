import { useContext } from 'react';
import { StepNavigationContext } from '../contexts/stepNavigationContext';

export const useStepNavigation = () => {
  const context = useContext(StepNavigationContext);
  if (!context) {
    throw new Error('useStepNavigation must be used within a StepNavigationProvider');
  }
  return context;
};
