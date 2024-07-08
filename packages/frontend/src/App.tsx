import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then(response => response.text())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      <h1>Data from API:</h1>
      {data ? <p>{data}</p> : 'Loading...'}
    </div>
  );
}

export default App;
