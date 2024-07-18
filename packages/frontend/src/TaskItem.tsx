import { useEffect, useState } from 'react';
import { Task } from './App';

const TaskItem = ({ task, isSelected, handleTaskClick }: { task: Task, isSelected: boolean, handleTaskClick: (task: Task) => void }) => {
  const [upwardsTasks, setUpwardsTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchUpwardsTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/task-relations/${task.id}/related`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUpwardsTasks(data.upwards);
      } catch (error) {
        console.error('Failed to fetch upwards tasks:', error);
      }
    };

    fetchUpwardsTasks();
  }, [task.id]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div
        key={task.id}
        style={{
          background: isSelected ? 'lightgreen' : 'lightblue',
          borderRadius: '45%',
          padding: '10px 20px',
          margin: '5px',
          display: 'inline-block',
          cursor: 'pointer'
        }}
        onClick={() => handleTaskClick(task)}
      >
        {task.title}
      </div>
      <div
        style={{
          paddingLeft: '15pt',
        }}
      >
          {upwardsTasks.map((upTask: Task) => (
            <div
              key={upTask.id}
              style={{
                background: 'lightcoral',
                borderRadius: '40%',
                padding: '3px 6px',
                margin: '2px',
                display: 'inline-block',
                fontSize: '0.8em'
              }}
            >
              {upTask.title}
            </div>
          ))}
        </div>
    </div>
  );
};

export default TaskItem;
