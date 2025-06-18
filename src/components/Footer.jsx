import React from 'react'

const Footer = () => {
  return (
    <footer className="footer" id="about">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于我们</h3>
            <p>致力于提供科学、权威的作息表，帮助您建立健康的生活节奏。我们整理了来自世界知名机构和成功人士的作息建议，为不同年龄段和生活场景提供参考。</p>
          </div>
          <div className="footer-section">
            <h3>联系我们</h3>
            <p>如果您有任何建议或问题，欢迎通过微信公众号"前端培训"联系我们</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 ZuoXiBiao.com, All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer