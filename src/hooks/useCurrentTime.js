import { useState, useEffect } from 'react'
import { getCurrentTimeString } from '../utils/timeUtils'

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString())

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeString())
    }

    // 立即更新一次
    updateTime()

    // 每分钟更新一次
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return currentTime
}