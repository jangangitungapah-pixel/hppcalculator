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
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-base font-semibold text-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-text-secondary">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full h-11 bg-surface border rounded-md text-base text-text-primary
            focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
            placeholder:text-text-muted
            transition-colors duration-normal
            ${error ? 'border-status-loss focus:ring-status-loss' : 'border-border'}
            ${prefix ? 'pl-10' : 'pl-3'}
            ${suffix ? 'pr-14' : 'pr-3'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText && !error ? helperId : ''}`.trim() || undefined}
          {...props}
        />
        
        {suffix && (
          <span className="absolute right-3 text-text-secondary pointer-events-none">
            {suffix}
          </span>
        )}
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

Input.displayName = 'Input';
