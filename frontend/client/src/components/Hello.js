import React, { useEffect, useState } from 'react';

const Hello = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h2>Backend Message:</h2>
      <p>{message}</p>
    </div>
  );
};

export default Hello;