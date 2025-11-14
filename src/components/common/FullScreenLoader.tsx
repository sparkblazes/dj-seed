import React from "react";
import { createPortal } from "react-dom";

interface FullScreenLoaderProps {
  show: boolean;
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ show, message }) => {
  if (!show) return null;

  return createPortal(
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 2000,
      }}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-primary fw-semibold">{message}</p>}
    </div>,
    document.body
  );
};

export default FullScreenLoader;
