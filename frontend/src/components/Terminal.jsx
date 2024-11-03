"use client";
import { useEffect, useState, useRef } from 'react';
import TextBox from '@/components/TextBox';
import LocalStorageWrapper from '@/app/lib/LocalStorageWrapper';
import { planets } from '@/app/lib/Planets';

const Terminal = ({ setActiveProcess, extText, currentPlanet }) => {
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const planetIndex = planets.findIndex(planet => planet.id === currentPlanet);

  useEffect(() => { setInputValue(extText); }, [extText])
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const processCommand = (cmd) => {
    const commands = {
      help: () => 'Available commands:\nhelp\n\ls\ncat\nwrite\nclear\nnotepad\nhop',
      clear: () => { setHistory([]); return '' },
      echo: (args) => args.join(' '),
      notepad: (args) => {
        if (args.length != 1) return "notepad <file name>";
        setActiveProcess(['notepad', args.join(' ')])
      },
      translator: (args) => {
        if (args.length != 3) return "translator <input file name> <output file name> <language>"

        setActiveProcess(['translator'].concat(args))
      },
      radio: () => setActiveProcess(['radio', '']),
      ls: () => LocalStorageWrapper.list().join("\n"),
      write: (args) => LocalStorageWrapper.write(args[0], args[1]),
      cat: (args) => LocalStorageWrapper.read(args.join(' ')),
      rm: (args) => LocalStorageWrapper.rm(args[0]),
      hop: () => setActiveProcess(['hop', '']),
      receive: () => {
        LocalStorageWrapper.write("transmission-" + planets[planetIndex].name, planets[planetIndex].transmission);
        return "Wrote transmission to " + "transmission-" + planets[planetIndex].name;
      }
    }

    const parts = cmd.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    if (command in commands) { return commands[command](args); }
    return `Command not found: ${command}. Try 'help' for a list of commands.`;
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const result = processCommand(inputValue);

    setHistory(prev => [
      ...prev,
      { text: `> ${inputValue}`, type: 'text-primary_red' },
      { text: result, type: 'text-primary_purple' }
    ]);

    setInputValue('');
  }
  return (
    <div className="h-full max-h-[calc(100vh-100px)] overflow-y-auto bg-background text-primary_orange p-4 rounded-lg shadow-lg border border-primary_red">
      <div
        ref={containerRef}
        className="h-max overflow-y-auto mb-4 whitespace-pre-wrap"
      >
        <TextBox text={history}></TextBox>
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-primary_orange">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none ml-2"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};
export default Terminal;
