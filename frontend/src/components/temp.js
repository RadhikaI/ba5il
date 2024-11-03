"use client";

import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import PlanetStatus from "./PlanetStatus";
import Translator from "./Translator";
import TextTransition from "./TextTransition";
import { handleOpenWindow, handleCloseWindow } from "@/hooks/windowHooks";
import Window from "./Window";
import Terminal from "./Terminal";

const DesktopIcon = ({ name, icon, onOpen }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: name,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-auto text-center text-white m-2 cursor-pointer"
      onClick={onOpen}
    >
      <img src={icon} alt={name} className="w-12 h-12 mx-auto" />
      <p>{name}</p>
    </div>
  );
};

const Taskbar = () => {
  return (
    <div className="bottom-0 left-0 right-0 flex justify-between items-center bg-primary_orange p-2 text-white">
      <div className="flex space-x-4">
        <button className="hover:bg-secondary px-2 py-1 rounded">Start</button>
        <button className="hover:bg-secondary px-2 py-1 rounded">App 1</button>
        <button className="hover:bg-secondary px-2 py-1 rounded">App 2</button>
      </div>
      <div className="text-sm">Time: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};

const Desktop = () => {
  const [isOpen, setIsOpen] = useState(true);

  const icons = [
    { name: "Radio", icon: "/icons/radio.png" },
    { name: "Notebook", icon: "/icons/notebook.png" },
    { name: "Terminal", icon: "/icons/terminal.png" },
    { name: "Babelfish", icon: "/icons/translator.png" },
  ];

  return (
    <DndContext>
      <div className="w-screen h-screen bg-[#1b134f] flex flex-col">
        <div className="flex flex-wrap flex-row h-full">
          <div className="p-5 flex flex-wrap flex-col max-w-fit">
            {icons.map((icon, index) => (
              <DesktopIcon
                key={index}
                name={icon.name}
                icon={icon.icon}
                onOpen={handleOpenWindow}
              />
            ))}
          </div>
          <div className="max-h-fit mt-6">{isOpen && <PlanetStatus />}</div>
          <div className="mt-6 ml-4 mr-4 flex-grow bg-blue-500 mb-6">
            <Terminal />
          </div>
        </div>
        <Taskbar />
      </div>
    </DndContext>
  );
};

export default Desktop;
