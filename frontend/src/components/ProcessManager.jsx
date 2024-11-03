"use client"

import { useEffect, useState } from 'react';
import Terminal from "@/components/Terminal";
import Notepad from "@/components/Notepad";
import Translator from './Translator';
import Radio from './Radio'
import Hopper from './Hopper';

const ProcessManager = ({ toLaunch, currentPlanet, setTargetPlanet }) => {
  const [selectedProcess, setSelectedProcess] = useState(["terminal"]);

  const [terminalInputLine, setTerminalInputLine] = useState("");

  useEffect(() => {
    console.log(toLaunch);
    if (toLaunch == "notepad" || toLaunch == "translator") {
      setSelectedProcess(["terminal"]);
      setTerminalInputLine(toLaunch);
    } else if (toLaunch == "terminal") {
      setSelectedProcess(["terminal"]);
      setTerminalInputLine("");
    } else {
      setSelectedProcess([toLaunch]);
    }
  }, [toLaunch])
  return (
    <>
      {selectedProcess[0] === "terminal" && <Terminal extText={terminalInputLine} setActiveProcess={setSelectedProcess} />}
      {selectedProcess[0] === "notepad" && <Notepad setActiveProcess={setSelectedProcess} filename={selectedProcess[1]} />}
      {selectedProcess[0] === "translator" && <Translator setActiveProcess={setSelectedProcess} inf={selectedProcess[1]} outf={selectedProcess[2]} lang={selectedProcess[3]} />}
      {selectedProcess[0] === "radio" && <Radio currentPlanet={currentPlanet} />}
      {selectedProcess[0] === "hop" && <Hopper setActiveProcess={setSelectedProcess} currentPlanet={currentPlanet} setTargetPlanet={setTargetPlanet} />}
    </>
  );
}
export default ProcessManager;
