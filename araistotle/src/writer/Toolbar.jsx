// src/Toolbar.js
import React from 'react';
import { Box, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

function Toolbar({ onCommand, fontSize, setFontSize, fontName, setFontName, fontColor, setFontColor, highlightColor, setHighlightColor }) {
  
  const handleCommand = (command, value = null) => {
    onCommand(command, value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {/* Text Formatting */}
      <Tooltip title="Bold">
        <IconButton onClick={() => handleCommand('bold')}>
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton onClick={() => handleCommand('italic')}>
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton onClick={() => handleCommand('underline')}>
          <FormatUnderlinedIcon />
        </IconButton>
      </Tooltip>

      {/* Text Alignment */}
      <Tooltip title="Align Left">
        <IconButton onClick={() => handleCommand('justifyLeft')}>
          <FormatAlignLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Center">
        <IconButton onClick={() => handleCommand('justifyCenter')}>
          <FormatAlignCenterIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Right">
        <IconButton onClick={() => handleCommand('justifyRight')}>
          <FormatAlignRightIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Justify">
        <IconButton onClick={() => handleCommand('justifyFull')}>
          <FormatAlignJustifyIcon />
        </IconButton>
      </Tooltip>

      {/* Lists */}
      <Tooltip title="Bulleted List">
        <IconButton onClick={() => handleCommand('insertUnorderedList')}>
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton onClick={() => handleCommand('insertOrderedList')}>
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>

      {/* Undo/Redo */}
      <Tooltip title="Undo">
        <IconButton onClick={() => handleCommand('undo')}>
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton onClick={() => handleCommand('redo')}>
          <RedoIcon />
        </IconButton>
      </Tooltip>

      {/* Font Size */}
      <FormControl sx={{ minWidth: 100 }}>
        <InputLabel id="font-size-select-label">Font Size</InputLabel>
        <Select
          labelId="font-size-select-label"
          value={fontSize}
          label="Font Size"
          onChange={(e) => {
            setFontSize(e.target.value);
            handleCommand('fontSize', e.target.value);
          }}
        >
          <MenuItem value="1">8pt</MenuItem>
          <MenuItem value="2">10pt</MenuItem>
          <MenuItem value="3">12pt</MenuItem>
          <MenuItem value="4">14pt</MenuItem>
          <MenuItem value="5">18pt</MenuItem>
          <MenuItem value="6">24pt</MenuItem>
          <MenuItem value="7">32pt</MenuItem>
        </Select>
      </FormControl>

      {/* Font Family */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="font-family-select-label">Font</InputLabel>
        <Select
          labelId="font-family-select-label"
          value={fontName}
          label="Font"
          onChange={(e) => {
            setFontName(e.target.value);
            handleCommand('fontName', e.target.value);
          }}
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Verdana">Verdana</MenuItem>
          <MenuItem value="Georgia">Georgia</MenuItem>
          <MenuItem value="Tahoma">Tahoma</MenuItem>
        </Select>
      </FormControl>

      {/* Text Color */}
      <Tooltip title="Text Color">
        <TextField
          type="color"
          value={fontColor}
          onChange={(e) => {
            setFontColor(e.target.value);
            handleCommand('foreColor', e.target.value);
          }}
          sx={{ width: 50, padding: 0 }}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Tooltip>

      {/* Highlight Color */}
      <Tooltip title="Highlight Color">
        <TextField
          type="color"
          value={highlightColor}
          onChange={(e) => {
            setHighlightColor(e.target.value);
            handleCommand('hiliteColor', e.target.value);
          }}
          sx={{ width: 50, padding: 0 }}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Tooltip>
    </Box>
  );
}

export default Toolbar;
