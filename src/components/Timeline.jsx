import React from 'react'
import { getCurrentTimeInMinutes, isCurrentTimeSlot } from '../utils/timeUtils'

const Timeline = ({ schedule }) => {
  if (!schedule || !schedule.schedule || schedule.schedule.length === 0) {
    return (
      <div className="schedule-timeline">
        <h3>时间安排</h3>
        <p>暂无具体时间安排</p>
      </div>
    )
  }

  const currentTime = getCurrentTimeInMinutes()

  return (
    <div className="schedule-timeline">
      <h3>时间安排</h3>
      {schedule.schedule.map((item, index) => {
        const isCurrent = isCurrentTimeSlot(item.time, currentTime)
        return (
          <div 
            key={index} 
            className={`timeline-item ${isCurrent ? 'current' : ''}`}
          >
            <div className="timeline-time">{item.time}</div>
            <div className="timeline-content">
              <div className="timeline-activity">{item.activity}</div>
              <div className="timeline-description">{item.description}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline