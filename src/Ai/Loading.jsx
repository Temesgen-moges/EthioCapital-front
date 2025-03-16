import React from "react";

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-start mt-4">
      <div className="max-w-[80%] p-3 rounded-2xl bg-teal-50 text-teal-800 rounded-tl-none border-l-4 border-teal-600">
        <div className="font-medium mb-1 text-teal-800">
          Ethio Capital
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "600ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;