import React from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

const STYLES = {
  success: {
    bar: 'bg-green-500',
    icon: <CheckCircle size={20} className="shrink-0 text-green-600" />,
    bg: 'bg-white border-l-4 border-green-500',
    title: 'text-green-700',
  },
  error: {
    bar: 'bg-red-500',
    icon: <XCircle size={20} className="shrink-0 text-red-500" />,
    bg: 'bg-white border-l-4 border-red-500',
    title: 'text-red-700',
  },
  warning: {
    bar: 'bg-yellow-400',
    icon: <AlertTriangle size={20} className="shrink-0 text-yellow-500" />,
    bg: 'bg-white border-l-4 border-yellow-400',
    title: 'text-yellow-700',
  },
  info: {
    bar: 'bg-blue-500',
    icon: <Info size={20} className="shrink-0 text-blue-500" />,
    bg: 'bg-white border-l-4 border-blue-500',
    title: 'text-blue-700',
  },
}

const Toast = ({ toast, onDismiss }) => {
  const s = STYLES[toast.type] || STYLES.info

  return (
    <div
      className={`${s.bg} flex w-80 items-start gap-3 rounded-lg px-4 py-3 shadow-lg animate-slide-in`}
      role="alert"
    >
      {s.icon}
      <p className={`flex-1 text-sm font-medium ${s.title}`}>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}

const ToastContainer = () => {
  const { toasts, dismissToast } = useNotification()

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

export default ToastContainer
