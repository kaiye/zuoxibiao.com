'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Timeline from './Timeline'
import Recommendations from './Recommendations'
import { useSchedule } from '@/components/providers/ScheduleProvider'
import type { Schedule } from '@/types/schedule'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  schedule: Schedule
  onUseSchedule: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, schedule, onUseSchedule }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { customSchedules, myPageEditingState, handleCustomizeFromModal } = useSchedule()

  // ESC键关闭模态框
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
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

  // 检查是否可以创建自定义作息表
  const canCreateCustom = customSchedules.length < 2 && !myPageEditingState?.isCreating && !myPageEditingState?.isEditing

  // 处理自定义按钮点击
  const handleCustomizeSchedule = () => {
    const scheduleToCustomize = {
      title: `基于 ${schedule.title}`,
      schedule: schedule.schedule
    }

    // 使用Context函数处理自定义请求
    handleCustomizeFromModal(scheduleToCustomize)

    // 关闭弹窗
    onClose()

    // 如果不在我的页面，则跳转
    if (pathname !== '/my' && pathname !== '/my/') {
      router.push('/my')
    }
  }

  // 早期返回检查
  if (!isOpen || !schedule) return null

  // 处理来源点击
  const handleSourceClick = () => {
    if (schedule.source === '我的') {
      // 关闭弹窗
      onClose()
      // 跳转到我的页面
      if (pathname !== '/my' && pathname !== '/my/') {
        router.push('/my')
      }
    }
  }

  // 显示来源文本
  const getSourceText = (): string => {
    return schedule.source
  }

  // 检查是否是自定义来源
  const isCustomSource = schedule.source === '我的'

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
              {isCustomSource ? (
                <span
                  style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
                  onClick={handleSourceClick}
                >
                  {getSourceText()}
                </span>
              ) : (
                <a href={schedule.source_url} target="_blank" rel="noopener noreferrer">
                  <span>{getSourceText()}</span>
                </a>
              )}
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
          {canCreateCustom && (
            <button className="btn btn-secondary" onClick={handleCustomizeSchedule}>
              基于此自定义
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
