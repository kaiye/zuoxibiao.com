import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSchedule } from '../context/ScheduleContext'
import { useCurrentTime } from '../hooks/useCurrentTime'
import { getCurrentTimeInMinutes, findCurrentActivity } from '../utils/timeUtils'
import Timeline from '../components/Timeline'
import Recommendations from '../components/Recommendations'

const HomePage = () => {
  const { currentSchedule, quotes } = useSchedule()
  const currentTimeString = useCurrentTime()
  const [randomQuote, setRandomQuote] = useState('')
  const [currentActivity, setCurrentActivity] = useState(null)

  // 初始化随机格言
  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)]
      setRandomQuote(quote)
    }
  }, [quotes])

  // 更新当前活动
  useEffect(() => {
    if (currentSchedule && currentSchedule.schedule) {
      const currentTime = getCurrentTimeInMinutes()
      const activity = findCurrentActivity(currentSchedule.schedule, currentTime)
      setCurrentActivity(activity)
    }
  }, [currentSchedule, currentTimeString]) // 依赖currentTimeString确保每分钟更新

  return (
    <main className="main-content">
      {/* 英雄区域 */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">科学作息 健康生活</h1>
            <p className="hero-subtitle">基于权威机构研究和成功人士经验的作息表</p>
            <div className="hero-quote">
              <span className="quote-mark">"</span>
              <span className="quote-content">{randomQuote || '健康作息，从今天开始！'}</span>
              <span className="quote-mark">"</span>
            </div>
          </div>
        </div>
      </section>

      {/* 当前作息表完整显示区域 */}
      <section className="current-schedule" id="current-schedule">
        <div className="container">
          <div className="current-time-header">
            <h2 className="section-title">
              {currentSchedule ? currentSchedule.title : '当前作息表'}
            </h2>
          </div>
          
          {/* 当前时间显示 */}
          <div className="current-time-display">
            <div className="current-time">{currentTimeString}</div>
            <div className="current-activity">
              <h3>
                {currentActivity 
                  ? `${currentActivity.time} - ${currentActivity.activity}` 
                  : (currentSchedule ? '当前无特定活动安排' : '请选择一个作息表')
                }
              </h3>
              <p>
                {currentActivity 
                  ? currentActivity.description 
                  : (currentSchedule ? '请根据您选择的作息表安排适当的活动。' : '点击上方切换按钮选择适合您的作息时间表。')
                }
              </p>
            </div>
          </div>
          
          {/* 作息表详细信息 */}
          {currentSchedule && (
            <div className="schedule-detail">
              <div className="schedule-info">
                <div className="info-row">
                  <span className="info-label">分类：</span>
                  <span>{currentSchedule.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">目标人群：</span>
                  <span>{currentSchedule.target_audience}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">来源：</span>
                  <a href={currentSchedule.source_url} target="_blank" rel="noopener noreferrer">
                    <span>{currentSchedule.source}</span>
                  </a>
                </div>
                <div className="info-row">
                  <span className="info-label">描述：</span>
                  <span>{currentSchedule.description}</span>
                </div>
              </div>
              
              {/* 完整时间线 */}
              <Timeline schedule={currentSchedule} />
              
              {/* 补充建议 */}
              <Recommendations schedule={currentSchedule} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage