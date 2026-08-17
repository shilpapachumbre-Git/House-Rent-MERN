import React, { useEffect } from "react";

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success"? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl z-[9999] flex items-center gap-3 animate-bounce`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:scale-125 transition">X</button>
    </div>
  );
};

export default Toast;