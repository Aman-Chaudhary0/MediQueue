import React, { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck, ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext'

const TYPE_DOT = {
  success: 'bg-green-500',
  error:   'bg-red-500',
  warning: 'bg-yellow-400',
  info:    'bg-blue-500',
}

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const NotificationBell = () => {
  const navigate = useNavigate()
  const { notifications, unreadCount, markRead, markAllRead, removeNotification } = useNotification()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const recent = notifications.slice(0, 5)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="relative flex items-center justify-center rounded-xl bg-gray-50 p-2.5 hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-semibold text-gray-800">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {recent.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400">No notifications yet</p>
            ) : (
              recent.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition hover:bg-gray-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[n.type] || 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 truncate">{n.message}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">{timeAgo(n.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeNotification(n.id) }}
                    className="shrink-0 text-gray-300 hover:text-gray-500"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2">
            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/notifications') }}
              className="flex w-full items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:underline py-1"
            >
              View all notifications <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
