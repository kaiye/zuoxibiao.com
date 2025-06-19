import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SchedulesPage from './pages/SchedulesPage'
import MyPage from './pages/MyPage'
import Modal from './components/Modal'
import Toast from './components/Toast'
import { schedulesData, quotesData } from './data/schedules'
import { ScheduleProvider } from './context/ScheduleContext'
import useToast from './hooks/useToast'

function App() {
  const navigate = useNavigate()
  const [currentSchedule, setCurrentSchedule] = useState(null)
  const [customSchedules, setCustomSchedules] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSchedule, setModalSchedule] = useState(null)
  const [myPageEditingState, setMyPageEditingState] = useState({ isCreating: false, isEditing: false })
  const toast = useToast()

  // 初始化时加载自定义作息表
  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem('customSchedules')
      if (savedCustom) {
        setCustomSchedules(JSON.parse(savedCustom))
      }
    } catch (error) {
      console.warn('无法加载自定义作息表:', error)
    }
  }, [])

  // 初始化时加载当前作息表
  useEffect(() => {
    try {
      const saved = localStorage.getItem('currentSchedule')
      if (saved) {
        const schedule = JSON.parse(saved)
        // 首先在预设作息表中查找
        const found = schedulesData.schedules.find(s => s.id === schedule.id)
        if (found) {
          setCurrentSchedule(found)
        } else {
          // 在自定义作息表中查找
          const customFound = customSchedules.find(s => s.id === schedule.id)
          if (customFound) {
            setCurrentSchedule(customFound)
          } else {
            setCurrentSchedule(schedulesData.schedules[0])
          }
        }
      } else {
        setCurrentSchedule(schedulesData.schedules[0])
      }
    } catch (error) {
      console.warn('无法恢复保存的作息表:', error)
      setCurrentSchedule(schedulesData.schedules[0])
    }
  }, [customSchedules])

  // 设置当前作息表
  const handleSetSchedule = (schedule) => {
    setCurrentSchedule(schedule)
    localStorage.setItem('currentSchedule', JSON.stringify(schedule))
    console.log('设置新的作息表:', schedule.title)
  }

  // 打开模态框
  const handleOpenModal = (schedule) => {
    setModalSchedule(schedule)
    setIsModalOpen(true)
  }

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalSchedule(null)
  }

  // 使用模态框中的作息表
  const handleUseSchedule = () => {
    if (modalSchedule) {
      handleSetSchedule(modalSchedule)
      handleCloseModal()
      navigate('/')
    }
  }

  // 添加自定义作息表
  const addCustomSchedule = (schedule) => {
    const newCustomSchedules = [...customSchedules, schedule]
    setCustomSchedules(newCustomSchedules)
    localStorage.setItem('customSchedules', JSON.stringify(newCustomSchedules))
  }

  // 删除自定义作息表
  const deleteCustomSchedule = (scheduleId) => {
    const filteredSchedules = customSchedules.filter(s => s.id !== scheduleId)
    setCustomSchedules(filteredSchedules)
    localStorage.setItem('customSchedules', JSON.stringify(filteredSchedules))
    
    // 如果删除的是当前使用的作息表，切换到默认作息表
    if (currentSchedule && currentSchedule.id === scheduleId) {
      setCurrentSchedule(schedulesData.schedules[0])
      localStorage.setItem('currentSchedule', JSON.stringify(schedulesData.schedules[0]))
    }
  }

  // 更新自定义作息表
  const updateCustomSchedule = (updatedSchedule) => {
    const updatedSchedules = customSchedules.map(schedule => 
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    )
    setCustomSchedules(updatedSchedules)
    localStorage.setItem('customSchedules', JSON.stringify(updatedSchedules))
    
    // 如果更新的是当前使用的作息表，同步更新当前作息表
    if (currentSchedule && currentSchedule.id === updatedSchedule.id) {
      setCurrentSchedule(updatedSchedule)
      localStorage.setItem('currentSchedule', JSON.stringify(updatedSchedule))
    }
  }

  // 处理来自Modal的自定义请求
  const handleCustomizeFromModal = (scheduleData) => {
    // 存储到localStorage供MyPage使用
    localStorage.setItem('scheduleToCustomize', JSON.stringify(scheduleData))
    
    // 如果当前在我的页面，直接设置状态
    if (window.location.pathname === '/my' || window.location.pathname === '/my.html') {
      // 触发MyPage的状态更新
      setMyPageEditingState({ isCreating: true, isEditing: false })
    }
  }

  const contextValue = {
    currentSchedule,
    schedules: schedulesData.schedules,
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

  return (
    <ScheduleProvider value={contextValue}>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/schedules.html" element={<SchedulesPage />} />
          <Route path="/my.html" element={<MyPage />} />
        </Routes>
        <Footer />
        
        {/* 全局模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          schedule={modalSchedule}
          onUseSchedule={handleUseSchedule}
        />
        
        {/* Toast通知 */}
        {toast.toasts.map(toastItem => (
          <Toast
            key={toastItem.id}
            message={toastItem.message}
            type={toastItem.type}
            isVisible={toastItem.isVisible}
            onClose={() => toast.hideToast(toastItem.id)}
            duration={0} // 由useToast管理时间
          />
        ))}
      </div>
    </ScheduleProvider>
  )
}

export default App