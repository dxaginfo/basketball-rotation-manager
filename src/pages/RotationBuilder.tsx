import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Divider,
  Tab,
  Tabs,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { setActiveView } from '../store/slices/uiSlice';
import { Player } from '../types';

// Custom interfaces for the component
interface TimelineSettings {
  periods: number;
  periodLength: number; // in minutes
  timelineWidth: number; // in pixels
}

const RotationBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players.items);
  const currentRotation = useSelector((state: RootState) => state.rotation.current);
  
  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>({
    periods: 4,
    periodLength: 12, // 12-minute quarters
    timelineWidth: 800
  });
  const [rotationName, setRotationName] = useState(currentRotation?.name || 'New Rotation');
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);
  
  // Set the active view on component mount
  useEffect(() => {
    dispatch(setActiveView('rotation'));
    
    // Initialize available players from the roster
    setAvailablePlayers(players);
  }, [dispatch, players]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Assign a player to the rotation
  const handleAssignPlayer = (player: Player) => {
    setAssignedPlayers([...assignedPlayers, player]);
    setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
  };
  
  // Remove a player from the rotation
  const handleRemovePlayer = (player: Player) => {
    setAssignedPlayers(assignedPlayers.filter(p => p.id !== player.id));
    setAvailablePlayers([...availablePlayers, player]);
  };
  
  // Generate time labels for the timeline
  const generateTimeLabels = () => {
    const labels = [];
    const totalMinutes = timelineSettings.periods * timelineSettings.periodLength;
    
    for (let i = 0; i <= totalMinutes; i += 4) {
      const period = Math.floor(i / timelineSettings.periodLength) + 1;
      const periodTime = i % timelineSettings.periodLength;
      
      labels.push(
        <Box 
          key={i} 
          sx={{ 
            position: 'absolute', 
            left: `${(i / totalMinutes) * 100}%`,
            transform: 'translateX(-50%)',
            top: -25,
            fontSize: '0.75rem',
            color: 'text.secondary'
          }}
        >
          {period <= timelineSettings.periods ? `Q${period} ${periodTime}:00` : ''}
        </Box>
      );
    }
    
    return labels;
  };
  
  // Render the timeline grid with period separators
  const renderTimelineGrid = () => {
    const gridLines = [];
    const totalMinutes = timelineSettings.periods * timelineSettings.periodLength;
    
    // Add period separator lines
    for (let i = 0; i <= totalMinutes; i += timelineSettings.periodLength) {
      gridLines.push(
        <Box 
          key={`period-${i}`}
          sx={{ 
            position: 'absolute', 
            left: `${(i / totalMinutes) * 100}%`,
            height: '100%',
            width: 2,
            bgcolor: 'primary.main',
            zIndex: 1
          }}
        />
      );
    }
    
    // Add minute marker lines
    for (let i = 0; i <= totalMinutes; i += 1) {
      if (i % timelineSettings.periodLength !== 0) { // Skip period lines
        gridLines.push(
          <Box 
            key={`minute-${i}`}
            sx={{ 
              position: 'absolute', 
              left: `${(i / totalMinutes) * 100}%`,
              height: '100%',
              width: i % 4 === 0 ? 1 : 0.5,
              bgcolor: i % 4 === 0 ? 'grey.400' : 'grey.300',
              zIndex: 0
            }}
          />
        );
      }
    }
    
    return gridLines;
  };
  
  // Placeholder for rendering player timeline rows
  const renderPlayerTimelineRows = () => {
    return assignedPlayers.map((player, index) => (
      <Box 
        key={player.id}
        sx={{ 
          height: 40,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: index % 2 === 0 ? 'grey.100' : 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.300'
        }}
      >
        <Box sx={{ width: 120, borderRight: '1px solid', borderColor: 'grey.300', p: 1 }}>
          <Typography variant="body2" noWrap>
            {player.number} - {player.name}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative', height: '100%' }}>
          {/* Placeholder for player segments - will be implemented in future */}
          <Box sx={{ 
            position: 'absolute', 
            left: '10%', 
            width: '30%', 
            height: '80%', 
            top: '10%',
            bgcolor: 'primary.light',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" sx={{ color: 'white' }}>Q1-Q2</Typography>
          </Box>
        </Box>
      </Box>
    ));
  };
  
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4">Rotation Builder</Typography>
          <TextField
            value={rotationName}
            onChange={(e) => setRotationName(e.target.value)}
            variant="standard"
            sx={{ mt: 1 }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ mr: 1 }}
          >
            Save Rotation
          </Button>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
          >
            View Analytics
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {/* Left sidebar - Player selection */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Player Selection
            </Typography>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              sx={{ mb: 2 }}
            >
              <Tab label="Available" />
              <Tab label="Assigned" />
            </Tabs>
            
            {activeTab === 0 ? (
              /* Available Players */
              <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                {availablePlayers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    All players have been assigned
                  </Typography>
                ) : (
                  availablePlayers.map((player) => (
                    <ListItem 
                      key={player.id}
                      secondaryAction={
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleAssignPlayer(player)}
                        >
                          Add
                        </Button>
                      }
                    >
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
                  ))
                )}
              </List>
            ) : (
              /* Assigned Players */
              <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                {assignedPlayers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    No players assigned yet
                  </Typography>
                ) : (
                  assignedPlayers.map((player) => (
                    <ListItem 
                      key={player.id}
                      secondaryAction={
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleRemovePlayer(player)}
                        >
                          Remove
                        </Button>
                      }
                    >
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
                  ))
                )}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Main content - Rotation Timeline */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rotation Timeline
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Drag players from the sidebar to the timeline to create rotation segments
            </Alert>
            
            {/* Timeline header with time markers */}
            <Box sx={{ position: 'relative', height: 30, mb: 1, mt: 4 }}>
              {generateTimeLabels()}
            </Box>
            
            {/* Timeline container */}
            <Box sx={{ 
              border: '1px solid', 
              borderColor: 'grey.300', 
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Grid lines */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {renderTimelineGrid()}
              </Box>
              
              {/* Player rows */}
              {assignedPlayers.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Add players to the rotation to start building your timeline
                  </Typography>
                </Box>
              ) : (
                renderPlayerTimelineRows()
              )}
            </Box>
            
            {/* Timeline legend */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Chip 
                label="On Court" 
                sx={{ bgcolor: 'primary.light', color: 'white' }} 
              />
              <Chip 
                label="Off Court" 
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RotationBuilder;