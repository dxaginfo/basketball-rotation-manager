import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button,
  Box,
  useMediaQuery,
  Theme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../store';
import { saveRotation } from '../../store/slices/rotationSlice';

interface AppHeaderProps {
  onMenuToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRotation = useSelector((state: RootState) => state.rotation.current);
  const activeView = useSelector((state: RootState) => state.ui.activeView);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleSave = () => {
    if (currentRotation) {
      dispatch(saveRotation(currentRotation));
    }
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'roster':
        return 'Team Roster';
      case 'rotation':
        return currentRotation?.name || 'Rotation Builder';
      case 'analytics':
        return 'Analytics Dashboard';
      case 'settings':
        return 'Settings';
      default:
        return 'Basketball Rotation Manager';
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>
        
        {activeView === 'rotation' && (
          <Button 
            color="inherit" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            {isMobile ? '' : 'Save'}
          </Button>
        )}
        
        {!isMobile && (
          <Box sx={{ ml: 1 }}>
            <IconButton color="inherit" aria-label="share">
              <ShareIcon />
            </IconButton>
            
            <IconButton 
              color="inherit" 
              aria-label="settings"
              onClick={() => navigate('/settings')}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;