import React from "react";
import { useNavigate } from "react-router-dom";

function CustomAlert({ message, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex flex-col items-center">
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
          >
            OK
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomAlert;
