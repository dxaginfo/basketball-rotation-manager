import React, { useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../store';
import { fetchPlayers } from '../store/slices/playersSlice';
import { createNewRotation } from '../store/slices/rotationSlice';
import { setActiveView } from '../store/slices/uiSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const players = useSelector((state: RootState) => state.players.items);
  const rotations = useSelector((state: RootState) => state.rotation.saved);
  
  useEffect(() => {
    // Load player data when the dashboard mounts
    if (players.length === 0) {
      dispatch(fetchPlayers());
    }
    
    // Set active view
    dispatch(setActiveView('roster'));
  }, [dispatch, players.length]);
  
  const handleCreateRotation = () => {
    dispatch(createNewRotation());
    dispatch(setActiveView('rotation'));
    navigate('/rotation');
  };
  
  const handleEditRoster = () => {
    dispatch(setActiveView('roster'));
    navigate('/roster');
  };
  
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Team Overview Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Team Overview" />
            <Divider />
            <CardContent>
              <Typography variant="body1">
                {players.length} Players on Roster
              </Typography>
              <Typography variant="body1">
                {rotations.length} Saved Rotation Plans
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleEditRoster}
                  startIcon={<PersonIcon />}
                >
                  Manage Roster
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick Actions Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Quick Actions" />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCreateRotation}
                  startIcon={<TimelineIcon />}
                >
                  Create New Rotation
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/analytics')}
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Players Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Players" />
            <Divider />
            <CardContent>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {players.slice(0, 5).map((player) => (
                  <ListItem key={player.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={player.name} 
                      secondary={`#${player.number} - ${player.position}`} 
                    />
                  </ListItem>
                ))}
              </List>
              {players.length > 5 && (
                <Box sx={{ mt: 1 }}>
                  <Button 
                    variant="text" 
                    onClick={handleEditRoster}
                  >
                    View All Players
                  </Button>
                </Box>
              )}
              {players.length === 0 && (
                <Typography color="textSecondary">
                  No players added yet. Add players to your roster.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Rotations Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Rotations" />
            <Divider />
            <CardContent>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {rotations.slice(0, 5).map((rotation) => (
                  <ListItem key={rotation.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <TimelineIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={rotation.name} 
                      secondary={`Game ID: ${rotation.gameId.substring(0, 8)}...`} 
                    />
                  </ListItem>
                ))}
              </List>
              {rotations.length === 0 && (
                <Typography color="textSecondary">
                  No rotations created yet. Create your first rotation plan.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;