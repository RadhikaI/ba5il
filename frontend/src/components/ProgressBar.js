"use client";

import React, { useEffect, useState } from "react";
const width = 30;

function makeText(prop, mode) {

  return " " + ("=".repeat(Math.ceil(prop * width))) ;
}

function makeTextEnd(prop) {
  return "-".repeat(Math.floor(width - prop * width)) + " ";
}

const ProgressBar = ({ src, dst, progress }) => {
  const [text, setText] = useState("");
  const [boosterText, setBoosterText] = useState("o");
  const [textEnd, setTextEnd] = useState("");
  const [mode, setMode] = useState(false);

  useEffect(() => {
    setText(makeText(progress));
    setTextEnd(makeTextEnd(progress));

    const intervalId = setInterval(() => {
      setMode((prevMode) => {
        const newMode = !prevMode;
        setBoosterText(newMode ? "o" : "O")
        return newMode;
      });
    }, 400);

    return () => clearInterval(intervalId);
  }, [progress]); // Only progress as dependency since we handle mode internally

  return (
    <div className="flex font-mono flex-row">
      <div className="text-background pr-1">{src}</div>
      <div className="text-green-500">{text}</div>
      <div className="text-[#ff4040]">{boosterText}</div>
      <div className="text-gray-800">{"=>"}</div>

      <div className="text-red-500">{textEnd}</div>
      <div className="text-background pl-1">{dst}</div>
    </div>
  );
};

export default ProgressBar;