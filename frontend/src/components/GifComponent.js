"use client";

import React, { useEffect, useState } from "react";

const GifComponent = ({ gifIdIn }) => {
  const [gifUrl, setGifUrl] = useState("");
  const gifId = gifIdIn; // The GIF ID extracted from the URL
  const apiKey = "o3dKvDjJ892vvYuKTWx0Fv6Ym6p1dJIB";

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`,
        );
        const data = await response.json();
        if (data.data) {
          setGifUrl(data.data.images.fixed_height.url); // Getting the fixed height URL for the GIF
        }
      } catch (error) {
        console.error("Error fetching the GIF:", error);
      }
    };

    fetchGif();
  }, [apiKey, gifId]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {gifUrl ? (
        <img src={gifUrl} alt="Giphy GIF" className="rounded-lg shadow-lg" />
      ) : (
        <p>Scanning...</p>
      )}
    </div>
  );
};

export default GifComponent;
