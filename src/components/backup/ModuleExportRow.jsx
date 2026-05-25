import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { FileText, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export const ModuleExportRow = ({ label, count, onExport, disabled }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-ui-border last:border-0 hover:bg-ui-surface transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-md">
          <FileText size={18} />
        </div>
        <div>
          <p className="font-medium text-text-primary text-sm">{label}</p>
          <p className="text-xs text-text-tertiary">{count} data</p>
        </div>
      </div>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onExport} 
        disabled={disabled}
        className="flex items-center gap-1.5"
      >
        <Download size={14} />
        <span className="hidden sm:inline">CSV</span>
      </Button>
    </div>
  );
};
