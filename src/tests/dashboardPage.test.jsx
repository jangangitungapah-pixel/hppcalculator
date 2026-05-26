// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/ToastProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { AppDataProvider } from '../contexts/AppDataContext';
import { SyncProvider } from '../contexts/SyncContext';
import { DashboardPage } from '../pages/DashboardPage';

// Mock window matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock visualViewport for Framer Motion compatibility in JSDOM (using prototype getter override)
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

// Mock localStorage
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


// Mock usePwa hook
vi.mock('../hooks/usePwa', () => ({
  usePwa: () => ({
    isInstalled: false,
    canInstall: false,
    showBanner: false,
    updateAvailable: false,
    promptInstall: vi.fn(),
    applyUpdate: vi.fn(),
    dismissInstallPrompt: vi.fn()
  })
}));

describe('DashboardPage Integration', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('renders empty state and transitions on demo data load', async () => {
    const { container } = render(
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppDataProvider>
              <SyncProvider>
                <DashboardPage />
              </SyncProvider>
            </AppDataProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    // Should render empty state message
    expect(screen.getByText('Mulai dari produk pertamamu')).toBeInTheDocument();

    // Click "Coba Data Demo"
    const demoButton = screen.getByText('Coba Data Demo');
    expect(demoButton).toBeInTheDocument();
    
    // Trigger click
    fireEvent.click(demoButton);

    // Verify it doesn't crash and switches to data state
    expect(screen.queryByText('Mulai dari produk pertamamu')).toBeNull();
    expect(screen.getByText('Business Pulse')).toBeInTheDocument();
  });
});
