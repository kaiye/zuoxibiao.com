import { useEffect, useRef, useState } from 'react'
import { getCurrentTimeInMinutes, parseTimeRange } from '../utils/timeUtils'

const useNotifications = (currentSchedule) => {
  const [hasPermission, setHasPermission] = useState(false)
  const lastNotifiedActivity = useRef(null)

  // 请求通知权限
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      const granted = permission === 'granted'
      setHasPermission(granted)
      return granted
    }
    return false
  }

  // 发送通知
  const sendNotification = (title, body, icon) => {
    if (hasPermission && 'Notification' in window) {
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
      } catch (error) {
        return null
      }
    }
    return null
  }

  // 查找下一个活动
  const findNextActivity = (schedule, currentTime) => {
    if (!schedule || !Array.isArray(schedule)) return null

    let nextActivity = null
    let minTimeDiff = Infinity

    for (let item of schedule) {
      const timeRange = parseTimeRange(item.time)
      if (!timeRange) continue

      let { start } = timeRange
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
  const formatTime = (minutes) => {
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
    if ('Notification' in window && Notification.permission === 'granted') {
      setHasPermission(true)
    }

    // 每30秒检查一次
    const interval = setInterval(checkForUpcomingActivity, 30000)

    // 立即检查一次
    checkForUpcomingActivity()

    return () => clearInterval(interval)
  }, [currentSchedule, hasPermission])

  // 手动请求权限的函数
  const enableNotifications = async () => {
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
    isSupported: 'Notification' in window
  }
}

export default useNotifications