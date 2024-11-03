import { useState, useEffect, useRef } from 'react';
import { planets } from '@/app/lib/Planets';

const Radio = ({ currentPlanet }) => {
  const files = [
    "Rec 1", "Rec 2", "Rec 3", "Rec 4", "Rec 5", "Rec 6",
    "Rec 7", "Rec 8", "Rec 9", "Rec 10", "Rec 11", "Rec 12", 
    "Rec 13", "Style", "elevator_music", "funky_town", "radio_tune", "toskibidi"
  ];

  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioElementRef = useRef(null);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;

    setAudioContext(context);
    setAnalyser(analyserNode);

    const audio = new Audio();
    const index = planets.findIndex(planet => planet.id === currentPlanet);

    if (index !== -1 && planets[index].audioSource) {
      audio.src = planets[index].audioSource;
      audioElementRef.current = audio;

      const source = context.createMediaElementSource(audio);
      source.connect(analyserNode);
      analyserNode.connect(context.destination);
      audio.play();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioElementRef.current) audioElementRef.current.pause();
      if (context) context.close();
    };
  }, [currentPlanet]);

  const next_audio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      const newIndex = Math.floor(Math.random() * files.length);
      setCurrentAudioIndex(newIndex);
      audioElementRef.current.src = `/audio/${files[newIndex]}.mp3`;
      audioElementRef.current.play().catch(error => console.error("Audio play error:", error));
    }
  };

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let x = 0;
      const barWidth = (canvas.width / bufferLength) * 2.5;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#ca6867"); 
      gradient.addColorStop(1, "#ecaff0");

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    if (audioElementRef.current) {
      audioElementRef.current.addEventListener('ended', next_audio);
    }

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.removeEventListener('ended', next_audio);
      }
    };
  }, [analyser]);

  return (
    <div className="h-full max-h-[calc(100vh-100px)] overflow-y-auto bg-primary_red text-background p-4 rounded-lg shadow-lg border border-primary_red flex flex-col items-center"
         style={{ backgroundImage: "url('/assets/wave_background.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <p className="text-7xl text-center text-primary_red pt-6">RADIO</p>
      <button onClick={next_audio} className="bg-primary_purple text-2xl text-primary_white mt-4 p-2 rounded-lg hover:bg-opacity-80">
        Switch Station
      </button>
      <canvas 
        ref={canvasRef}
        width={600}
        height={300}
        className="mt-8 rounded-lg"
      />
    </div>
  );
};

export default Radio;
