const SpinningComponent = ({ image, size = 50, speed = 2 }) => {
  return (
    <div className="absolute" style={{ width: size, height: size }}>
      <img 
        src={image} 
        alt="Spinning Element" 
        className="w-full h-full object-contain"
        style={{ animation: `spin ${speed}s linear infinite` }}
      />
    </div>
  );
};