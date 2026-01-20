import type { TimeRange, ScheduleItem } from '@/types/schedule'

// 获取当前时间（分钟数）
export const getCurrentTimeInMinutes = (): number => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

// 格式化当前时间显示
export const getCurrentTimeString = (): string => {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// 解析单个时间为分钟数
export const parseTime = (timeStr: string): number | null => {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) return null
    return hours * 60 + minutes
  } catch {
    return null
  }
}

// 解析时间范围
export const parseTimeRange = (timeRange: string): TimeRange | null => {
  try {
    // 处理单个时间点（如 "7:30"）
    if (!timeRange.includes('-')) {
      const minutes = parseTime(timeRange)
      return minutes !== null ? { start: minutes, end: minutes + 30 } : null // 默认持续30分钟
    }

    // 处理时间范围（如 "7:30-8:00"）
    const [startStr, endStr] = timeRange.split('-').map(t => t.trim())
    const start = parseTime(startStr)
    const end = parseTime(endStr)

    if (start !== null && end !== null) {
      return { start, end }
    }
  } catch {
    console.warn('无法解析时间范围:', timeRange)
  }

  return null
}

// 判断是否为当前时间段
export const isCurrentTimeSlot = (timeRange: string, currentTime: number): boolean => {
  const times = parseTimeRange(timeRange)
  if (!times) return false

  const { start, end } = times

  // 处理跨天的情况（如 23:00-1:00）
  if (start > end) {
    return currentTime >= start || currentTime <= end
  } else {
    return currentTime >= start && currentTime <= end
  }
}

// 查找当前时间应该进行的活动
export const findCurrentActivity = (schedule: ScheduleItem[], currentTime: number): ScheduleItem | null => {
  if (!schedule || !Array.isArray(schedule)) return null

  for (const item of schedule) {
    if (isCurrentTimeSlot(item.time, currentTime)) {
      return item
    }
  }
  return null
}
