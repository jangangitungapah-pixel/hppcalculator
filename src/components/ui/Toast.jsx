import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ id, type = 'info', title, message, onRemove }) => {
  const types = {
    success: {
      bg: 'bg-status-goodBg',
      border: 'border-status-good/30',
      text: 'text-status-good',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    error: {
      bg: 'bg-status-lossBg',
      border: 'border-status-loss/30',
      text: 'text-status-loss',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    warning: {
      bg: 'bg-status-lowBg',
      border: 'border-status-low/30',
      text: 'text-status-low',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      bg: 'bg-status-okayBg',
      border: 'border-status-okay/30',
      text: 'text-status-okay',
      icon: <Info className="w-5 h-5" />,
    }
  };

  const style = types[type] || types.info;

  return (
    <div 
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-floating p-4 flex gap-3 items-start ${style.bg} ${style.border}`}
      role="alert"
    >
      <div className={`shrink-0 mt-0.5 ${style.text}`}>
        {style.icon}
      </div>
      <div className="flex-1 w-0">
        {title && <p className={`text-sm font-semibold ${style.text}`}>{title}</p>}
        {message && <p className={`mt-1 text-sm opacity-90 ${style.text}`}>{message}</p>}
      </div>
      <div className="shrink-0 flex ml-4">
        <button
          className={`rounded-md inline-flex hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${style.text}`}
          onClick={() => onRemove(id)}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
