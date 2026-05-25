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
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Upload size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-text-primary">
            {t('importBackup', 'Import Backup')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('importBackupDesc', 'Kembalikan data dari file backup JSON.')}
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-ui-border rounded-xl p-8 text-center bg-ui-surface">
        <input 
          type="file"
          accept=".json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload size={32} className="mx-auto text-text-tertiary mb-3" />
        <p className="text-text-secondary mb-4 text-sm">
          {t('importFileHint', 'Pilih file .json hasil export Modalin')}
        </p>
        <Button 
          variant="secondary" 
          onClick={() => fileInputRef.current?.click()}
        >
          {t('selectFile', 'Pilih File')}
        </Button>
      </div>
    </Card>
  );
};
