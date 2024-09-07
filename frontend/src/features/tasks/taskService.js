import axios from 'axios';

const API_URL = 'http://localhost:8000/api/tasks/'; // Update base URL to the tasks endpoint

// Create a new task
const createTask = async (taskData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(API_URL, taskData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Get all tasks
const getTasks = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Delete a task
const deleteTask = async (taskId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(`${API_URL}${taskId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

// Update a task
const updateTask = async (id, taskData, token) => {
  try {
    const response = await axios.patch(`${API_URL}${id}`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error; // Re-throw to let the caller handle it
  }
};

const taskService = {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
};

export default taskService;
