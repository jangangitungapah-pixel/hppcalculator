import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "default",
  onConfirm,
  onCancel
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onCancel}
      />
      
      <div 
        ref={dialogRef}
        className="bg-surface rounded-xl shadow-floating w-full max-w-md p-6 relative z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-normal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        tabIndex="-1"
      >
        <h2 id="dialog-title" className="text-xl font-bold text-text-primary">
          {title}
        </h2>
        
        {description && (
          <p id="dialog-description" className="text-text-secondary">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'destructive' : 'primary'} 
            className="flex-1" 
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
