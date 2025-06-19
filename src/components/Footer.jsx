import React from 'react'

const Footer = () => {
  return (
    <footer className="footer" id="about">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于本站</h3>
            <p>本站精选了来自北京协和医院、清华北大学霸、考研专家等权威机构和成功人士的科学作息建议。涵盖减肥养生、学习备考、职场生活等多个场景，为不同年龄段用户提供个性化的时间管理方案，助您养成健康规律的生活习惯。</p>
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