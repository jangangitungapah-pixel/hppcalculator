// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/ToastProvider';
import { AppDataProvider } from '../contexts/AppDataContext';
import { CalculatorPage } from '../pages/CalculatorPage';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query.includes('1024px'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'visualViewport', {
  configurable: true,
  get() {
    return {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      width: 1024,
      height: 768,
      scale: 1
    };
  }
});

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

const renderCalculator = () => render(
  <BrowserRouter>
    <ToastProvider>
      <AppDataProvider>
        <CalculatorPage />
      </AppDataProvider>
    </ToastProvider>
  </BrowserRouter>
);

describe('CalculatorPage validation flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders validation messages instead of crashing on an empty calculation', () => {
    renderCalculator();

    const calculateButton = screen.getAllByText('Hitung Sekarang')[0].closest('button');
    fireEvent.click(calculateButton);

    expect(screen.getByText('Ada yang belum lengkap')).toBeInTheDocument();
    expect(screen.getAllByText('Nama produk wajib diisi.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Total biaya produksi tidak boleh 0.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Jumlah hasil harus lebih dari 0.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Harga jual harus lebih dari 0.').length).toBeGreaterThan(0);
  });
});
