import { useState, useEffect } from 'react';
import TextBox from './TextBox';

const TextTransition = ({ doc1, doc2 }) => {
  const [currentText, setCurrentText] = useState(doc1);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSwitching(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSwitching) {
      const timer = setTimeout(() => {
        setCurrentText(doc2);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isSwitching, doc2]);

  return <TextBox text={currentText} />;
};

export default TextTransition;
