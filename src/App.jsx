import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { HistoryDetailPage } from './pages/HistoryDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OfflinePage } from './pages/OfflinePage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { SyncCenterPage } from './pages/SyncCenterPage';

import { IngredientsPage } from './pages/IngredientsPage';
import { IngredientFormPage } from './pages/IngredientFormPage';
import { IngredientDetailPage } from './pages/IngredientDetailPage';

import { RecipesPage } from './pages/RecipesPage';
import { RecipeFormPage } from './pages/RecipeFormPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';

import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

import { ChannelPricingPage } from './pages/channelPricing/ChannelPricingPage';
import { ChannelProfilesPage } from './pages/channelPricing/ChannelProfilesPage';
import { PricingSimulationsPage } from './pages/channelPricing/PricingSimulationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataBackupPage } from './pages/DataBackupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to welcome initially (MVP state) */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        
        {/* Welcome screen (doesn't use AppShell's sidebar) */}
        <Route path="/welcome" element={<WelcomePage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Main App Routes with Shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/calculator/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Phase 7 Routes */}
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/ingredients/new" element={<IngredientFormPage />} />
          <Route path="/ingredients/:id" element={<IngredientDetailPage />} />
          <Route path="/ingredients/:id/edit" element={<IngredientFormPage />} />
          
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/new" element={<RecipeFormPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
          
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Phase 8 Routes */}
          <Route path="/channel-pricing" element={<ChannelPricingPage />} />
          <Route path="/channel-profiles" element={<ChannelProfilesPage />} />
          <Route path="/simulations" element={<PricingSimulationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/data-backup" element={<DataBackupPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/sync" element={<SyncCenterPage />} />
          <Route path="/offline" element={<OfflinePage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
