import toast from 'react-hot-toast';

/**
 * Wrapper around react-hot-toast for consistent notifications
 */
export const notify = {
  success: (msg) => toast.success(msg, {
    style: { borderRadius: '12px', fontSize: '14px' },
    iconTheme: { primary: '#16a34a', secondary: '#fff' },
  }),

  error: (msg) => toast.error(msg, {
    style: { borderRadius: '12px', fontSize: '14px' },
    iconTheme: { primary: '#ef4444', secondary: '#fff' },
  }),

  loading: (msg) => toast.loading(msg, {
    style: { borderRadius: '12px', fontSize: '14px' },
  }),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, messages = {}) =>
    toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Done!',
      error:   messages.error   || 'Something went wrong.',
    }),
};

export default notify;
