"use client";

import React from "react";

const Window = ({ title, children, onClose }) => {
  return (
    <div className="bg-primary_red rounded-3xl shadow-lg max-w-fit max-h-fit p-5 relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
      </div>
      <div className="inline-flex">{children}</div>
    </div>
  );
};

export default Window;
