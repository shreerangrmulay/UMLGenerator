import { useEffect } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function Toast() {
  const toast = useUMLStore((state) => state.toast);
  const clearToast = useUMLStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      clearToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="toast-icon text-success" size={20} />,
    error: <AlertCircle className="toast-icon text-danger" size={20} />,
    warning: <AlertTriangle className="toast-icon text-warning" size={20} />,
    info: <Info className="toast-icon text-info" size={20} />
  };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${toast.type || 'info'}`}>
        <div className="toast-content">
          {icons[toast.type || 'info']}
          <span className="toast-message">{toast.message}</span>
        </div>
        <button
          onClick={clearToast}
          className="toast-close"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
