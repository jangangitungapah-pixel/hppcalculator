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
    <div className="dialog-overlay">
      <div 
        ref={dialogRef}
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        tabIndex="-1"
      >
        <h2 id="dialog-title" className="dialog-title">
          {title}
        </h2>
        
        {description && (
          <p id="dialog-description" className="dialog-description">
            {description}
          </p>
        )}

        <div className="dialog-actions flex flex-col sm:flex-row gap-2 mt-6">
          <Button 
            variant="ghost" 
            className="w-full sm:flex-1 order-2 sm:order-1" 
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            className="w-full sm:flex-1 order-1 sm:order-2" 
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
