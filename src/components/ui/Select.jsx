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
    <div className={`form-field ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      
      <div className="input-shell">
        <select
          ref={ref}
          id={selectId}
          className={`form-select ${className}`}
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
        <div className="form-suffix pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {error ? (
        <span id={errorId} className="form-error">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="form-helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
