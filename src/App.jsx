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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to welcome initially (MVP state) */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        
        {/* Welcome screen (doesn't use AppShell's sidebar) */}
        <Route path="/welcome" element={<WelcomePage />} />
        
        {/* Main App Routes with Shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/calculator/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
