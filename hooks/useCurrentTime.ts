'use client'

import { useState, useEffect } from 'react'
import { getCurrentTimeString } from '@/lib/timeUtils'

export const useCurrentTime = (): string => {
  // 使用空字符串作为初始值，避免 SSR 水合不匹配
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeString())
    }

    // 客户端挂载后立即更新时间
    updateTime()

    // 每分钟更新一次
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return currentTime
}
