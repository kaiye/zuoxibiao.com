'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSchedule } from '@/components/providers/ScheduleProvider'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { getCurrentTimeInMinutes, findCurrentActivity } from '@/lib/timeUtils'
import Timeline from '@/components/Timeline'
import Recommendations from '@/components/Recommendations'
import NotificationSettings from '@/components/NotificationSettings'
import type { ScheduleItem } from '@/types/schedule'

const HomePageClient: React.FC = () => {
  const { currentSchedule, quotes } = useSchedule()
  const router = useRouter()
  const currentTimeString = useCurrentTime()
  const [randomQuote, setRandomQuote] = useState('')
  const [currentActivity, setCurrentActivity] = useState<ScheduleItem | null>(null)

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

  // 处理来源点击
  const handleSourceClick = (e: React.MouseEvent) => {
    if (currentSchedule && currentSchedule.source === '我的') {
      e.preventDefault()
      router.push('/my')
    }
  }

  // 检查是否是自定义来源
  const isCustomSource = currentSchedule && currentSchedule.source === '我的'

  return (
    <main className="main-content">
      {/* 英雄区域 */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">科学作息 健康生活</h1>
            <p className="hero-subtitle">基于权威机构研究和成功人士经验的作息表</p>
            <div className="hero-quote">
              <span className="quote-mark">&ldquo;</span>
              <span className="quote-content">{randomQuote || '健康作息，从今天开始！'}</span>
              <span className="quote-mark">&rdquo;</span>
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
            <div className="current-time">{currentTimeString || '--:--'}</div>
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
                  : (currentSchedule ? '' : '点击顶部导航"推荐作息表"选择适合您的作息时间表。')
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
                  {isCustomSource ? (
                    <span
                      style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
                      onClick={handleSourceClick}
                    >
                      {currentSchedule.source}
                    </span>
                  ) : (
                    <a href={currentSchedule.source_url} target="_blank" rel="noopener noreferrer">
                      <span>{currentSchedule.source}</span>
                    </a>
                  )}
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

              {/* 通知设置 */}
              <NotificationSettings currentSchedule={currentSchedule} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePageClient
