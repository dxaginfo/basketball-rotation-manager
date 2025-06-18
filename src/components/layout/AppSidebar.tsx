import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Toolbar,
  Box,
  useMediaQuery,
  Theme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../store';
import { setActiveView } from '../../store/slices/uiSlice';

// Define sidebar width
const DRAWER_WIDTH = 240;

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeView = useSelector((state: RootState) => state.ui.activeView);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const handleNavigation = (path: string, view: 'roster' | 'rotation' | 'analytics' | 'settings') => {
    navigate(path);
    dispatch(setActiveView(view));
    
    if (isMobile) {
      onClose();
    }
  };
  
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/',
      view: 'roster' as const
    },
    { 
      text: 'Team Roster', 
      icon: <PeopleIcon />, 
      path: '/roster',
      view: 'roster' as const
    },
    { 
      text: 'Rotation Builder', 
      icon: <TimelineIcon />, 
      path: '/rotation',
      view: 'rotation' as const
    },
    { 
      text: 'Analytics', 
      icon: <InsightsIcon />, 
      path: '/analytics',
      view: 'analytics' as const
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings',
      view: 'settings' as const
    }
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={activeView === item.view}
              onClick={() => handleNavigation(item.path, item.view)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer - temporary */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH 
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        /* Desktop drawer - persistent */
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH 
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default AppSidebar;