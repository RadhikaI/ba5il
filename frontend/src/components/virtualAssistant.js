import React from "react";
import Window from "./Window";
import { handleCloseWindow } from "@/hooks/windowHooks";
import GifComponent from "./GifComponent";
import { TypeAnimation } from "react-type-animation";

const VirtualAssistant = () => {
  return (
    <Window title="" onClose={handleCloseWindow}>
      <div className="flex items-center h-full flex-col">
        <div className="flex items-center bg-black rounded-lg shadow-lg p-2 w-40 h-full">
          <GifComponent gifIdIn={"zJ3v3ysX6bfUMJecQM"} />
        </div>
        <div className="p-2 mt-3 ml-2 mr-2 w-full h-32 max-h-32 bg-black rounded-md border border-[#00ff00]">
          <TypeAnimation
            sequence={[`Greetings,\n I am BA51L`, 2000, ""]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            omitDeletionAnimation={true}
            style={{
              color: "#00ff00",
              whiteSpace: "pre-line",
              height: "195px",
              display: "block",
            }}
          />
        </div>
      </div>
    </Window>
  );
};

export default VirtualAssistant;
