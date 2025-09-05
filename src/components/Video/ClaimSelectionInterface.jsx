import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Chip,
  Tooltip,
  Fade,
  Collapse,
  Alert,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PlayArrow as PlayArrowIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../AppProvider';

const ClaimSelectionInterface = ({ 
  claims, 
  onClaimsUpdate, 
  onStartFactCheck, 
  userCredits,
  isVisible = true 
}) => {
  const [selectedClaims, setSelectedClaims] = useState(new Set(claims.map((_, index) => index)));
  const [editingClaim, setEditingClaim] = useState(null);
  const [editText, setEditText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const { setQueries } = useAppContext();
  
  // History system for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentClaims, setCurrentClaims] = useState(claims);

  // Initialize current claims when props change
  React.useEffect(() => {
    setCurrentClaims(claims);
    // Reset history when new claims come in
    if (history.length === 0) {
      setHistory([{
        type: 'initial',
        claims: claims,
        selectedClaims: new Set(claims.map((_, index) => index)),
        description: 'Ready'
      }]);
      setHistoryIndex(0);
    }
  }, [claims]);

  const selectedCount = selectedClaims.size;
  const requiredCredits = selectedCount * 5;
  const canAfford = userCredits >= requiredCredits;

  // Add action to history
  const addToHistory = (action) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      ...action,
      timestamp: Date.now()
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setCurrentClaims(previousState.claims);
      setSelectedClaims(new Set(previousState.selectedClaims));
      onClaimsUpdate(previousState.claims);
      setHistoryIndex(historyIndex - 1);
      setEditingClaim(null); // Cancel any ongoing edits
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setCurrentClaims(nextState.claims);
      setSelectedClaims(new Set(nextState.selectedClaims));
      onClaimsUpdate(nextState.claims);
      setHistoryIndex(historyIndex + 1);
      setEditingClaim(null); // Cancel any ongoing edits
    }
  };

  const handleSelectAll = () => {
    const newSelected = selectedClaims.size === currentClaims.length 
      ? new Set() 
      : new Set(currentClaims.map((_, index) => index));
    
    setSelectedClaims(newSelected);
    
    addToHistory({
      type: 'selection',
      claims: currentClaims,
      selectedClaims: newSelected,
      description: newSelected.size === 0 ? 'Deselected all claims' : 'Selected all claims'
    });
  };

  const handleClaimSelect = (index) => {
    const newSelected = new Set(selectedClaims);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedClaims(newSelected);
    
    addToHistory({
      type: 'selection',
      claims: currentClaims,
      selectedClaims: newSelected,
      description: `${newSelected.has(index) ? 'Selected' : 'Deselected'} claim ${index + 1}`
    });
  };

  const handleEditStart = (index, currentText) => {
    setEditingClaim(index);
    setEditText(currentText);
  };

  const handleEditSave = () => {
    if (editText.trim() && editingClaim !== null) {
      const updatedClaims = [...currentClaims];
      const oldText = updatedClaims[editingClaim];
      updatedClaims[editingClaim] = editText.trim();
      
      setCurrentClaims(updatedClaims);
      onClaimsUpdate(updatedClaims);
      
      addToHistory({
        type: 'edit',
        claims: updatedClaims,
        selectedClaims: selectedClaims,
        description: `Edited claim ${editingClaim + 1}`,
        oldText: oldText,
        newText: editText.trim(),
        claimIndex: editingClaim
      });
      
      setEditingClaim(null);
      setEditText('');
    }
  };

  const handleEditCancel = () => {
    setEditingClaim(null);
    setEditText('');
  };

  const handleDelete = (index) => {
    const claimToDelete = currentClaims[index];
    const wasSelected = selectedClaims.has(index);
    
    // Remove the claim
    const updatedClaims = currentClaims.filter((_, i) => i !== index);
    setCurrentClaims(updatedClaims);
    onClaimsUpdate(updatedClaims);
    
    // Update selected claims indices
    const newSelected = new Set();
    selectedClaims.forEach(selectedIndex => {
      if (selectedIndex < index) {
        newSelected.add(selectedIndex);
      } else if (selectedIndex > index) {
        newSelected.add(selectedIndex - 1);
      }
    });
    setSelectedClaims(newSelected);
    
    addToHistory({
      type: 'delete',
      claims: updatedClaims,
      selectedClaims: newSelected,
      description: `Deleted claim ${index + 1}`,
      deletedClaim: claimToDelete,
      deletedIndex: index,
      wasSelected: wasSelected
    });
  };

  const handleStartFactCheck = () => {
    const selectedClaimTexts = Array.from(selectedClaims).map(index => currentClaims[index]);
    onStartFactCheck(selectedClaimTexts);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const currentAction = historyIndex >= 0 ? history[historyIndex] : null;

  if (!isVisible || currentClaims.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 2, 
          border: '2px solid #e3f2fd',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header Section */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              p: 1.5,
              borderBottom: '1px solid #e0e0e0'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1rem' }}>
                  Select Claims to Fact-Check
                </Typography>
                <Chip 
                  label={`${currentClaims.length} claims found`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 22 }}
                />
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Tooltip title={canUndo ? `Undo: ${history[historyIndex - 1]?.description}` : 'Nothing to undo'}>
                  <span>
                    <IconButton 
                      size="small" 
                      onClick={handleUndo} 
                      disabled={!canUndo}
                      sx={{ 
                        color: canUndo ? '#1976d2' : '#ccc',
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: canUndo ? 'rgba(25, 118, 210, 0.1)' : 'transparent'
                        }
                      }}
                    >
                      <UndoIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                
                <Tooltip title={canRedo ? `Redo: ${history[historyIndex + 1]?.description}` : 'Nothing to redo'}>
                  <span>
                    <IconButton 
                      size="small" 
                      onClick={handleRedo} 
                      disabled={!canRedo}
                      sx={{ 
                        color: canRedo ? '#1976d2' : '#ccc',
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: canRedo ? 'rgba(25, 118, 210, 0.1)' : 'transparent'
                        }
                      }}
                    >
                      <RedoIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                
                <IconButton 
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{ color: '#1976d2', p: 0.5 }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={isExpanded}>
              <Box>
                {/* Action Bar */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleSelectAll}
                      startIcon={selectedClaims.size === currentClaims.length ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                      sx={{ 
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1,
                        '&:hover': {
                          borderColor: '#1565c0',
                          backgroundColor: 'rgba(25, 118, 210, 0.1)'
                        }
                      }}
                    >
                      {selectedClaims.size === currentClaims.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {selectedCount} of {currentClaims.length} selected
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Chip 
                      label={`${requiredCredits} credits needed`}
                      size="small"
                      color={canAfford ? "success" : "error"}
                      variant="filled"
                      sx={{ fontSize: '0.7rem', height: 22 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      You have {userCredits} credits
                    </Typography>
                  </Box>
                </Box>

                {/* Start Fact Check Button */}
                <Box display="flex" justifyContent="center" mb={!canAfford && selectedCount > 0 ? 0.5 : 0}>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleStartFactCheck}
                    disabled={selectedCount === 0 || !canAfford}
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                      '&:disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                  >
                    Start Fact-Checking ({selectedCount} claims)
                  </Button>
                </Box>

                {!canAfford && selectedCount > 0 && (
                  <Alert severity="warning" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                    You need {requiredCredits - userCredits} more credits to fact-check the selected claims.
                  </Alert>
                )}
              </Box>
            </Collapse>
          </Box>

          {/* Claims List */}
          <Collapse in={isExpanded}>
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <AnimatePresence>
                {currentClaims.map((claim, index) => (
                  <motion.div
                    key={`${claim}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: '1px solid #f0f0f0',
                        backgroundColor: selectedClaims.has(index) ? '#f8f9ff' : 'white',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: selectedClaims.has(index) ? '#f0f4ff' : '#fafafa'
                        }
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        {/* Selection Checkbox */}
                        <Checkbox
                          checked={selectedClaims.has(index)}
                          onChange={() => handleClaimSelect(index)}
                          sx={{ 
                            mt: -0.5,
                            color: '#1976d2',
                            '&.Mui-checked': {
                              color: '#1976d2'
                            }
                          }}
                        />

                        {/* Claim Content */}
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="caption" color="primary" fontWeight={600}>
                              Claim {index + 1}
                            </Typography>
                            <Chip 
                              label="5 credits"
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          </Box>

                          {editingClaim === index ? (
                            <Box>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{ mb: 1 }}
                                autoFocus
                              />
                              <Box display="flex" gap={1}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={handleEditSave}
                                  startIcon={<SaveIcon />}
                                  disabled={!editText.trim()}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={handleEditCancel}
                                  startIcon={<CancelIcon />}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                lineHeight: 1.5,
                                color: selectedClaims.has(index) ? '#1976d2' : 'text.primary',
                                fontWeight: selectedClaims.has(index) ? 500 : 400
                              }}
                            >
                              {claim}
                            </Typography>
                          )}
                        </Box>

                        {/* Action Buttons */}
                        {editingClaim !== index && (
                          <Box display="flex" gap={0.5}>
                            <Tooltip title="Edit claim">
                              <IconButton
                                size="small"
                                onClick={() => handleEditStart(index, claim)}
                                sx={{ 
                                  color: '#666',
                                  '&:hover': { color: '#1976d2' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete claim">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(index)}
                                sx={{ 
                                  color: '#666',
                                  '&:hover': { color: '#d32f2f' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClaimSelectionInterface; 