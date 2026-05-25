import React from 'react';
import { cn } from '../../lib/ui/cn';

export const Select = React.forwardRef(({
  label,
  options = [],
  helperText,
  error,
  id,
  className,
  containerClassName,
  ...props
}, ref) => {
  const selectId = id || Math.random().toString(36).substr(2, 9);
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-bold text-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center group">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full h-[48px] bg-surface border border-border rounded-xl px-4 appearance-none text-base text-text-primary transition-all duration-300 ease-[var(--ease-out)]",
            "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
            "disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed",
            error && "border-danger focus:border-danger focus:ring-danger/10",
            className
          )}
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
        <div className="absolute right-3 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
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

Select.displayName = 'Select';
