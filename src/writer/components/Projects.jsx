import React, { useState, useContext, useEffect } from 'react';
import { Button, Menu, MenuItem, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AppContext } from "./AppContext";
import { useAppContext } from '../../AppProvider';
const ProjectsSection = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const {
    setFilesObj, setProjects, setCurrentProject, setError, email, projects, currentProject, isAuthenticated
  } = useContext(AppContext);


  const { backendUrl } = useAppContext();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    handleMenuClose();
  };

  const handleCreateProjectOpen = () => {
    setDialogOpen(true);
  };

  const handleCreateProjectClose = () => {
    setDialogOpen(false);
    setNewProjectName('');
  };

  const handleCreateProject = async () => {
    const payload = {
      username: email,
      project: newProjectName,
    }
    try {
      const response = await fetch('/api/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data['project_list']);
        setCurrentProject(newProjectName.trim());
        handleCreateProjectClose();
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("fetching projects" + email);
      try {
        const response = await fetch('/api/get-projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const projectArray = data.projects.map(project => project.project);
        setFilesObj(data.projects);
        setProjects(projectArray);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProjects();
  }, [email]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Dropdown Button to Select Project */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleMenuOpen}
          disabled={!isAuthenticated}
          style={!isAuthenticated ? { color: '#9e9e9e', borderColor: '#9e9e9e' } : {}}
        >
          {currentProject || 'Select Project'}
        </Button>

        {/* Menu for Project Options */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted
        >
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <MenuItem key={index} onClick={() => handleProjectSelect(project)} disabled={!isAuthenticated}>
                {project}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Projects Available</MenuItem>
          )}
        </Menu>
      </div>

      {/* Create Project Button with Tooltip */}
      <Tooltip title={isAuthenticated ? "Create Project" : "Log in to create a project"} arrow>
        <span>
          <IconButton
            onClick={handleCreateProjectOpen}
            disabled={!isAuthenticated}
            style={!isAuthenticated ? { color: '#9e9e9e' } : {}}
          >
            <AddIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* Dialog for Creating a New Project */}
      <Dialog open={isDialogOpen} onClose={handleCreateProjectClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateProjectClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateProject} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectsSection;
