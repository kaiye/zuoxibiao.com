import React, { useEffect } from 'react'
import Timeline from './Timeline'
import Recommendations from './Recommendations'

const Modal = ({ isOpen, onClose, schedule, onUseSchedule }) => {
  // ESC键关闭模态框
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // 阻止body滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !schedule) return null

  return (
    <div className="modal show">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{schedule.title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="schedule-info">
            <div className="info-row">
              <span className="info-label">分类：</span>
              <span>{schedule.category}</span>
            </div>
            <div className="info-row">
              <span className="info-label">目标人群：</span>
              <span>{schedule.target_audience}</span>
            </div>
            <div className="info-row">
              <span className="info-label">来源：</span>
              <a href={schedule.source_url} target="_blank" rel="noopener noreferrer">
                <span>{schedule.source}</span>
              </a>
            </div>
            <div className="info-row">
              <span className="info-label">描述：</span>
              <span>{schedule.description}</span>
            </div>
          </div>
          
          <Timeline schedule={schedule} />
          <Recommendations schedule={schedule} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onUseSchedule}>
            使用此作息表
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal