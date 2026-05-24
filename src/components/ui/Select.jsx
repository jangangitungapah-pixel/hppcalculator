import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  helperText,
  error,
  id,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const selectId = id || Math.random().toString(36).substr(2, 9);
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-base font-semibold text-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full h-11 bg-surface border rounded-md text-base text-text-primary
            focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
            appearance-none
            transition-colors duration-normal
            ${error ? 'border-status-loss focus:ring-status-loss' : 'border-border'}
            pl-3 pr-10
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText && !error ? helperId : ''}`.trim() || undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Caret */}
        <div className="absolute right-3 pointer-events-none text-text-secondary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {error ? (
        <span id={errorId} className="text-sm text-status-loss mt-0.5">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-sm text-text-secondary mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
