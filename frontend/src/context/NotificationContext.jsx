import React, { createContext, useCallback, useContext, useReducer } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
// toast: { id, type ('success'|'error'|'warning'|'info'), message, duration }
// notification: { id, type, title, message, read, createdAt }

let _nextId = 1
const uid = () => _nextId++

const initialState = {
  toasts: [],
  notifications: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) }
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      }
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) }
    case 'CLEAR_ALL':
      return { ...state, notifications: [] }
    default:
      return state
  }
}

export const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // ── Toast API ───────────────────────────────────────────────────────────────
  const showToast = useCallback((type, message, duration = 4000) => {
    const id = uid()
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message, duration } })
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), duration)
    }
    return id
  }, [])

  const toast = {
    success: (msg, dur) => showToast('success', msg, dur),
    error:   (msg, dur) => showToast('error',   msg, dur),
    warning: (msg, dur) => showToast('warning', msg, dur),
    info:    (msg, dur) => showToast('info',    msg, dur),
  }

  const dismissToast = useCallback((id) => dispatch({ type: 'REMOVE_TOAST', id }), [])

  // ── In-app notification API ─────────────────────────────────────────────────
  const addNotification = useCallback((type, title, message) => {
    const id = uid()
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id, type, title, message, read: false, createdAt: new Date() },
    })
    return id
  }, [])

  const markRead = useCallback((id) => dispatch({ type: 'MARK_READ', id }), [])
  const markAllRead = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), [])
  const removeNotification = useCallback((id) => dispatch({ type: 'REMOVE_NOTIFICATION', id }), [])
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), [])

  const unreadCount = state.notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        toasts: state.toasts,
        notifications: state.notifications,
        unreadCount,
        toast,
        dismissToast,
        addNotification,
        markRead,
        markAllRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
