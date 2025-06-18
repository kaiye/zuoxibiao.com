import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SchedulesPage from './pages/SchedulesPage'
import Modal from './components/Modal'
import { schedulesData, quotesData } from './data/schedules'
import { ScheduleProvider } from './context/ScheduleContext'

function App() {
  const [currentSchedule, setCurrentSchedule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSchedule, setModalSchedule] = useState(null)

  // 初始化时加载保存的作息表
  useEffect(() => {
    try {
      const saved = localStorage.getItem('currentSchedule')
      if (saved) {
        const schedule = JSON.parse(saved)
        const found = schedulesData.schedules.find(s => s.id === schedule.id)
        if (found) {
          setCurrentSchedule(found)
        } else {
          setCurrentSchedule(schedulesData.schedules[0])
        }
      } else {
        setCurrentSchedule(schedulesData.schedules[0])
      }
    } catch (error) {
      console.warn('无法恢复保存的作息表:', error)
      setCurrentSchedule(schedulesData.schedules[0])
    }
  }, [])

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
    }
  }

  const contextValue = {
    currentSchedule,
    schedules: schedulesData.schedules,
    quotes: quotesData,
    setCurrentSchedule: handleSetSchedule,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    useSchedule: handleUseSchedule
  }

  return (
    <ScheduleProvider value={contextValue}>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/schedules.html" element={<SchedulesPage />} />
        </Routes>
        <Footer />
        
        {/* 全局模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          schedule={modalSchedule}
          onUseSchedule={handleUseSchedule}
        />
      </div>
    </ScheduleProvider>
  )
}

export default App