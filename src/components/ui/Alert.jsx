import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const Alert = ({ children, type = 'info', title, className = '' }) => {
  const types = {
    info: {
      container: 'bg-status-okayBg border-status-okay/20 text-status-okay',
      icon: <Info className="w-5 h-5" />,
      text: 'text-status-okay',
    },
    warning: {
      container: 'bg-status-lowBg border-status-low/20 text-status-low',
      icon: <AlertTriangle className="w-5 h-5" />,
      text: 'text-status-low',
    },
    danger: {
      container: 'bg-status-lossBg border-status-loss/20 text-status-loss',
      icon: <AlertCircle className="w-5 h-5" />,
      text: 'text-status-loss',
    },
    success: {
      container: 'bg-status-goodBg border-status-good/20 text-status-good',
      icon: <CheckCircle2 className="w-5 h-5" />,
      text: 'text-status-good',
    },
  };

  const style = types[type] || types.info;

  return (
    <div className={`flex gap-3 p-4 border rounded-lg ${style.container} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex flex-col gap-1">
        {title && <h4 className={`font-semibold ${style.text}`}>{title}</h4>}
        <div className={`text-sm opacity-90 ${style.text}`}>{children}</div>
      </div>
    </div>
  );
};
