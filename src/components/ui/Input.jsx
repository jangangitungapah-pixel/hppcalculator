import React from 'react';

export const Input = React.forwardRef(({
  label,
  helperText,
  error,
  prefix,
  suffix,
  id,
  className = '',
  containerClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || Math.random().toString(36).substr(2, 9);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`form-field ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      
      <div className="input-shell">
        {prefix && (
          <span className="form-prefix">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`form-input ${prefix ? 'input-with-prefix' : ''} ${suffix ? 'input-with-suffix' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText && !error ? helperId : ''}`.trim() || undefined}
          {...props}
        />
        
        {suffix && (
          <span className="form-suffix">
            {suffix}
          </span>
        )}
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

Input.displayName = 'Input';
