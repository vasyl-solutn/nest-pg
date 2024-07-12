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

  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<Task[]>([]);

  useEffect(() => {
    if (inputValue) {
      fetch(`http://localhost:3001/tasks/?query=${inputValue}`)
        .then((response) => response.json())
        .then((data) => {
          setAutocompleteResults(data.slice(0, 5)); // Limit to 5 items
        });
    } else {
      setAutocompleteResults([]); // Clear results if input is cleared
    }
  }, [inputValue]);

  const handleTaskClick = (task: Task) => {
    if (selectedTask === task) {
      setSelectedTask(null);
      setRelatedTasks(null);
    } else {
      setSelectedTask(task);
      fetch(`http://localhost:3001/task-relations/${task.id}/related`)
        .then(response => response.json())
        .then(setRelatedTasks);
    }
  };

  const handleRelateTask = (relatedTaskId: number) => {
    if (selectedTask) {
      fetch(`http://localhost:3001/task-relations/${selectedTask.id}/relate/${relatedTaskId}`, {
        method: 'POST',
      }).then(() => {
        handleTaskClick(selectedTask);
      });
    }
  };

  const handleUnrelateTask = (taskId: number, relatedTaskId: number) => {
    if (selectedTask) {
      fetch(`http://localhost:3001/task-relations/${taskId}/unrelate/${relatedTaskId}`, {
        method: 'DELETE',
      }).then(() => {
        handleTaskClick(selectedTask);
      });
    }
  };

  return (
    <>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type part of the task name..."
          style={{ width: '100%', marginBottom: '10px' }}
        />
        {autocompleteResults.length > 0 && (
          <div style={{ position: 'relative' }}>
            <ul style={{ position: 'absolute', width: '100%', background: 'white', listStyle: 'none', padding: 0 }}>
              {autocompleteResults.map((result) => (
                <li
                  key={result.id}
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onClick={() => {
                    setInputValue(result.title);
                    setAutocompleteResults([]);
                    setTasks([...tasks, result]);
                  }}
                >
                  {result.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
