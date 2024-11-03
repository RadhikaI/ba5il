import React from "react";

const TextPopup = ({ texts, currentIndex, onClose, onPrevious, onNext }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg relative max-w-md w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-white pr-3 pt-3"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="w-full p-10 text-black h-80 max-h-80 overflow-y-auto">
          {texts[currentIndex]}
        </div>
        <button
          onClick={onPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black p-2"
        >
          &#9664;
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black p-2"
        >
          &#9654;
        </button>
      </div>
    </div>
  );
};

export default TextPopup;
