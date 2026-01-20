'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSchedule } from '@/components/providers/ScheduleProvider'
import NotificationSettings from '@/components/NotificationSettings'
import type { Schedule, ScheduleItem } from '@/types/schedule'

const MyPageClient: React.FC = () => {
  const { currentSchedule, setCurrentSchedule, customSchedules, addCustomSchedule, updateCustomSchedule, deleteCustomSchedule, openModal, toast, myPageEditingState, setMyPageEditingState } = useSchedule()
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [scheduleText, setScheduleText] = useState('')
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const exampleText = `6:30|闹钟响起第一遍|习惯性按掉闹钟，继续做5分钟发财梦
7:00|真正起床|在第6个闹钟响起后，终于意识到再不起床就要迟到了
7:00-7:15|光速洗漱|创造人类洗漱速度记录，牙刷还在嘴里就开始换衣服
7:15-8:30|地铁炼狱时间|被挤成肉饼在地铁里，一边刷手机一边祈祷不要晚点
8:30-8:59|卡点冲刺|百米冲刺速度赶到公司，在最后一秒打卡成功
9:00-12:00|上午假装工作|开始一天的演技表演，在摸鱼和干活之间无缝切换
12:00-13:00|抢外卖大战|和全楼人抢电梯抢外卖，午餐时间比工作还激烈
13:00-14:00|趴桌午休|在办公桌上艰难入睡，梦里都是KPI和加班
14:00-18:00|下午真正开始工作|领导出现频率增加，开始真正的工作状态
18:00-20:00|加班第一阶段|名义上的下班时间，实际上加班才刚刚开始
20:00-22:00|加班第二阶段|和同事一起叫外卖，在公司吃第二顿饭
22:00-23:30|回家路上|拖着疲惫身躯踏上归途，地铁上已经开始打瞌睡
23:30-1:00|报复性熬夜|刷手机、看视频、打游戏，企图找回属于自己的时间
1:00-6:30|不足6小时睡眠|在焦虑和疲惫中入睡，梦里还在回复工作消息`

  const copyExample = () => {
    navigator.clipboard.writeText(exampleText)
    toast.success('示例文本已复制到剪贴板！您可以使用豆包、元宝等AI工具生成个性化的作息表文本。')
  }

  const parseScheduleText = (text: string): ScheduleItem[] => {
    const lines = text.trim().split('\n').filter(line => line.trim())
    const schedule: ScheduleItem[] = []

    for (const line of lines) {
      const parts = line.split('|')
      if (parts.length >= 3) {
        const [time, activity, description] = parts.map(p => p.trim())
        if (time && activity && description) {
          schedule.push({ time, activity, description })
        }
      }
    }

    return schedule
  }

  const scheduleToText = (schedule: ScheduleItem[]): string => {
    return schedule.map(item => `${item.time}|${item.activity}|${item.description}`).join('\n')
  }

  // 检查是否有来自模态框的自定义数据
  useEffect(() => {
    const scheduleToCustomize = localStorage.getItem('scheduleToCustomize')
    if (scheduleToCustomize) {
      try {
        const data = JSON.parse(scheduleToCustomize)
        setScheduleTitle(data.title)
        setScheduleText(scheduleToText(data.schedule))
        setIsCreating(true)
        setIsEditing(false)
        setEditingSchedule(null)
        setError('')
        setMyPageEditingState({ isCreating: true, isEditing: false })

        // 清除localStorage中的数据
        localStorage.removeItem('scheduleToCustomize')

        toast.info('已为您预填了作息表内容，您可以根据需要进行修改')
      } catch (err) {
        console.warn('解析自定义作息表数据失败:', err)
        localStorage.removeItem('scheduleToCustomize')
      }
    }
  }, [])

  // 监听Context中的编辑状态变化，处理来自Modal的请求
  useEffect(() => {
    if (myPageEditingState?.isCreating && !isCreating) {
      // 当Context中设置为创建状态，但本地状态还没更新时，检查localStorage
      const scheduleToCustomize = localStorage.getItem('scheduleToCustomize')
      if (scheduleToCustomize) {
        try {
          const data = JSON.parse(scheduleToCustomize)
          setScheduleTitle(data.title)
          setScheduleText(scheduleToText(data.schedule))
          setIsCreating(true)
          setIsEditing(false)
          setEditingSchedule(null)
          setError('')

          // 清除localStorage中的数据
          localStorage.removeItem('scheduleToCustomize')

          toast.info('已为您预填了作息表内容，您可以根据需要进行修改')
        } catch (err) {
          console.warn('解析自定义作息表数据失败:', err)
          localStorage.removeItem('scheduleToCustomize')
        }
      }
    }
  }, [myPageEditingState.isCreating, isCreating, toast])

  const handleStartEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setScheduleTitle(schedule.title)
    setScheduleText(scheduleToText(schedule.schedule))
    setIsEditing(true)
    setIsCreating(false)
    setError('')
    setMyPageEditingState({ isCreating: false, isEditing: true })
  }

  const handleCreateOrUpdateSchedule = () => {
    setError('')

    if (!scheduleTitle.trim()) {
      setError('请输入作息表标题')
      return
    }

    if (!scheduleText.trim()) {
      setError('请输入作息表内容')
      return
    }

    setIsLoading(true)

    try {
      const parsedSchedule = parseScheduleText(scheduleText)

      if (parsedSchedule.length === 0) {
        setError('无法解析作息表内容，请检查格式是否正确')
        setIsLoading(false)
        return
      }

      if (isEditing && editingSchedule) {
        // 编辑模式：更新现有作息表
        const updatedSchedule: Schedule = {
          ...editingSchedule,
          title: scheduleTitle.trim(),
          schedule: parsedSchedule,
          updatedAt: new Date().toISOString()
        }

        updateCustomSchedule(updatedSchedule)

        toast.success('作息表修改成功！')
      } else {
        // 创建模式：创建新作息表
        const customSchedule: Schedule = {
          id: `custom-${Date.now()}`,
          title: scheduleTitle.trim(),
          description: '用户自定义作息表',
          age_group: '成年人',
          scenario: '自定义',
          category: '自定义',
          target_audience: '个人定制',
          source: '我的',
          source_url: '',
          schedule: parsedSchedule,
          additional_recommendations: [
            {
              note: '这是您自定义的作息表，请根据实际情况调整执行'
            }
          ],
          isCustom: true,
          createdAt: new Date().toISOString()
        }

        addCustomSchedule(customSchedule)
        setCurrentSchedule(customSchedule)

        toast.success('自定义作息表创建成功！已自动切换为当前使用的作息表。')
      }

      // 重置表单
      setScheduleTitle('')
      setScheduleText('')
      setIsCreating(false)
      setIsEditing(false)
      setEditingSchedule(null)
      setMyPageEditingState({ isCreating: false, isEditing: false })

    } catch (err) {
      setError(isEditing ? '修改作息表时发生错误，请重试' : '创建作息表时发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseSchedule = (schedule: Schedule) => {
    setCurrentSchedule(schedule)
    toast.success(`已切换到"${schedule.title}"`)
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('确定要删除这个自定义作息表吗？')) {
      deleteCustomSchedule(scheduleId)
      toast.success('自定义作息表已删除')
    }
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">我的作息表</h1>
          <p className="page-subtitle">管理您的个人作息安排</p>
        </div>
      </div>

      <section className="my-schedule-section">
        <div className="container">
          {/* 当前使用的作息表 */}
          <div className="current-schedule-card">
            <h2 className="section-title">当前使用的作息表</h2>
            {currentSchedule ? (
              <div
                className="schedule-card current"
                onClick={() => openModal(currentSchedule)}
                style={{ cursor: 'pointer' }}
              >
                <div className="current-badge">使用中</div>
                <div className="card-header">
                  <h3 className="card-title">{currentSchedule.title}</h3>
                  <div className="card-meta">
                    <span className="card-category">{currentSchedule.category}</span>
                    <span className="card-audience">{currentSchedule.target_audience}</span>
                  </div>
                  <p className="card-description">{currentSchedule.description}</p>
                </div>
              </div>
            ) : (
              <div className="no-schedule">
                <p>您还没有选择作息表，请前往<Link href="/schedules">推荐作息表</Link>页面选择一个。</p>
              </div>
            )}
          </div>

          {/* 自定义作息表管理 */}
          <div className="custom-schedules-section">
            <div className="section-header">
              <h2 className="section-title">我的自定义作息表</h2>
              {customSchedules.length < 2 && !isEditing && (
                <button
                  className="btn btn-primary create-schedule-btn"
                  onClick={() => {
                    const newCreatingState = !isCreating
                    setIsCreating(newCreatingState)
                    setMyPageEditingState({ isCreating: newCreatingState, isEditing: false })
                  }}
                >
                  {isCreating ? '取消创建' : '+ 创建新的作息表'}
                </button>
              )}
              {customSchedules.length >= 2 && !isEditing && (
                <span className="limit-message">最多可创建2份自定义作息表</span>
              )}
            </div>

            {/* 创建/编辑作息表表单 */}
            {((isCreating && customSchedules.length < 2) || isEditing) && (
              <div className="create-schedule-form">
                <h3>{isEditing ? '修改自定义作息表' : '创建自定义作息表'}</h3>

                <div className="form-group">
                  <label htmlFor="schedule-title">作息表标题</label>
                  <input
                    id="schedule-title"
                    type="text"
                    className="form-input"
                    placeholder="例如：我的理想作息表"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div className="form-label-with-action">
                    <label htmlFor="schedule-content">作息表内容</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-small copy-example-btn"
                      onClick={copyExample}
                    >
                      📋 复制示例格式
                    </button>
                  </div>
                  <textarea
                    id="schedule-content"
                    className="form-textarea"
                    rows={12}
                    placeholder={`请按照格式输入：时间|活动|说明\n\n例如：\n7:00|起床|开始新的一天\n7:00-7:30|洗漱|洗漱并准备早餐`}
                    value={scheduleText}
                    onChange={(e) => setScheduleText(e.target.value)}
                  />
                  <div className="form-hint">
                    <p>💡 <strong>创建提示：</strong></p>
                    <p>1. 点击&quot;复制示例格式&quot;按钮复制格式模板</p>
                    <p>2. 使用豆包、元宝、ChatGPT等AI工具，告诉它按照这个格式生成您的个性化作息表</p>
                    <p>3. 将AI生成的内容粘贴到上方文本框，然后点击创建</p>
                    <p>4. 格式：每行包含 <code>时间|活动|说明</code>，用竖线(|)分隔</p>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <span>❌ {error}</span>
                  </div>
                )}

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateOrUpdateSchedule}
                    disabled={isLoading}
                  >
                    {isLoading ? (isEditing ? '保存中...' : '创建中...') : (isEditing ? '保存修改' : '创建作息表')}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsCreating(false)
                      setIsEditing(false)
                      setEditingSchedule(null)
                      setScheduleTitle('')
                      setScheduleText('')
                      setError('')
                      setMyPageEditingState({ isCreating: false, isEditing: false })
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 自定义作息表列表 */}
            <div className="custom-schedules-list">
              {customSchedules && customSchedules.length > 0 ? (
                <div className="schedule-cards">
                  {customSchedules.map(schedule => (
                    <div key={schedule.id} className="schedule-card custom-schedule-card">
                      {/* 使用中标签 */}
                      {currentSchedule && currentSchedule.id === schedule.id && (
                        <div className="current-badge">使用中</div>
                      )}
                      <div
                        className="card-header"
                        onClick={() => openModal(schedule)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3 className="card-title">{schedule.title}</h3>
                        <div className="card-meta">
                          <span className="card-category">{schedule.category}</span>
                          <span className="card-audience">{schedule.target_audience}</span>
                        </div>
                        <p className="card-description">{schedule.description}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-primary btn-small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUseSchedule(schedule)
                          }}
                        >
                          使用此作息表
                        </button>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(schedule)
                          }}
                        >
                          修改
                        </button>
                        <button
                          className="btn btn-secondary btn-small btn-danger"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSchedule(schedule.id)
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-custom-schedules">
                  <p>您还没有创建任何自定义作息表。点击上方按钮开始创建您的专属作息表吧！</p>
                </div>
              )}
            </div>
          </div>
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

export default MyPageClient
