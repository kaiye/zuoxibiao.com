'use client'

import { useEffect, useRef, useState } from 'react'
import { getCurrentTimeInMinutes, parseTimeRange } from '@/lib/timeUtils'
import type { Schedule, ScheduleItem } from '@/types/schedule'

interface NextActivity extends ScheduleItem {
  timeDiff: number
  startTime: number
}

interface NotificationsHook {
  hasPermission: boolean
  enableNotifications: () => Promise<boolean>
  isSupported: boolean
}

const useNotifications = (currentSchedule: Schedule | null): NotificationsHook => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const lastNotifiedActivity = useRef<string | null>(null)

  // 检查通知支持（客户端）
  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'Notification' in window)
  }, [])

  // 请求通知权限
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      const granted = permission === 'granted'
      setHasPermission(granted)
      return granted
    }
    return false
  }

  // 发送通知
  const sendNotification = (title: string, body: string, icon?: string) => {
    if (hasPermission && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const notification = new Notification(title, {
          body,
          icon: icon || '/favicon.png',
          badge: '/favicon.png',
          silent: false,
          requireInteraction: false,
          tag: 'schedule-reminder'
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        // 5秒后自动关闭通知
        setTimeout(() => {
          notification.close()
        }, 5000)

        return notification
      } catch {
        return null
      }
    }
    return null
  }

  // 查找下一个活动
  const findNextActivity = (schedule: ScheduleItem[], currentTime: number): NextActivity | null => {
    if (!schedule || !Array.isArray(schedule)) return null

    let nextActivity: NextActivity | null = null
    let minTimeDiff = Infinity

    for (const item of schedule) {
      const timeRange = parseTimeRange(item.time)
      if (!timeRange) continue

      const { start } = timeRange
      let timeDiff = start - currentTime

      // 处理跨天的情况
      if (timeDiff < 0) {
        timeDiff += 24 * 60 // 加上一天的分钟数
      }

      if (timeDiff > 0 && timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff
        nextActivity = { ...item, timeDiff, startTime: start }
      }
    }

    return nextActivity
  }

  // 格式化时间显示
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // 检查是否需要发送提醒通知
  useEffect(() => {
    if (!currentSchedule?.schedule) return

    const checkForUpcomingActivity = () => {
      if (!hasPermission) return

      const currentTime = getCurrentTimeInMinutes()
      const nextActivity = findNextActivity(currentSchedule.schedule, currentTime)

      // 在还有1分钟以内且大于0分钟时提醒
      if (nextActivity && nextActivity.timeDiff <= 1 && nextActivity.timeDiff > 0) {
        // 确保不重复发送同一个活动的通知
        const activityKey = `${nextActivity.time}-${nextActivity.activity}`
        if (lastNotifiedActivity.current !== activityKey) {
          const startTimeStr = formatTime(nextActivity.startTime)
          sendNotification(
            '🔔 作息提醒',
            `即将开始：${startTimeStr} ${nextActivity.activity}\n${nextActivity.description}`,
            '/favicon.png'
          )
          lastNotifiedActivity.current = activityKey
        }
      }
    }

    // 初始化时检查权限状态
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      setHasPermission(true)
    }

    // 每30秒检查一次
    const interval = setInterval(checkForUpcomingActivity, 30000)

    // 立即检查一次
    checkForUpcomingActivity()

    return () => clearInterval(interval)
  }, [currentSchedule, hasPermission])

  // 手动请求权限的函数
  const enableNotifications = async (): Promise<boolean> => {
    const granted = await requestNotificationPermission()
    if (granted) {
      sendNotification(
        '🎉 通知已开启',
        '您将在活动开始前1分钟收到提醒',
        '/favicon.png'
      )
    }
    return granted
  }

  return {
    hasPermission,
    enableNotifications,
    isSupported
  }
}

export default useNotifications
