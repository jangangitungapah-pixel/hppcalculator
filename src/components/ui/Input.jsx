import React from 'react';
import { cn } from '../../lib/ui/cn';

export const Input = React.forwardRef(({
  label,
  helperText,
  error,
  prefix,
  suffix,
  id,
  className,
  containerClassName,
  type = 'text',
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || `input-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-bold text-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center group">
        {prefix && (
          <span className="absolute left-3 text-text-muted group-focus-within:text-primary transition-colors">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "w-full h-[48px] bg-surface border border-border rounded-xl px-4 text-base text-text-primary transition-all duration-300 ease-[var(--ease-out)]",
            "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
            "disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed",
            "placeholder:text-text-soft",
            prefix && "pl-10",
            suffix && "pr-10",
            error && "border-danger focus:border-danger focus:ring-danger/10",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText && !error ? helperId : ''}`.trim() || undefined}
          {...props}
        />
        
        {suffix && (
          <span className="absolute right-3 text-text-muted">
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <span id={errorId} className="text-xs text-danger font-medium mt-0.5">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-xs text-text-secondary mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
