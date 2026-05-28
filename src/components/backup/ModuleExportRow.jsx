import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { FileText, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export const ModuleExportRow = ({ label, count, onExport, disabled }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border-soft last:border-0 hover:bg-surface-cream transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-brand-soft text-brand-primary rounded-lg shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-text-primary text-xs sm:text-sm">{label}</p>
          <p className="text-[11px] font-semibold text-text-secondary mt-0.5">{count} data</p>
        </div>
      </div>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onExport} 
        disabled={disabled}
        className="h-8 text-xs font-bold border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-lg px-2.5 flex items-center gap-1 transition-all"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">CSV</span>
      </Button>
    </div>
  );
};
