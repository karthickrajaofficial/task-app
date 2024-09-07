import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from '../components/TaskItem';
import Spinner from '../components/Spinner';
import { getTasks, deleteTask, updateTaskStatus, createTask } from '../features/tasks/taskSlice';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'TASK';

const DraggableTask = ({ task, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: task._id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white border border-gray-300 shadow-md mb-4 p-4 rounded-md ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}`}
    >
      <TaskItem task={task} />
    </div>
  );
};

const DroppableColumn = ({ columnId, tasks, moveTask }) => {
  const [isOver, setIsOver] = useState(false);

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => {
      moveTask(item.id, columnId);
    },
    hover: () => {
      setIsOver(true);
    },
    leave: () => {
      setIsOver(false);
    },
  });

  return (
    <div
      ref={drop}
      className={`flex flex-col bg-gray-100 border border-gray-300 shadow-md p-4 rounded-md w-full ${isOver ? 'bg-gray-200' : 'bg-gray-100'}`}
    >
      <h2 className="text-xl font-semibold mb-4">{columnId}</h2>
      {tasks.map((task, index) => (
        <DraggableTask key={task._id} task={task} index={index} />
      ))}
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log('Error:', message);
    }

    if (!user) {
      navigate('/login');
    }

    dispatch(getTasks());
  }, [user, navigate, isError, message, dispatch]);

  const moveTask = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const onDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleAddTask = () => {
    if (newTaskText.trim() && newTaskDescription.trim()) {
      setIsAdding(true);
      dispatch(createTask({ text: newTaskText.trim(), description: newTaskDescription.trim(), status: 'To Do' })).then(() => {
        setNewTaskText('');
        setNewTaskDescription('');
        setIsAdding(false);
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  
  const todoTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'To Do' || !task.status) : [];
  const inProgressTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'In Progress') : [];
  const doneTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'Done') : [];

  return (
    <div className="flex flex-col p-4 space-y-4">
      <header className="flex flex-col mb-4 p-4 bg-white border border-gray-300 shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-4">Task Management Dashboard</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Task Title..."
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description..."
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={handleAddTask}
            disabled={isAdding}
            className={`px-4 py-2 rounded-md ${isAdding ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold`}
          >
            {isAdding ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </header>
      <div className="flex space-x-4">
        <DroppableColumn columnId="To Do" tasks={todoTasks} moveTask={moveTask} />
        <DroppableColumn columnId="In Progress" tasks={inProgressTasks} moveTask={moveTask} />
        <DroppableColumn columnId="Done" tasks={doneTasks} moveTask={moveTask} />
      </div>
    </div>
  );
}

export default Dashboard;
