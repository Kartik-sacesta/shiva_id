import React, { useState } from 'react';
import { StepNavigationContext } from './stepNavigationContext';
import { STEPS } from '../constants/StepConstants';

export const StepNavigationProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isOnCreateCardPage, setIsOnCreateCardPage] = useState(false);
  const [cardId, setCardId] = useState(null);

  const value = {
    activeStep,
    setActiveStep,
    isOnCreateCardPage,
    setIsOnCreateCardPage,
    cardId,
    setCardId,
    steps: STEPS,
  };

  return (
    <StepNavigationContext.Provider value={value}>
      {children}
    </StepNavigationContext.Provider>
  );
};
