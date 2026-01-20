'use client'

import { useState, useCallback } from 'react'
import type { Toast, ToastType, ToastHook } from '@/types/schedule'

const useToast = (): ToastHook => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3000): number => {
    const id = Date.now() + Math.random()
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      isVisible: true
    }

    setToasts(prev => [...prev, toast])

    // 自动移除toast
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration + 300) // 添加额外时间以完成动画
    }

    return id
  }, [])

  const hideToast = useCallback((id: number) => {
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    )

    // 延迟移除以允许动画完成
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }, [showToast])

  const error = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }, [showToast])

  const warning = useCallback((message: string, duration?: number) => {
    return showToast(message, 'warning', duration)
  }, [showToast])

  const info = useCallback((message: string, duration?: number) => {
    return showToast(message, 'info', duration)
  }, [showToast])

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }
}

export default useToast
