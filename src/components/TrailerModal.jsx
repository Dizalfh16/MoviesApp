import React, { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";

function TrailerModal({ isOpen, onClose, trailerKey }) {
  // Cegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !trailerKey) return null;

  // Tutup modal saat background luar di-klik
  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  return (
    <div
      id="modal-background"
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 animate-fade-in"
    >
      <div className="relative w-full max-w-5xl bg-black rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-scale-up">
        {/* Header / Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/20"
        >
          <HiXMark className="text-2xl" />
        </button>

        {/* Video Container (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
