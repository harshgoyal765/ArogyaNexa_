'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-tertiary" />,
  error: <XCircle size={18} className="text-error" />,
  warning: <AlertTriangle size={18} className="text-amber-600" />,
  info: <Info size={18} className="text-primary" />,
};

const styles = {
  success: 'border-l-4 border-tertiary bg-tertiary-fixed/20',
  error: 'border-l-4 border-error bg-error-container/20',
  warning: 'border-l-4 border-amber-500 bg-amber-50',
  info: 'border-l-4 border-primary bg-primary-fixed/20',
};

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl shadow-primary-md max-w-sm w-full transition-all duration-300',
        styles[type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <p className="text-sm text-on-surface flex-1 leading-relaxed">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-outline hover:text-on-surface flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}

// Toast Container
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let toastList: ToastItem[] = [];

export function showToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2);
  toastList = [...toastList, { id, message, type }];
  toastListeners.forEach((fn) => fn(toastList));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => { toastListeners = toastListeners.filter((fn) => fn !== setToasts); };
  }, []);

  const remove = (id: string) => {
    toastList = toastList.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(toastList));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} type={t.type} onClose={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
}
