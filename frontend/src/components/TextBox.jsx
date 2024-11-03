import { useState, useEffect } from 'react';

const TextBox = ({ text }) => {
  const [whiteLine, setWhiteLine] = useState(0);
  const [renderedUpTo, setRenderedUpTo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWhiteLine((whiteLine + 1) % (text.length + 20));
    }, Math.random() * 200);
    return () => clearInterval(interval);
  }, [whiteLine]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderedUpTo((renderedUpTo + 1) % (text.length + 100));
    }, Math.random() * 75);
    return () => clearInterval(interval);
  }, [renderedUpTo]);

  return (
    <>
      {
        text.map((entry, i) => (
          <div
            key={i}
            className={`mb-1 ${i >= renderedUpTo ? 'text-background' :
              (i === whiteLine || i === whiteLine + 1) ? 'text-gray-200' : entry.type
              }`}
          >
            {entry.text}
          </div>
        ))
      }
    </>

  );
}

export default TextBox;
