import React from 'react';
import { FadeIn } from '../motion/FadeIn';

export const CalculatorStepCard = ({ stepNumber, title, helperText, children }) => {
  return (
    <FadeIn>
      <div className="bg-surface border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-orange-500/20 transition-all duration-300 group">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-orange-500/10 transition-transform duration-300 group-hover:scale-110">
            {stepNumber}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] sm:text-base font-extrabold text-text-primary tracking-tight leading-tight transition-colors group-hover:text-brand-primary">
              {title}
            </h2>
            {helperText && (
              <p className="text-xs sm:text-[13px] font-semibold text-text-secondary mt-1 leading-relaxed">
                {helperText}
              </p>
            )}
          </div>
        </div>
        <div className="calculator-step-body mt-2">
          {children}
        </div>
      </div>
    </FadeIn>
  );
};

