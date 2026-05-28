import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

const WelcomePage = React.lazy(() => import('./pages/WelcomePage').then(module => ({ default: module.WelcomePage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const CalculatorPage = React.lazy(() => import('./pages/CalculatorPage').then(module => ({ default: module.CalculatorPage })));
const ResultPage = React.lazy(() => import('./pages/ResultPage').then(module => ({ default: module.ResultPage })));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage').then(module => ({ default: module.HistoryPage })));
const HistoryDetailPage = React.lazy(() => import('./pages/HistoryDetailPage').then(module => ({ default: module.HistoryDetailPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const OfflinePage = React.lazy(() => import('./pages/OfflinePage').then(module => ({ default: module.OfflinePage })));

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const AccountPage = React.lazy(() => import('./pages/AccountPage').then(module => ({ default: module.AccountPage })));
const SyncCenterPage = React.lazy(() => import('./pages/SyncCenterPage').then(module => ({ default: module.SyncCenterPage })));
const MorePage = React.lazy(() => import('./pages/MorePage').then(module => ({ default: module.MorePage })));

const IngredientsPage = React.lazy(() => import('./pages/IngredientsPage').then(module => ({ default: module.IngredientsPage })));
const IngredientFormPage = React.lazy(() => import('./pages/IngredientFormPage').then(module => ({ default: module.IngredientFormPage })));
const IngredientDetailPage = React.lazy(() => import('./pages/IngredientDetailPage').then(module => ({ default: module.IngredientDetailPage })));
const InventoryPage = React.lazy(() => import('./pages/InventoryPage').then(module => ({ default: module.InventoryPage })));

const RecipesPage = React.lazy(() => import('./pages/RecipesPage').then(module => ({ default: module.RecipesPage })));
const RecipeFormPage = React.lazy(() => import('./pages/RecipeFormPage').then(module => ({ default: module.RecipeFormPage })));
const RecipeDetailPage = React.lazy(() => import('./pages/RecipeDetailPage').then(module => ({ default: module.RecipeDetailPage })));

const ProductsPage = React.lazy(() => import('./pages/ProductsPage').then(module => ({ default: module.ProductsPage })));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));

const ChannelPricingPage = React.lazy(() => import('./pages/channelPricing/ChannelPricingPage').then(module => ({ default: module.ChannelPricingPage })));
const ChannelProfilesPage = React.lazy(() => import('./pages/channelPricing/ChannelProfilesPage').then(module => ({ default: module.ChannelProfilesPage })));
const PricingSimulationsPage = React.lazy(() => import('./pages/channelPricing/PricingSimulationsPage').then(module => ({ default: module.PricingSimulationsPage })));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage').then(module => ({ default: module.ReportsPage })));
const DataBackupPage = React.lazy(() => import('./pages/DataBackupPage').then(module => ({ default: module.DataBackupPage })));

const businessStoragePattern = /^modalin:v1:(guest|user:[^:]+):(calculations|ingredients|recipes|products|channelProfiles|pricingSimulations|bundleSimulations|inventorySettings|stockMovements)$/;
const legacyBusinessStoragePattern = /^modalin:v1:(calculations|ingredients|recipes|products|channelProfiles|pricingSimulations|bundleSimulations|inventorySettings|stockMovements)$/;

const hasReturningUserData = () => {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || (!businessStoragePattern.test(key) && !legacyBusinessStoragePattern.test(key))) continue;

      const value = JSON.parse(window.localStorage.getItem(key) || '[]');
      if (Array.isArray(value) && value.length > 0) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
};

const RootRedirect = () => (
  <Navigate to={hasReturningUserData() ? '/dashboard' : '/welcome'} replace />
);

const RouteFallback = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center text-sm font-semibold text-text-secondary">
    Memuat...
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootRedirect />} />
      
      {/* Welcome screen (doesn't use AppShell's sidebar) */}
      <Route path="/welcome" element={<Suspense fallback={<RouteFallback />}><WelcomePage /></Suspense>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Suspense fallback={<RouteFallback />}><LoginPage /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={<RouteFallback />}><RegisterPage /></Suspense>} />
      <Route path="/forgot-password" element={<Suspense fallback={<RouteFallback />}><ForgotPasswordPage /></Suspense>} />
      
      {/* Main App Routes with Shell */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Suspense fallback={<RouteFallback />}><DashboardPage /></Suspense>} />
        <Route path="/calculator" element={<Suspense fallback={<RouteFallback />}><CalculatorPage /></Suspense>} />
        <Route path="/calculator/result" element={<Suspense fallback={<RouteFallback />}><ResultPage /></Suspense>} />
        <Route path="/history" element={<Suspense fallback={<RouteFallback />}><HistoryPage /></Suspense>} />
        <Route path="/history/:id" element={<Suspense fallback={<RouteFallback />}><HistoryDetailPage /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<RouteFallback />}><SettingsPage /></Suspense>} />
        
        {/* Phase 7 Routes */}
        <Route path="/ingredients" element={<Suspense fallback={<RouteFallback />}><IngredientsPage /></Suspense>} />
        <Route path="/ingredients/new" element={<Suspense fallback={<RouteFallback />}><IngredientFormPage /></Suspense>} />
        <Route path="/ingredients/:id" element={<Suspense fallback={<RouteFallback />}><IngredientDetailPage /></Suspense>} />
        <Route path="/ingredients/:id/edit" element={<Suspense fallback={<RouteFallback />}><IngredientFormPage /></Suspense>} />
        <Route path="/inventory" element={<Suspense fallback={<RouteFallback />}><InventoryPage /></Suspense>} />
        
        <Route path="/recipes" element={<Suspense fallback={<RouteFallback />}><RecipesPage /></Suspense>} />
        <Route path="/recipes/new" element={<Suspense fallback={<RouteFallback />}><RecipeFormPage /></Suspense>} />
        <Route path="/recipes/:id" element={<Suspense fallback={<RouteFallback />}><RecipeDetailPage /></Suspense>} />
        <Route path="/recipes/:id/edit" element={<Suspense fallback={<RouteFallback />}><RecipeFormPage /></Suspense>} />
        
        <Route path="/products" element={<Suspense fallback={<RouteFallback />}><ProductsPage /></Suspense>} />
        <Route path="/products/:id" element={<Suspense fallback={<RouteFallback />}><ProductDetailPage /></Suspense>} />

        {/* Phase 8 Routes */}
        <Route path="/channel-pricing" element={<Suspense fallback={<RouteFallback />}><ChannelPricingPage /></Suspense>} />
        <Route path="/channel-profiles" element={<Suspense fallback={<RouteFallback />}><ChannelProfilesPage /></Suspense>} />
        <Route path="/simulations" element={<Suspense fallback={<RouteFallback />}><PricingSimulationsPage /></Suspense>} />
        <Route path="/reports" element={<Suspense fallback={<RouteFallback />}><ReportsPage /></Suspense>} />
        <Route path="/data-backup" element={<Suspense fallback={<RouteFallback />}><DataBackupPage /></Suspense>} />
        <Route path="/account" element={<Suspense fallback={<RouteFallback />}><AccountPage /></Suspense>} />
        <Route path="/sync" element={<Suspense fallback={<RouteFallback />}><SyncCenterPage /></Suspense>} />
        <Route path="/more" element={<Suspense fallback={<RouteFallback />}><MorePage /></Suspense>} />
        <Route path="/offline" element={<Suspense fallback={<RouteFallback />}><OfflinePage /></Suspense>} />

        <Route path="*" element={<Suspense fallback={<RouteFallback />}><NotFoundPage /></Suspense>} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
