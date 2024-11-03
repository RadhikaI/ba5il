import { useState, useRef, useEffect } from "react";
import TextBox from "./TextBox";

const Hopper = ({ setActiveProcess, currentPlanet, setTargetPlanet }) => {
  const asciiPlanet = [
    {
      text: "         ,MMM8&&&. <----[You are here]",
      type: "text-primary_purple",
    },
    {
      text: "    _...MMMMM88&&&&..._                          * coruscant (CO)",
      type: "text-primary_purple",
    },
    { text: " .::'''MMMMM88&&&&&&'''::.", type: "text-primary_purple" },
    { text: "::     MMMMM88&&&&&&      ::", type: "text-primary_purple" },
    {
      text: "'::....MMMMM88&&&&&&....::'          * felucia (FE)",
      type: "text-primary_purple",
    },
    { text: "   `''''MMMMM88&&&&''''`", type: "text-primary_purple" },
    { text: "         'MMM8&&&'", type: "text-primary_purple" },
    { text: " Where dost thou wanst to go?", type: "text-primary_red" },
  ];
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const result = processCommand(inputValue);

    setHistory((prev) => [
      ...prev,
      { text: `> ${inputValue}`, type: "text-primary_red" },
      { text: result, type: "text-primary_purple" },
    ]);

    setInputValue("");
  };

  const processCommand = (cmd) => {
    const commands = {
      help: () => "Available commands:\nhelp\nexit\nhopto",
      quit: () => {
        setActiveProcess(["terminal"]);
      },
      hopto: (args) => {
        if (args.length != 1) return "hopto <planet name>";
        const planetName = args[0].toUpperCase();
        setTargetPlanet(planetName);
        return "Hopping from " + currentPlanet + " to " + planetName + "...";
      },
    };

    const parts = cmd.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    if (command in commands) {
      return commands[command](args);
    }
    return `Command not found: ${command}. Try 'help' for a list of commands.`;
  };

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="h-full max-h-[calc(100vh-100px)] overflow-y-auto bg-background text-primary_orange p-4 rounded-lg shadow-lg border border-white">
      <div
        ref={containerRef}
        className="h-max overflow-y-auto mb-4 whitespace-pre-wrap"
      >
        <div className="font-mono">
          <TextBox text={asciiPlanet}></TextBox>
        </div>
        <TextBox text={history}></TextBox>
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-primary_orange">{">"}</span>
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

export default Hopper;
