import React from 'react';
import { FadeIn } from '../motion/FadeIn';

export const CalculatorStepCard = ({ stepNumber, title, helperText, children }) => {
  return (
    <FadeIn>
      <div className="calculator-step-card">
        <div className="calculator-step-header">
          <div className="calculator-step-number">{stepNumber}</div>
          <div className="calculator-step-title-block">
            <h2 className="calculator-step-title">{title}</h2>
            {helperText && <p className="calculator-step-helper">{helperText}</p>}
          </div>
        </div>
        <div className="calculator-step-body">
          {children}
        </div>
      </div>
    </FadeIn>
  );
};
