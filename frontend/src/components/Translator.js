"use client";
import { useEffect, useState } from "react";
import LocalStorageWrapper from "@/app/lib/LocalStorageWrapper";
import TextTransition from "@/components/TextTransition";

const Translator = ({ setActiveProcess, inf, outf, lang }) => {
  const [translated, setTranslated] = useState(false);

  const instr = LocalStorageWrapper.read(inf) || "";

  const doc1 = [
    { text: "Initiating language conversion.", type: "input" },
    { text: instr, type: "output" },
    { text: "TRANSLATING...", type: "input" },
  ];

  const [doc2, setDoc2] = useState([
    { text: "TRANSLATION IN PROGRESS", type: "output" },
  ]);

  useEffect(() => {
    if (translated) return;
    setTranslated(true);
    const translateText = async () => {
      if (!instr) return;

      try {
        const response = await fetch("http://localhost:5000/api/translate", {
          method: "POST",
          body: JSON.stringify({
            text: instr,
            conlang: lang,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "omit",
        });

        const data = await response.json();
        LocalStorageWrapper.write(outf, data.translation);

        setDoc2((prev) => [
          { text: data.translation, type: "input" },
          { text: "TRANSLATION COMPLETE", type: "output" },
        ]);

        setTimeout(() => {
          setActiveProcess(["terminal"]);
        }, 6000);
      } catch (error) {}
    };

    translateText();
  }, [instr, lang, outf]);

  return (
    <div className="flex-grow h-full mx-auto bg-black text-primary_orange p-4 rounded-lg shadow-lg border border-white">
      <div className="h-max overflow-y-hidden whitespace-pre-wrap">
        <TextTransition doc1={doc1} doc2={doc2} />
      </div>
    </div>
  );
};

export default Translator;
