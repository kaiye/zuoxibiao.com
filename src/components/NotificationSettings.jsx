import React, { useState } from 'react'
import useNotifications from '../hooks/useNotifications'

const NotificationSettings = ({ currentSchedule }) => {
  const { hasPermission, enableNotifications, isSupported } = useNotifications(currentSchedule)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isSupported) {
    return (
      <div className="notification-settings">
        <div className="notification-info">
          <span className="notification-icon">ℹ️</span>
          <span>您的浏览器不支持通知功能</span>
        </div>
      </div>
    )
  }

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const granted = await enableNotifications()
      if (!granted) {
        setErrorMessage('通知权限被拒绝，请在浏览器设置中手动开启通知权限')
      }
    } catch (error) {
      setErrorMessage('开启通知失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="notification-settings">
      {!hasPermission ? (
        <div className="notification-prompt">
          <div className="notification-info">
            <span className="notification-icon">🔔</span>
            <span>开启通知提醒，在活动开始前1分钟收到提醒</span>
          </div>
          <button 
            className={`btn btn-primary notification-enable-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleEnableNotifications}
            disabled={isLoading}
          >
            {isLoading ? '开启中...' : '开启通知'}
          </button>
        </div>
      ) : (
        <div className="notification-enabled">
          <span>通知已开启，您将在活动切换前1分钟收到提醒</span>
          <div className="notification-buttons">
            <button 
              className="btn btn-secondary notification-status-btn"
              disabled={true}
            >
              已开启
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="notification-error">
          <span className="notification-icon">❌</span>
          <span>{errorMessage}</span>
        </div>
      )}
      
    </div>
  )
}

export default NotificationSettings