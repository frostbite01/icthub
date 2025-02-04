import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: '1', content: 'Check low stock items', completed: false },
    { id: '2', content: 'Update inventory counts', completed: true },
    { id: '3', content: 'Process new shipment', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items);
  };

  const handleToggle = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now().toString(), content: newTask, completed: false }
    ]);
    setNewTask('');
  };

  return (
    <Paper sx={{ 
      p: 3,
      maxWidth: 600,
      mx: 'auto',
      bgcolor: (theme) => theme.palette.background.paper,
    }}>
      <Typography variant="h6" gutterBottom>
        Inventory Tasks
      </Typography>
      
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Add
        </Button>
      </Stack>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: (theme) => 
                          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        '&:hover': {
                          bgcolor: (theme) => 
                            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
                        <DragIndicatorIcon color="action" />
                      </Box>
                      
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleToggle(task.id)}
                        sx={{ mr: 1 }}
                      />
                      
                      <Typography
                        sx={{
                          flex: 1,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.disabled' : 'text.primary',
                        }}
                      >
                        {task.content}
                      </Typography>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(task.id)}
                        sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" color="text.secondary">
        {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
      </Typography>
    </Paper>
  );
};

export default TaskList; 