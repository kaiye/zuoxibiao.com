import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSchedule } from '../context/ScheduleContext'
import ScheduleCard from '../components/ScheduleCard'
import NotificationSettings from '../components/NotificationSettings'

const SchedulesPage = () => {
  const { schedules, currentSchedule, openModal } = useSchedule()
  const navigate = useNavigate()
  const [ageGroupFilter, setAgeGroupFilter] = useState('all')
  const [scenarioFilter, setScenarioFilter] = useState('all')

  // 获取所有分类
  const ageGroups = ['all', '儿童', '青少年', '成年人', '老年人']
  const scenarios = ['all', '学生', '上班族', '自由职业者', '创业者', '运动员', '其他']

  // 应用筛选
  const filteredSchedules = schedules.filter(schedule => {
    const ageGroupMatch = ageGroupFilter === 'all' || schedule.age_group === ageGroupFilter
    const scenarioMatch = scenarioFilter === 'all' || schedule.scenario === scenarioFilter
    return ageGroupMatch && scenarioMatch
  })

  const handleCardClick = (schedule) => {
    openModal(schedule)
  }

  return (
    <main className="main-content">
      {/* 页面标题 */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">选择适合您的作息时间表</h1>
          <p className="page-subtitle">从权威机构和成功人士的作息建议中找到最适合您的时间安排</p>
        </div>
      </section>

      {/* 作息表筛选区域 */}
      <section className="schedules-section">
        <div className="container">
          {/* 筛选器 */}
          <div className="filter-container">
            <div className="filter-group">
              <label>年龄段：</label>
              <div className="filter-buttons">
                {ageGroups.map(ageGroup => (
                  <button
                    key={ageGroup}
                    className={`filter-btn ${ageGroupFilter === ageGroup ? 'active' : ''}`}
                    onClick={() => setAgeGroupFilter(ageGroup)}
                  >
                    {ageGroup === 'all' ? '全部' : ageGroup}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>场景：</label>
              <div className="filter-buttons">
                {scenarios.map(scenario => (
                  <button
                    key={scenario}
                    className={`filter-btn ${scenarioFilter === scenario ? 'active' : ''}`}
                    onClick={() => setScenarioFilter(scenario)}
                  >
                    {scenario === 'all' ? '全部' : scenario}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 作息表卡片列表 */}
          <div className="schedule-cards">
            {filteredSchedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {filteredSchedules.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>没有找到符合条件的作息表，请调整筛选条件。</p>
            </div>
          )}
        </div>
      </section>

      {/* 通知设置 */}
      {currentSchedule && (
        <section className="notification-section" style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-12) 0' }}>
          <div className="container">
            <NotificationSettings currentSchedule={currentSchedule} />
          </div>
        </section>
      )}
    </main>
  )
}

export default SchedulesPage