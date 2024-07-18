import { useEffect, useState } from 'react';
import { Task } from './App';

const TaskItem = ({ task, isSelected, handleTaskClick, handleUnrelateTask }: { task: Task, isSelected: boolean, handleTaskClick: (task: Task) => void, handleUnrelateTask: (selectedTaskId: number, taskId: number) => void }) => {
  const [upwardsTasks, setUpwardsTasks] = useState<Task[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

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
  }, [task.id, refreshFlag]);

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
          display: 'flex',
          flexDirection: 'column',
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
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '5px',
                }}
                onClick={() => {
                  handleUnrelateTask(upTask.id, task.id);
                  setRefreshFlag(prevFlag => !prevFlag);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
    </div>
  );
};

export default TaskItem;
