import React from 'react'
import { useSchedule } from '../context/ScheduleContext'

const ScheduleCard = ({ schedule, onClick }) => {
  const { currentSchedule } = useSchedule()
  const isCurrentSchedule = currentSchedule && currentSchedule.id === schedule.id

  return (
    <div className={`schedule-card ${isCurrentSchedule ? 'current' : ''}`} onClick={() => onClick(schedule)}>
      {isCurrentSchedule && <div className="current-badge">使用中</div>}
      <div className="card-header">
        <h3 className="card-title">{schedule.title}</h3>
        <div className="card-meta">
          <span className="card-category">{schedule.category}</span>
          <span className="card-audience">{schedule.target_audience}</span>
        </div>
      </div>
      <p className="card-description">{schedule.description}</p>
      <p className="card-source">来源：{schedule.source}</p>
    </div>
  )
}

export default ScheduleCard