import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';

export interface Task {
  id: number;
  title: string;
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
    } else if (task) {
      setSelectedTask(task);
      refreshChildren(task.id);
    }
  };

  const refreshChildren = (taskId: number) => {
    fetch(`http://localhost:3001/task-relations/${taskId}/related`)
      .then(response => response.json())
      .then(setRelatedTasks);
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

  const relateTasks = (upwardsTaskId: number, downwardsTaskId: number) => {
    fetch(`http://localhost:3001/task-relations/${upwardsTaskId}/relate/${downwardsTaskId}`, {
      method: 'POST',
    })
  };

  const handleUnrelateTask = (taskId: number, relatedTaskId: number) => {
    if (selectedTask) {
      fetch(`http://localhost:3001/task-relations/${taskId}/unrelate/${relatedTaskId}`, {
        method: 'DELETE',
      }).then(() => {
        refreshChildren(selectedTask.id);
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
          style={{ width: '60%', marginBottom: '10px' }}
        />

        <button onClick={async () => {
          const newTask: Task = {
            id: NaN,
            title: inputValue
          };

          await fetch('http://localhost:3001/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: inputValue }),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('new task data', data)
            newTask.id = data.id;
          })
          .catch((error) => {
            throw new Error(error);
          });

          console.log('new task id', newTask)

          setTasks([...tasks, newTask]);
          setInputValue("");
        }}>Add new</button>

        {autocompleteResults.length > 0 && (
          <div style={{ position: 'relative' }}>
            <ul style={{ position: 'absolute', width: '100%', background: 'white', listStyle: 'none', padding: 0 }}>
              {autocompleteResults.map((result) => (
                <li
                  key={result.id}
                >
                  <div
                    style={{ padding: '5px', cursor: 'pointer', display: 'inline' }}
                    onClick={() => {
                      setInputValue(result.title);
                      setAutocompleteResults([]);
                      setTasks([...tasks, result]);
                    }}
                  >
                    {result.title}
                  </div>
                  {selectedTask &&
                    <>
                      <button
                        onClick={() => {
                          // setAutocompleteResults([]);
                          relateTasks(result.id, selectedTask.id);
                        }}
                      >
                        add as a parent
                      </button>
                      <button
                        style={{ marginLeft: '5px' }}
                        onClick={() => {
                          // setAutocompleteResults([]);
                          relateTasks(selectedTask.id, result.id);
                        }}
                      >
                        add as a chield
                      </button>
                    </>
                  }
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h1 style={{ width: '100%', textAlign: 'center' }}>Item relations</h1>
      <div style={{ padding: '10px', display: 'flex' }}>
        {tasks.length > 0 ? (
          <>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isSelected={selectedTask?.id === task.id}
                handleTaskClick={handleTaskClick}
                handleUnrelateTask={handleUnrelateTask}
              />
            ))}
          </>
        ) : (
          'Loading tasks...'
        )}
      </div>
      {selectedTask && relatedTasks ? (
        <>
          <h3>Related</h3>
          <div style={{ display: 'flex'}}>
            {relatedTasks.downwards.map(task =>
              <div>
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTask?.id === task.id}
                  handleTaskClick={handleTaskClick}
                  handleUnrelateTask={handleUnrelateTask}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        'Loading related tasks...'
      )}
    </>
  );
}

export default App;
