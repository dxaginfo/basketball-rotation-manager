import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';
import Dashboard from './pages/Dashboard';
import RosterManagement from './pages/RosterManagement';
import RotationBuilder from './pages/RotationBuilder';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      <AppSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          mt: 8,
          overflow: 'auto'
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roster" element={<RosterManagement />} />
          <Route path="/rotation" element={<RotationBuilder />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;