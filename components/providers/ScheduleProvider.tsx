'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { schedulesData, quotesData } from '@/lib/schedules'
import useToast from '@/hooks/useToast'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import type { Schedule, ScheduleItem, EditingState, ScheduleContextValue } from '@/types/schedule'

const ScheduleContext = createContext<ScheduleContextValue | null>(null)

interface ScheduleProviderProps {
  children: ReactNode
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)
  const [currentSchedule, setCurrentScheduleState] = useState<Schedule | null>(null)
  const [customSchedules, setCustomSchedules] = useState<Schedule[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSchedule, setModalSchedule] = useState<Schedule | null>(null)
  const [myPageEditingState, setMyPageEditingState] = useState<EditingState>({ isCreating: false, isEditing: false })
  const toast = useToast()

  // 客户端水合完成后加载数据
  useEffect(() => {
    setIsHydrated(true)

    // 加载自定义作息表
    try {
      const savedCustom = localStorage.getItem('customSchedules')
      if (savedCustom) {
        setCustomSchedules(JSON.parse(savedCustom))
      }
    } catch (error) {
      console.warn('无法加载自定义作息表:', error)
    }

    // 加载当前作息表
    try {
      const saved = localStorage.getItem('currentSchedule')
      if (saved) {
        const schedule = JSON.parse(saved)
        const found = schedulesData.find(s => s.id === schedule.id)
        if (found) {
          setCurrentScheduleState(found)
        } else {
          // 设置默认作息表
          setCurrentScheduleState(schedulesData[0])
        }
      } else {
        setCurrentScheduleState(schedulesData[0])
      }
    } catch (error) {
      console.warn('无法恢复保存的作息表:', error)
      setCurrentScheduleState(schedulesData[0])
    }
  }, [])

  // 当自定义作息表变化时，检查当前作息表
  useEffect(() => {
    if (!isHydrated) return

    try {
      const saved = localStorage.getItem('currentSchedule')
      if (saved) {
        const schedule = JSON.parse(saved)
        // 首先在预设作息表中查找
        const found = schedulesData.find(s => s.id === schedule.id)
        if (found) {
          setCurrentScheduleState(found)
        } else {
          // 在自定义作息表中查找
          const customFound = customSchedules.find(s => s.id === schedule.id)
          if (customFound) {
            setCurrentScheduleState(customFound)
          }
        }
      }
    } catch (error) {
      console.warn('无法恢复保存的作息表:', error)
    }
  }, [customSchedules, isHydrated])

  // 设置当前作息表
  const handleSetSchedule = useCallback((schedule: Schedule) => {
    setCurrentScheduleState(schedule)
    localStorage.setItem('currentSchedule', JSON.stringify(schedule))
    console.log('设置新的作息表:', schedule.title)
  }, [])

  // 打开模态框
  const handleOpenModal = useCallback((schedule: Schedule) => {
    setModalSchedule(schedule)
    setIsModalOpen(true)
  }, [])

  // 关闭模态框
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setModalSchedule(null)
  }, [])

  // 使用模态框中的作息表
  const handleUseSchedule = useCallback(() => {
    if (modalSchedule) {
      handleSetSchedule(modalSchedule)
      handleCloseModal()
      router.push('/')
    }
  }, [modalSchedule, handleSetSchedule, handleCloseModal, router])

  // 添加自定义作息表
  const addCustomSchedule = useCallback((schedule: Schedule) => {
    const newCustomSchedules = [...customSchedules, schedule]
    setCustomSchedules(newCustomSchedules)
    localStorage.setItem('customSchedules', JSON.stringify(newCustomSchedules))
  }, [customSchedules])

  // 删除自定义作息表
  const deleteCustomSchedule = useCallback((scheduleId: string) => {
    const filteredSchedules = customSchedules.filter(s => s.id !== scheduleId)
    setCustomSchedules(filteredSchedules)
    localStorage.setItem('customSchedules', JSON.stringify(filteredSchedules))

    // 如果删除的是当前使用的作息表，切换到默认作息表
    if (currentSchedule && currentSchedule.id === scheduleId) {
      setCurrentScheduleState(schedulesData[0])
      localStorage.setItem('currentSchedule', JSON.stringify(schedulesData[0]))
    }
  }, [customSchedules, currentSchedule])

  // 更新自定义作息表
  const updateCustomSchedule = useCallback((updatedSchedule: Schedule) => {
    const updatedSchedules = customSchedules.map(schedule =>
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    )
    setCustomSchedules(updatedSchedules)
    localStorage.setItem('customSchedules', JSON.stringify(updatedSchedules))

    // 如果更新的是当前使用的作息表，同步更新当前作息表
    if (currentSchedule && currentSchedule.id === updatedSchedule.id) {
      setCurrentScheduleState(updatedSchedule)
      localStorage.setItem('currentSchedule', JSON.stringify(updatedSchedule))
    }
  }, [customSchedules, currentSchedule])

  // 处理来自Modal的自定义请求
  const handleCustomizeFromModal = useCallback((scheduleData: { title: string; schedule: ScheduleItem[] }) => {
    // 存储到localStorage供MyPage使用
    localStorage.setItem('scheduleToCustomize', JSON.stringify(scheduleData))

    // 如果当前在我的页面，直接设置状态
    if (typeof window !== 'undefined' && (window.location.pathname === '/my' || window.location.pathname === '/my/')) {
      setMyPageEditingState({ isCreating: true, isEditing: false })
    }
  }, [])

  const contextValue: ScheduleContextValue = {
    currentSchedule,
    schedules: schedulesData,
    customSchedules,
    quotes: quotesData,
    setCurrentSchedule: handleSetSchedule,
    addCustomSchedule,
    updateCustomSchedule,
    deleteCustomSchedule,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    useSchedule: handleUseSchedule,
    myPageEditingState,
    setMyPageEditingState,
    handleCustomizeFromModal,
    toast
  }

  // 在水合完成前不渲染子组件，避免 SSR 不匹配
  if (!isHydrated) {
    return null
  }

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
      {/* Modal 在 Provider 内部渲染 */}
      {isModalOpen && modalSchedule && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          schedule={modalSchedule}
          onUseSchedule={handleUseSchedule}
        />
      )}
      {/* Toast 通知 */}
      {toast.toasts.map(toastItem => (
        <Toast
          key={toastItem.id}
          message={toastItem.message}
          type={toastItem.type as 'success' | 'error' | 'warning' | 'info'}
          isVisible={toastItem.isVisible}
          onClose={() => toast.hideToast(toastItem.id)}
          duration={0}
        />
      ))}
    </ScheduleContext.Provider>
  )
}

export const useSchedule = (): ScheduleContextValue => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}

export default ScheduleContext
