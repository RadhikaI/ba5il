import React from "react";
import Window from "./Window";
import { handleCloseWindow } from "@/hooks/windowHooks";

const WaveAnimation = () => {
  return (
    <Window title="" onClose={handleCloseWindow}>
      <div className="flex items-center bg-black rounded-lg shadow-lg p-2 space-x-4">
        <img
          src={"/assets/lcars_animation.gif"}
          className="w-64 object-contain"
        />
      </div>
    </Window>
  );
};

export default WaveAnimation;
