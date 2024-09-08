import axios from 'axios';

const API_URL = '/api/tasks';


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
    throw error; 
  }
};


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
    throw error;
  }
};


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
    throw error; 
  }
};


const updateTask = async (id, taskData, token) => {
  try {
    const response = await axios.patch(`${API_URL}${id}`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

const updateTaskStatus = async (taskId, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${taskId}/status`, 
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error; 
  }
};




const taskService = {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  updateTaskStatus
};

export default taskService;
