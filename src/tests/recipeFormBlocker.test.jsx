// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastProvider } from '../components/ui/ToastProvider';
import { AppDataProvider } from '../contexts/AppDataContext';
import { RecipeFormPage } from '../pages/RecipeFormPage';

// Mock window matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock visualViewport
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

describe('RecipeFormPage Navigation Blocker & Draft flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should block navigation when form is dirty and show choice modal', async () => {
    const routes = [
      {
        path: '/',
        element: (
          <ToastProvider>
            <AppDataProvider>
              <Outlet />
            </AppDataProvider>
          </ToastProvider>
        ),
        children: [
          {
            path: 'recipes/new',
            element: <RecipeFormPage />
          },
          {
            path: 'other-page',
            element: <div>Other Page content</div>
          }
        ]
      }
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/recipes/new'],
    });

    render(<RouterProvider router={router} />);

    // 1. Initially, no blocker dialog
    expect(screen.queryByText('Simpan Resep sebagai Draft?')).toBeNull();

    // 2. Modify recipe name to make form dirty
    const nameInput = screen.getByLabelText(/Nama Resep/i);
    fireEvent.change(nameInput, { target: { value: 'Donat Ubi' } });

    // 3. Attempt navigation to another page programmatically
    router.navigate('/other-page');

    // 4. Modal should be displayed because blocker is triggered
    await waitFor(() => {
      expect(screen.getByText('Simpan Resep sebagai Draft?')).toBeInTheDocument();
    });

    // 5. Choose Batal to stay on the page
    const cancelBtn = screen.getByText('Batal');
    fireEvent.click(cancelBtn);

    // Verify we stayed on /recipes/new
    expect(router.state.location.pathname).toBe('/recipes/new');

    // 6. Attempt navigate again
    router.navigate('/other-page');
    await waitFor(() => {
      expect(screen.getByText('Simpan Resep sebagai Draft?')).toBeInTheDocument();
    });

    // 7. Choose Buang to discard changes and navigate away
    const discardBtn = screen.getByText('Buang');
    fireEvent.click(discardBtn);

    // Verify we successfully navigated to /other-page
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/other-page');
    });
  });
});
