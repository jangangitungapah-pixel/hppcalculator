import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/ui/cn';

const alertVariants = cva(
  "flex gap-3 p-4 rounded-xl border transition-premium",
  {
    variants: {
      type: {
        info: "bg-status-okayBg border-status-okay/20 text-status-okay",
        warning: "bg-status-lowBg border-status-low/20 text-status-low",
        danger: "bg-status-lossBg border-status-loss/20 text-status-loss",
        success: "bg-status-goodBg border-status-good/20 text-status-good",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export const Alert = ({ children, type = 'info', title, className, ...props }) => {
  const icons = {
    info: <Info className="w-5 h-5 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  };

  return (
    <div className={cn(alertVariants({ type, className }))} {...props}>
      <div className="mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex flex-col gap-1">
        {title && <h4 className="font-bold tracking-tight">{title}</h4>}
        <div className="text-sm opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
