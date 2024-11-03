'use client'
import { useState, useEffect, useCallback } from 'react';

const Circle = ({ side, isActive, onAnimationComplete }) => {
  const baseGradient = "from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500";
  
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive && !isAnimating) {
      setIsAnimating(true);
    }
  }, [isActive]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    if (isActive) {
      onAnimationComplete();
    }
  };
  
  return (
    <div className={`absolute top-1/2 ${side === 'left' ? 'left-12' : 'right-12'} -translate-y-1/2`}>
      <div 
        className={`
          w-32 h-32 rounded-full 
          bg-gradient-to-r ${baseGradient}
          ${isActive ? 'animate-pulse-and-spin' : ''}
        `}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};

const LockScreen = ({setUnlocked}) => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [leftCircleReady, setLeftCircleReady] = useState(true);
  const [rightCircleReady, setRightCircleReady] = useState(true);
  const [leftAnimating, setLeftAnimating] = useState(false);
  const [rightAnimating, setRightAnimating] = useState(false);
  const [sequence, setSequence] = useState([]);

  const normaliseCoordinates = (x, y) => {
    const screenX = ((x + 1) / 2) * 100;
    const screenY = ((y + 1) / 2) * 100;
    return { x: screenX, y: screenY };
  };

  const isInLeftZone = (x) => x < 35;
  const isInRightZone = (x) => x > 65;
  const isInCenterZone = (x) => x >= 36 && x <= 64;

  const handleLeftAnimationComplete = () => {
    setSequence(prev => [...prev, "L"]);
    setLeftCircleReady(false);
    setLeftAnimating(false);
  };

  const handleRightAnimationComplete = () => {
    setSequence(prev => [...prev, "R"]);
    setRightCircleReady(false);
    setRightAnimating(false);
  };

  useEffect(() => {
    if (sequence.length >= 4) {
      const last4 = sequence.slice(-4);
      if (last4[0] === 'L' && 
          last4[1] === 'L' && 
          last4[2] === 'R' && 
          last4[3] === 'R') {
        setUnlocked(true);
      }
      console.log(sequence);
    }

    const x = coordinates.x;
    
    if (isInCenterZone(x) && !leftAnimating && !rightAnimating) {
      setLeftCircleReady(true);
      setRightCircleReady(true);
      setLeftAnimating(false);
      setRightAnimating(false);
    }
    if (isInLeftZone(x) && leftCircleReady)
        setLeftAnimating(true);
    if (isInRightZone(x) && rightCircleReady)
        setRightAnimating(true);
    
  }, [coordinates.x, sequence, setUnlocked]);

  useEffect(() => {
    const pollAPI = async () => {
      try {
        const response = await fetch('http://localhost:5000/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'omit'
        });
        
        const data = await response.json();
        if (data) {
          setCoordinates(normaliseCoordinates(-data.x, 0));
        }
      } catch (error) {}
    };

    const interval = setInterval(pollAPI, 100);
    pollAPI();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <style jsx global>{`
        @keyframes pulse-and-spin {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.25) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        .animate-pulse-and-spin {
          animation: pulse-and-spin 1s forwards;
        }
      `}</style>
      <div className="relative w-full h-full bg-[url('/assets/login_page.png')] bg-cover bg-center">
        {error && (
          <div className="absolute top-0 left-0 right-0 p-2 text-sm text-white bg-red-500">
            {error}
          </div>
        )}
        
        <Circle 
          side="left" 
          isActive={leftAnimating} 
          onAnimationComplete={handleLeftAnimationComplete}
        />
        
        <Circle 
          side="right" 
          isActive={rightAnimating}
          onAnimationComplete={handleRightAnimationComplete}
        />
      </div>
    </div>
  );
};

export default LockScreen;