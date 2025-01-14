import { toast } from 'react-hot-toast';

const showToast = (type: 'success' | 'error' | 'info', message: string) => {
  // Ensure the type is valid and defaults to 'info' if not provided
  const toastType = ['success', 'error', 'info'].includes(type) ? type : 'info';
  if (toastType === 'success') {
    toast.success(message)
    } else if (toastType === 'error') {
      
    toast.error(message)
  }
};

export default showToast;
