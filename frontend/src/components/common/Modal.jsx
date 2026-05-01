import React, { useEffect } from 'react';

/**
 * Generic Modal wrapper
 * Usage: <Modal isOpen={bool} onClose={fn} title="Title">...</Modal>
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col animate-slide-up`}>
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
              ✕
            </button>
          </div>
        )}
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
