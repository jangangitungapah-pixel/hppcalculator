import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';

export const StrongConfirmDialog = ({ 
  open, 
  title, 
  description, 
  requiredText, 
  confirmLabel, 
  cancelLabel, 
  onConfirm, 
  onCancel 
}) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (open) {
      setInput('');
    }
  }, [open]);

  if (!open) return null;

  const isMatch = input === requiredText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-red-600 mb-2">{title}</h3>
          <p className="text-text-secondary text-sm mb-6">{description}</p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium mb-3">
              Ketik <strong className="font-mono bg-white px-1 py-0.5 rounded border border-red-200">{requiredText}</strong> untuk konfirmasi.
            </p>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 uppercase font-mono tracking-widest text-center text-lg"
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              placeholder={requiredText}
              autoFocus
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button 
              variant="ghost" 
              className="w-full sm:flex-1 order-2 sm:order-1" 
              onClick={onCancel}
            >
              {cancelLabel || t('cancel', 'Batal')}
            </Button>
            <Button 
              variant="danger" 
              className="w-full sm:flex-1 order-1 sm:order-2" 
              disabled={!isMatch} 
              onClick={() => {
                if (isMatch) onConfirm();
              }}
            >
              {confirmLabel || t('confirm', 'Konfirmasi')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
