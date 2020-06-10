import React, { useEffect, useState } from 'react';
import { Message } from '@spotted/api-interfaces';

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return <>Hello {m.message}.</>;
};

export default App;
