import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer className="flex items-center justify-center min-h-[70vh]">
      <EmptyState 
        title="Halaman tidak ditemukan"
        description="Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan."
        action={
          <div className="flex gap-3">
            <Button onClick={() => navigate('/dashboard')}>
              Ke Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigate('/calculator')}>
              Hitung HPP
            </Button>
          </div>
        }
      />
    </PageContainer>
  );
};
