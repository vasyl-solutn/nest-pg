import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface RelatedTasks {
  upwards: Task[];
  downwards: Task[];
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [relatedTasks, setRelatedTasks] = useState<RelatedTasks | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(setTasks);
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    fetch(`http://localhost:3001/task-relations/${task.id}/related`)
      .then(response => response.json())
      .then(setRelatedTasks);
  };

  const handleRelateTask = (relatedTaskId: number) => {
    if (selectedTask) {
      fetch(`http://localhost:3001/task-relations/${selectedTask.id}/relate/${relatedTaskId}`, {
        method: 'POST',
      }).then(() => {
        // Refresh related tasks after relating
        handleTaskClick(selectedTask);
      });
    }
  };

  const handleUnrelateTask = (taskId: number, relatedTaskId: number) => {
    if (selectedTask) {
      fetch(`http://localhost:3001/task-relations/${taskId}/unrelate/${relatedTaskId}`, {
        method: 'DELETE',
      }).then(() => {
        // Refresh related tasks after unrelating
        handleTaskClick(selectedTask);
      });
    }
  };

  return (
    <>
      <h1 style={{ width: '100%', textAlign: 'center' }}>Items relations</h1>
      <div style={{ padding: '10px' }}>
        {tasks.length > 0 ? (
          <>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: selectedTask?.id === task.id ? 'lightgreen' : 'lightblue',
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
            ))}
          </>
        ) : (
          'Loading tasks...'
        )}

        {selectedTask && (
          <div>
            <h3>Selected Task: {selectedTask.title}</h3>
            <p>{selectedTask.description}</p>
            <h4>Related Tasks:</h4>
            {relatedTasks ? (
              <div>
                <h5>Upwards:</h5>
                {relatedTasks.upwards.map(task => (
                  <div key={task.id}>
                    {task.title}
                    <button onClick={() => handleUnrelateTask(task.id, selectedTask.id)}>Unrelate</button>
                  </div>
                ))}
                <h5>Downwards:</h5>
                {relatedTasks.downwards.map(task => (
                  <div key={task.id}>
                    {task.title}
                    <button onClick={() => handleUnrelateTask(selectedTask.id, task.id)}>Unrelate</button>
                  </div>
                ))}
              </div>
            ) : (
              'Loading related tasks...'
            )}
            <h4>Relate to:</h4>
            {tasks.filter(task => task.id !== selectedTask.id &&
                          !relatedTasks?.upwards.some(t => t.id === task.id) &&
                          !relatedTasks?.downwards.some(t => t.id === task.id))
              .map(task => (
                <div key={task.id}>
                  {task.title}
                  <button onClick={() => handleRelateTask(task.id)}>Relate</button>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </>
  );
}

export default App;
