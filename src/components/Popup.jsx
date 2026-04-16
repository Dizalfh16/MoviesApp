import React from 'react';

function Popup({ isVisible, message, type = 'success', onClose }) {
  if (!isVisible) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className={`bg-[#111827] border p-6 rounded-2xl max-w-xs w-full mx-5 text-center transform scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)]
        ${isSuccess ? 'border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 'border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)]'}
      `}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 
          ${isSuccess ? 'bg-blue-500/20 border-blue-500/30' : 'bg-red-500/20 border-red-500/30'}
        `}>
          <span className="text-3xl">{isSuccess ? '✅' : '⚠️'}</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{isSuccess ? 'Mantap!' : 'Peringatan'}</h2>
        <p className="text-gray-400 mb-6 text-sm">{message}</p>

        {isSuccess ? (
          <div className="flex justify-center mt-2 pb-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <button 
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-bold transition shadow-lg"
          >
            Mengerti
          </button>
        )}
      </div>
    </div>
  );
}

export default Popup;
