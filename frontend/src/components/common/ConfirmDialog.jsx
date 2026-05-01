import React from 'react';

/**
 * Inline confirmation dialog (replaces window.confirm)
 * Usage:
 *   <ConfirmDialog
 *     isOpen={showConfirm}
 *     onConfirm={handleDelete}
 *     onCancel={() => setShowConfirm(false)}
 *     title="Delete Product?"
 *     message="This action cannot be undone."
 *     confirmLabel="Delete"
 *     danger
 *   />
 */
const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  danger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
        <div className="text-center mb-5">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 ${
            danger ? 'bg-red-50' : 'bg-yellow-50'
          }`}>
            {danger ? '🗑️' : '⚠️'}
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 btn-outline text-sm py-2">
            {cancelLabel}
          </button>
          <button onClick={onConfirm}
            className={`flex-1 text-sm py-2 rounded-xl font-semibold transition-all active:scale-95 ${
              danger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
