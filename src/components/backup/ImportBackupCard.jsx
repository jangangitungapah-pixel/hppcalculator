import React, { useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';

export const ImportBackupCard = ({ onFilePreview }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFilePreview(file);
      // Reset input so the same file can be picked again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-border/80 rounded-3xl shadow-xs">
      <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-border-soft">
        <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl shrink-0 flex items-center justify-center">
          <Upload className="w-5.5 h-5.5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-text-primary">
            {t('dataBackup.importBackup', 'Import Backup')}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-0.5 leading-relaxed">
            {t('dataBackup.importBackupDesc', 'Kembalikan data dari file backup JSON.')}
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-border-soft hover:border-brand-primary/40 rounded-2xl p-8 text-center bg-surface-cream/50 transition-all duration-200 group/dropzone">
        <input 
          type="file"
          accept=".json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload className="w-8 h-8 mx-auto text-text-secondary mb-3 group-hover/dropzone:text-brand-primary transition-colors" />
        <p className="text-text-secondary mb-4 text-xs font-semibold leading-relaxed">
          {t('dataBackup.importFileHint', 'Pilih file .json hasil export Modalin')}
        </p>
        <Button 
          variant="secondary" 
          onClick={() => fileInputRef.current?.click()}
          className="h-10 px-4 border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl text-xs font-bold transition-all"
        >
          {t('dataBackup.selectFile', 'Pilih File')}
        </Button>
      </div>
    </Card>
  );
};
