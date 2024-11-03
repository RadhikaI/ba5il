"use client";
import { useState, useEffect, useCallback } from 'react';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import Window from "./Window";
import styles from "./Notepad.module.css";
import LocalStorageWrapper from "@/app/lib/LocalStorageWrapper";

const backgroundClasses = [
  'bg-[url("/assets/hoth_inspired.png")] text-[#FFFFFF]',
  'bg-[url("/assets/dune_inspired.png")] text-[#fbf4d9]',
  'bg-[url("/assets/random_planet.png")] text-[#faefed]',
  'bg-[url("/assets/pandora_inspired_green.png")] text-[#1c3623]',
  'bg-[url("/assets/scarif_inspired.png")] text-[#1a133d]',
];

const Notepad = ({ setActiveProcess, filename }) => {
  const randomBgClass = backgroundClasses[Math.floor(Math.random() * backgroundClasses.length)];
  const [cssStr, _]  = useState(`${randomBgClass} bg-cover bg-bottom border rounded py-2 px-3`.toString());

  const saveFile = () => {
    LocalStorageWrapper.write(filename, editor.getText());
  };
  const onClose = () => {
    setActiveProcess(["terminal"]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold capitalize",
          levels: [2],
        },
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-2",
        },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "shadow appearance-none h-[580px] w-[400px] bg-cover bg-bottom text-sm mt-0 md:mt-3 focus:outline-none focus:shadow-outline",
      },
    },
    content: LocalStorageWrapper.read(filename),
  });

  return (
    <div className="h-full max-h-[calc(100vh-100px)] overflow-hidden bg-background text-primary_orange p-4 rounded-lg shadow-lg border border-white">
      <div className="flex justify-between items-center mb-2">
        <button className="hover:text-red-500" onClick={onClose}>
          Exit
        </button>
        <button className="hover:text-red-500" onClick={saveFile}>
          Save
        </button>
        <div>{filename}</div>
      </div>
      <div className="flex justify-center items-center mb-5">
        <EditorContent className={cssStr}  editor={editor} />
      </div>
    </div>
  );
};

export default Notepad;

//
// <Window title={"Notepad"} onClose={onClose}>
//   <div className="flex justify-between items-center mb-2">
//     <button className="hover:text-red-500" onClick={saveFile}>
//       Save
//     </button>
//     <div>{filename}</div>
//   </div>
//   <div className="bg-cover">
//     <div>
//       <EditorContent editor={editor} />
//     </div>
//   </div>
// </Window>
//
