import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/tasks/taskSlice';
import PropTypes from 'prop-types';

function TaskItem({ task }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description || '');
  const [error, setError] = useState(null);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log('Saving task with description:', description);
    console.log('Current task:', task);

    dispatch(updateTask({ id: task._id, taskData: { description } }))
      .unwrap()
      .then(() => {
        console.log('Task updated successfully');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        setError('Failed to update task');
      });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleGetDetails = () => {
    console.log('Task details:', task);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id))  
      .unwrap()
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div className='p-4 mb-4 '>
      <h3 className='text-xl font-semibold mb-2'>{task.text}</h3>
      <p className='text-gray-500 text-sm mb-4'>
        Created at: {new Date(task.createdAt).toLocaleString()}
      </p>
      {isEditing ? (
        <div className='mb-4'>
          <textarea
            className='w-full p-2 border border-gray-300 rounded-md mb-2'
            value={description}
            onChange={handleDescriptionChange}
            placeholder='Enter description'
            aria-label='Task description'
          />
          {error && <p className='text-red-500 mb-2'>{error}</p>}
          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600'
          >
            Save
          </button>
        </div>
      ) : (
        <div className='mb-4'>
          <p className='text-gray-700 mb-2'>
            Description: {task.description || 'No description available'}
          </p>
          <div className='flex space-x-2'>
            <button
              onClick={handleEdit}
              className='px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600'
              aria-label='Edit task'
            >
              Edit
            </button>
          </div>
        </div>
      )}
      <button
        onClick={handleDelete}
        className='px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600'
        aria-label='Delete task'
      >
        Delete
      </button>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
    text: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default TaskItem;
