import React, { useEffect, useState } from "react";
import Window from "./Window";
import GifComponent from "./GifComponent";
import { handleCloseWindow } from "@/hooks/windowHooks";
import TextBox from "./TextBox";
import { planets } from "@/app/lib/Planets"; 

const PlanetStatus = ({ currentPlanet }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const index = planets.findIndex(planet => planet.id === currentPlanet);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentPlanet]);

  const MediaRenderer = ({ mediaType, mediaSource }) => {
    if (mediaType === "gif") {
      return <GifComponent gifIdIn={mediaSource} />;
    } else if (mediaType === "video") {
      return (
        <div className="w-64 h-48">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover rounded-lg">
            <source src={mediaSource} type="video/mp4" />
          </video>
        </div>
      );
    }
    return null;
  };

  return (
    <Window
      title={`Planet Status - ${planets[currentIndex].name}`}
      onClose={handleCloseWindow}
    >
      <div className="relative bg-black rounded-lg shadow-lg p-4 w-[490px]">
        <div className="flex items-center justify-between space-x-4">
          <div className="w-[280px]">
            <TextBox text={Array.isArray(planets[currentIndex].details) ? planets[currentIndex].details : [planets[currentIndex].details]} />
          </div>
          <div className="w-[280px] flex justify-center items-center">
            <MediaRenderer
              mediaType={planets[currentIndex].mediaType}
              mediaSource={planets[currentIndex].mediaSource}
            />
          </div>
        </div>
      </div>
    </Window>
  );
};

export default PlanetStatus;
