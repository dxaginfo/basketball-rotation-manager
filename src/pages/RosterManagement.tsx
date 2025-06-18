import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { fetchPlayers, addPlayer, updatePlayer, removePlayer } from '../store/slices/playersSlice';
import { setActiveView } from '../store/slices/uiSlice';
import { Player, Position, Skill } from '../types';

const EMPTY_PLAYER: Omit<Player, 'id'> = {
  name: '',
  number: 0,
  position: Position.PG,
  minutes: {
    target: 25,
    max: 32,
    consecutive: 8
  },
  skills: []
};

const RosterManagement: React.FC = () => {
  const dispatch = useDispatch();
  const players = useSelector((state: RootState) => state.players.items);
  const playersStatus = useSelector((state: RootState) => state.players.status);
  
  // Local state for player dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | Omit<Player, 'id'>>(EMPTY_PLAYER);
  
  // Fetch players data if not already loaded
  useEffect(() => {
    if (playersStatus === 'idle') {
      dispatch(fetchPlayers());
    }
    
    // Set active view
    dispatch(setActiveView('roster'));
  }, [dispatch, playersStatus]);
  
  const handleAddPlayer = () => {
    setIsEditing(false);
    setCurrentPlayer(EMPTY_PLAYER);
    setDialogOpen(true);
  };
  
  const handleEditPlayer = (player: Player) => {
    setIsEditing(true);
    setCurrentPlayer(player);
    setDialogOpen(true);
  };
  
  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm('Are you sure you want to remove this player from the roster?')) {
      dispatch(removePlayer(playerId));
    }
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleSavePlayer = () => {
    if (isEditing) {
      dispatch(updatePlayer(currentPlayer as Player));
    } else {
      dispatch(addPlayer(currentPlayer));
    }
    
    setDialogOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., minutes.target)
      const [parent, child] = name.split('.');
      setCurrentPlayer({
        ...currentPlayer,
        [parent]: {
          ...(currentPlayer as any)[parent],
          [child]: Number(value)
        }
      });
    } else {
      // Handle top-level properties
      setCurrentPlayer({
        ...currentPlayer,
        [name]: name === 'number' ? Number(value) : value
      });
    }
  };
  
  const handlePositionChange = (event: SelectChangeEvent<Position | Position[]>) => {
    setCurrentPlayer({
      ...currentPlayer,
      position: event.target.value as Position | Position[]
    });
  };
  
  const handleSkillsChange = (event: SelectChangeEvent<Skill[]>) => {
    const value = event.target.value;
    setCurrentPlayer({
      ...currentPlayer,
      skills: typeof value === 'string' ? [value as Skill] : value as Skill[]
    });
  };
  
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Roster</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPlayer}
        >
          Add Player
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="roster table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Target Minutes</TableCell>
              <TableCell>Max Minutes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="textSecondary" sx={{ py: 2 }}>
                    No players added yet. Click "Add Player" to build your roster.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.number}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    {Array.isArray(player.position) 
                      ? player.position.join(', ') 
                      : player.position
                    }
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {player.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{player.minutes.target}</TableCell>
                  <TableCell>{player.minutes.max}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleEditPlayer(player)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeletePlayer(player.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Player Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Player' : 'Add New Player'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="Player Name"
                type="text"
                fullWidth
                value={currentPlayer.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                id="number"
                name="number"
                label="Jersey Number"
                type="number"
                fullWidth
                value={currentPlayer.number}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="position-label">Position</InputLabel>
                <Select
                  labelId="position-label"
                  id="position"
                  value={currentPlayer.position}
                  onChange={handlePositionChange}
                  label="Position"
                  fullWidth
                >
                  {Object.values(Position).map((pos) => (
                    <MenuItem key={pos} value={pos}>
                      {pos}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="skills-label">Skills</InputLabel>
                <Select
                  labelId="skills-label"
                  id="skills"
                  multiple
                  value={currentPlayer.skills}
                  onChange={handleSkillsChange}
                  input={<OutlinedInput label="Skills" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as Skill[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(Skill).map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Minutes Management
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                id="minutes.target"
                name="minutes.target"
                label="Target Minutes"
                type="number"
                fullWidth
                value={currentPlayer.minutes.target}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 48 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                id="minutes.max"
                name="minutes.max"
                label="Max Minutes"
                type="number"
                fullWidth
                value={currentPlayer.minutes.max}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 48 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                id="minutes.consecutive"
                name="minutes.consecutive"
                label="Max Consecutive"
                type="number"
                fullWidth
                value={currentPlayer.minutes.consecutive}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 12 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSavePlayer} 
            variant="contained" 
            color="primary"
            disabled={!currentPlayer.name || currentPlayer.number === 0}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RosterManagement;