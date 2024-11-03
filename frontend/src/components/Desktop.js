"use client";

import React, { useState, useEffect } from "react";
import PlanetStatus from "./PlanetStatus";
import ProcessManager from "./ProcessManager";
import WaveAnimation from "./WaveAnimation";
import MoleculesAnimation from "./MoleculesAnimation";
import Marquee from "react-fast-marquee";
import ProgressBar from "./ProgressBar";
import VirtualAssistant from "./virtualAssistant";
import ImagePopup from "./ImagePopup";
import TextPopup from "./TextPopup";
const DesktopIcon = ({ name, icon, onOpen }) => {
  return (
    <div
      className="w-auto text-center text-white m-2 cursor-pointer"
      onClick={onOpen}
    >
      <img src={icon} alt={name} className="w-12 h-12 mx-auto" />
      <p>{name}</p>
    </div>
  );
};

const news = [
  "BREAKING: Outer Rim Syndicate Agrees to Ceasefire with Mining Guild — Trade Routes Reopen After Decades of Conflict",
  "First Quantum Anomaly Detected in the Andromeda Sector — Astrophysicists Stunned by Unprecedented Findings",
  "Solar Storm Warning: Travelers Advised to Avoid Neptar-4 After Recent Magnetic Flare Activity",
  "Cybernetic Rights Bill Gains Momentum in the Core Systems — Debate Heats Up on Sentient AI Recognition",
  "Intergalactic Council Grants Refuge Status to Insectoid Species from Blaznor-8 After Planetary Collapse",
  "Galactic Championship Finals Approaching! Vexnor-Prime Hosts This Year’s Zero-G Hoverball Tournament",
  "Luxury Space Yacht 'Celestial Rose' Missing in Nebula of Sirax — Authorities Fear Pirate Involvement",
  "Astrobiologists Discover Rare Lifeforms on Exoplanet Uraxa-B — New Research Hub Planned for Deep-Space Study",
  "BREAKING: Warp Gate Network Down in Sector 12-Alpha, Cause Unknown — Massive Delays Expected Across Trade Hubs",
  "First-Ever Galactic Tour Set for Milky Way’s Arm — Tourists Can Now Book Sightseeing for the Perseus Spiral",
  "Rumor Alert: Ancient Alien Civilization Artifacts Allegedly Found on Hathon-9 — Government Officials Decline Comment",
  "Scientists Confirm Quantum Teleportation Breakthrough — Intergalactic Travel Could Be Revolutionized in Coming Decades",
  "Galactic Archaeologists Unearth Pre-Hyperdrive Civilization Remnants on Xyra-5 — Speculations of Precursor Tech Abound",
  "Starport Scandal: Elite Trithon-Skies Resort Linked to Smuggling Ring — Investigation Underway",
  "Meteor Shower of a Millennium Expected Over Celestia City Tonight — Spectacular View Anticipated",
  "Galactic Languages Database Expands — Translators Now Available for Over 10,000 Known Species",
  "Imperial Fleet on Alert: Reports of Unregistered Alien Fleet Entering Uncharted Territory",
  "High-Profile Trade Agreement Signed Between Terra Nova and Zyxtrali Empire — Economic Boom Predicted for Both Sides",
  "BREAKING: Leading Scientists Announce ‘Life-Seeding’ Project to Populate Barren Worlds in the Sagittarius Dwarf Galaxy",
  "New Synthetic Atmosphere Dome Unveiled on Mars-Terra Outpost — Tourists Can Now Experience an 'Earth-Like' Habitat",
];
const Taskbar = ({
  currentPlanet,
  setCurrentPlanet,
  targetPlanet,
  setTargetPlanet,
}) => {
  const [travelProgress, setTravelProgress] = useState(0.0);

  const ambience = new Audio("/audio/ambience.mp3");

  useEffect(() => {
    if (ambience.paused) ambience.play();
  }, []);

  useEffect(() => {
    console.log(targetPlanet, currentPlanet);

    if (targetPlanet != currentPlanet) {
      setTravelProgress(0.0);
    }
  }, [targetPlanet]);

  useEffect(() => {
    if (targetPlanet === currentPlanet) {
      return;
    }
    const progressInterval = setInterval(() => {
      setTravelProgress((prev) => {
        const next = prev + 0.05;
        if (next >= 1.0) {
          setTimeout(() => {
            setCurrentPlanet(targetPlanet);
          }, 0);
          return 1.0;
        }
        return Number(next.toFixed(2));
      });
    }, 500);

    return () => clearInterval(progressInterval);
  }, [targetPlanet, currentPlanet, setCurrentPlanet]);
  return (
    <div className="bottom-0 left-0 right-0 flex justify-between items-center bg-primary_orange p-2 text-white">
      <div className="flex-1 min-w-0 text-black mr-2">
        <Marquee
          pauseOnHover={true}
          autoFill={true}
          gradient={true}
          gradientColor="#fc9711"
        >
          {news.map((item, index) => (
            <pre key={index}>{item + "      *      "}</pre>
          ))}
        </Marquee>
      </div>

      {currentPlanet != targetPlanet && (
        <div className="w-128 mx-2 shrink-0">
          <ProgressBar
            src={currentPlanet}
            dst={targetPlanet}
            progress={travelProgress}
          />
        </div>
      )}

      <div className="text-sm font-mono text-black whitespace-nowrap ml-2">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

const Desktop = () => {
  const [launchApp, setLaunchApp] = useState("terminal");
  const [currentPlanet, setCurrentPlanet] = useState("FELUCIA");
  const [targetPlanet, setTargetPlanet] = useState("CORUSCANT");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };
  const images = [
    "/assets/liminal1.webp",
    "/assets/liminal2.jpg",
    "/assets/liminal3.jpg",
    "/assets/liminal4.jpg",
  ];

  const [isTextPopupOpen, setTextIsPopupOpen] = useState(false);
  const [textCurrentIndex, setTextCurrentIndex] = useState(0);

  const handleTextOpenPopup = () => setTextIsPopupOpen(true);
  const handleTextClosePopup = () => setTextIsPopupOpen(false);

  const handleTextNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
  };

  const handleTextPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + texts.length) % texts.length,
    );
  };
  const texts = [
    "They say there was once life here. Oceans, mountains, forests… I've seen none of it. Coruscant is endless, dusky grey, a planet half-baked and left to crumble. The buildings stand like skeletons of some lost civilization, half-buried in the sand. Everything is empty. Not a single whisper, only the hum of my equipment and my own breaths bouncing back at me through the helmet. But tonight, I could have sworn I heard something. A rustle, maybe, or a shuffle in the dust. I froze, torch beam scanning across broken archways and ruined streets. Nothing. Just the wind, maybe. I hope.",
    "I found something strange today, buried just below the sand. A stone tablet, rough-hewn with symbols chiseled across it in a spiral. They look almost like they were made by hand. But there's no trace of tool marks or wear. How long has this been sitting here? Tried to run a scan, but my reader couldn’t make sense of it. The shapes twist around, unfamiliar, but… familiar at the same time. I’ll set up camp near here. Maybe I’ll find more.",
    "I dreamed. Or at least, I think I did. The sand had turned to water, and I was wading through it, thick and syrupy. The horizon pulsed with light, rhythmic, like a heartbeat. And there was someone, something, walking with me. Every time I turned to look, it was gone, slipping out of sight. Woke up with a chill in my bones. The air filters are running fine, and I checked the oxygen levels again. But I can’t shake the feeling that I wasn’t alone. I’m beginning to wonder if the emptiness here isn’t just physical.",
  ];

  const icons = [
    { name: "Radio", icon: "/icons/radio_transparent.png", intl_name: "radio" },
    {
      name: "Notebook",
      icon: "/icons/notebook_transparent.png",
      intl_name: "notepad",
    },
    {
      name: "Terminal",
      icon: "/icons/terminal_transparent.png",
      intl_name: "terminal",
    },
    {
      name: "Babelfish",
      icon: "/icons/translator_transparent.png",
      intl_name: "translator",
    },
  ];

  return (
    <>
      <div className="w-screen h-screen max-h-screen bg-[url('/assets/new_desktop_background.png')] bg-cover bg-center flex flex-col">
        {isPopupOpen && (
          <ImagePopup
            images={images}
            currentIndex={currentIndex}
            onClose={handleClosePopup}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {isTextPopupOpen && (
          <TextPopup
            texts={texts}
            currentIndex={currentIndex}
            onClose={handleTextClosePopup}
            onNext={handleTextNext}
            onPrevious={handleTextPrevious}
          />
        )}
        <div className="flex flex-wrap flex-row h-full">
          <div className="p-5 flex flex-wrap flex-col max-w-fit">
            {icons.map((icon, index) => {
              const launch = () => {
                setLaunchApp(icon.intl_name);
              };
              return (
                <DesktopIcon
                  key={index}
                  name={icon.name}
                  icon={icon.icon}
                  onOpen={launch}
                />
              );
            })}
            <DesktopIcon
              name={"???"}
              icon={"/icons/photos.png"}
              onOpen={handleOpenPopup}
            />
            <DesktopIcon
              name={"Hours"}
              icon={"/icons/book.png"}
              onOpen={handleTextOpenPopup}
            />
          </div>
          <div className="max-h-[calc(100vh-100px)] mt-6">
            <PlanetStatus currentPlanet={currentPlanet} />
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="mt-3">
                  <WaveAnimation />
                </div>
                <div className="mt-3">
                  <MoleculesAnimation />
                </div>
              </div>
              <div className="mt-3 ml-4 flex">
                <VirtualAssistant />
              </div>
            </div>
          </div>
          <div className="mt-6 ml-4 mr-4 flex-grow mb-6">
            <ProcessManager
              toLaunch={launchApp}
              currentPlanet={currentPlanet}
              setTargetPlanet={setTargetPlanet}
            />
          </div>
        </div>
        <Taskbar
          currentPlanet={currentPlanet}
          setCurrentPlanet={setCurrentPlanet}
          targetPlanet={targetPlanet}
          setTargetPlanet={setTargetPlanet}
        />
      </div>
    </>
  );
};

export default Desktop;
