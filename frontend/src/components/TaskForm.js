import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';

function TaskForm() {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Task text is required');
      return;
    }

   
    setError(null);

    dispatch(createTask({ text, description }));
    setText('');
    setDescription('');
  };

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        {error && <p className='error'>{error}</p>}
        <div className='form-group'>
          <label htmlFor='text'>Task</label>
          <input
            type='text'
            name='text'
            id='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
