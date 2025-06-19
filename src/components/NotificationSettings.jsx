import React, { useState } from 'react'
import useNotifications from '../hooks/useNotifications'

const NotificationSettings = ({ currentSchedule }) => {
  const { hasPermission, enableNotifications, isSupported } = useNotifications(currentSchedule)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [showFallbackModal, setShowFallbackModal] = useState(false)

  if (!isSupported) {
    return (
      <div className="notification-settings">
        <div className="notification-prompt">
          <div className="notification-info">
            <span className="notification-icon">ℹ️</span>
            <span>您的浏览器不支持通知功能</span>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFallbackModal(true)}
            style={{ fontSize: '0.9rem', padding: 'var(--space-2) var(--space-4)' }}
          >
            解决办法
          </button>
        </div>
        
        {/* 不支持通知的解决方案弹窗 */}
        {showFallbackModal && (
          <div className="modal show">
            <div className="modal-overlay" onClick={() => setShowFallbackModal(false)}></div>
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2>获得提醒功能</h2>
                <button className="modal-close" onClick={() => setShowFallbackModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>📱 推荐解决方案</h4>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    虽然当前浏览器不支持通知功能，但您可以通过以下方式获得更好的提醒体验：
                  </p>
                  <ul style={{ marginLeft: '1.2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <li>将本站添加到手机桌面，像App一样使用</li>
                    <li>使用支持通知的浏览器（如Chrome、Safari等）</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>🏠 添加到桌面教程</h4>
                  <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>iPhone用户：</strong> Safari浏览器点击底部分享按钮 → 选择"添加到主屏幕"
                  </p>
                  <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Android用户：</strong> Chrome浏览器点击右上角菜单 → 选择"添加到主屏幕"
                  </p>
                  <a 
                    href="https://zhuanlan.zhihu.com/p/33320627" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}
                  >
                    📖 查看详细图文教程 →
                  </a>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowFallbackModal(false)}>
                  我知道了
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const handleEnableNotifications = () => {
    setShowGuideModal(true)
  }

  const handleConfirmEnable = async () => {
    setShowGuideModal(false)
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
      
      {/* 通知授权指导弹窗 */}
      {showGuideModal && (
        <div className="modal show">
          <div className="modal-overlay" onClick={() => setShowGuideModal(false)}></div>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>开启通知提醒</h2>
              <button className="modal-close" onClick={() => setShowGuideModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>📱 获得更好的提醒体验</h4>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                  点击确定后，浏览器会请求通知权限。为了获得更好的提醒体验，建议您：
                </p>
                <ul style={{ marginLeft: '1.2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  <li>允许浏览器发送通知</li>
                  <li>将本站添加到手机桌面，像App一样使用</li>
                </ul>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>🏠 添加到桌面教程</h4>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>iPhone用户：</strong> Safari浏览器点击底部分享按钮 → 选择"添加到主屏幕"
                </p>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>Android用户：</strong> Chrome浏览器点击右上角菜单 → 选择"添加到主屏幕"
                </p>
                <a 
                  href="https://zhuanlan.zhihu.com/p/33320627" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  📖 查看详细图文教程 →
                </a>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleConfirmEnable}>
                确定，开启通知
              </button>
              <button className="btn btn-secondary" onClick={() => setShowGuideModal(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default NotificationSettings