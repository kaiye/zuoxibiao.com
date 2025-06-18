import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSchedule } from '../context/ScheduleContext'
import ScheduleCard from '../components/ScheduleCard'

const SchedulesPage = () => {
  const { schedules, openModal } = useSchedule()
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [audienceFilter, setAudienceFilter] = useState('all')

  // 获取所有分类
  const categories = ['all', ...new Set(schedules.map(s => s.category))]
  const audiences = ['all', ...new Set(schedules.flatMap(s => s.target_audience.split('、')))]

  // 应用筛选
  const filteredSchedules = schedules.filter(schedule => {
    const categoryMatch = categoryFilter === 'all' || schedule.category === categoryFilter
    const audienceMatch = audienceFilter === 'all' || schedule.target_audience.includes(audienceFilter)
    return categoryMatch && audienceMatch
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
              <label>分类筛选：</label>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-btn ${categoryFilter === category ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category === 'all' ? '全部' : category}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>目标人群：</label>
              <div className="filter-buttons">
                {audiences.map(audience => (
                  <button
                    key={audience}
                    className={`filter-btn ${audienceFilter === audience ? 'active' : ''}`}
                    onClick={() => setAudienceFilter(audience)}
                  >
                    {audience === 'all' ? '全部' : audience}
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
    </main>
  )
}

export default SchedulesPage