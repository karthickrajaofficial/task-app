import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from '../components/TaskItem';
import Spinner from '../components/Spinner';
import { getTasks, deleteTask, updateTaskStatus, createTask } from '../features/tasks/taskSlice';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'TASK';

const DraggableTask = React.memo(({ task, index }) => {
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
      className={`bg-white border border-gray-300 shadow-md mb-4 p-4 rounded-md transition transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <TaskItem task={task} />
    </div>
  );
});

const DroppableColumn = React.memo(({ columnId, tasks, moveTask }) => {
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
      className={`flex flex-col shadow-md p-4 rounded-md w-full transition-colors duration-200 ${
        isOver ? 'bg-blue-100' : 'bg-gradient-to-r from-blue-50 to-blue-200'
      } hover:bg-blue-100`}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-800">{columnId}</h2>
      {tasks.map((task, index) => (
        <DraggableTask key={task._id} task={task} index={index} />
      ))}
    </div>
  );
});

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTasks());
    }
  }, [user, navigate, isError, message, dispatch]);

  const moveTask = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim() && newTaskDescription.trim()) {
      setIsAdding(true);
      dispatch(createTask({ text: newTaskText.trim(), description: newTaskDescription.trim(), status: 'To Do' }))
        .then(() => {
          setNewTaskText('');
          setNewTaskDescription('');
          setIsAdding(false);
        })
        .catch((error) => {
          console.error('Error adding task:', error);
          setIsAdding(false);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
  }, [tasks, searchQuery, sortOrder]);

  const todoTasks = useMemo(() => filteredTasks.filter((task) => task.status === 'To Do' || !task.status), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((task) => task.status === 'In Progress'), [filteredTasks]);
  const doneTasks = useMemo(() => filteredTasks.filter((task) => task.status === 'Done'), [filteredTasks]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col p-4 space-y-4 bg-gradient-to-r from-purple-50 to-blue-50 min-h-screen">
      <header className="flex flex-col mb-4 p-4 bg-white border border-gray-300 shadow-lg rounded-md">
        <h1 className="text-3xl font-bold mb-4 text-purple-800">Task Management Dashboard</h1>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Task Title..."
            className="flex-1 border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Task Title"
          />
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description..."
            className="flex-1 border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Task Description"
          />
          <button
            onClick={handleAddTask}
            disabled={isAdding}
            className={`px-4 py-2 rounded-md ${
              isAdding ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-semibold transition-transform duration-300 hover:scale-105`}
            aria-label="Add Task"
          >
            {isAdding ? 'Adding...' : 'Add Task'}
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tasks..."
            className="flex-1 border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Search Tasks"
          />
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            aria-label="Sort Order"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
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
