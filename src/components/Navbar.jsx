import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/index.html')) {
      return true
    }
    if (path === '/schedules' && (location.pathname === '/schedules' || location.pathname === '/schedules.html')) {
      return true
    }
    if (path === '/my' && (location.pathname === '/my' || location.pathname === '/my.html')) {
      return true
    }
    return false
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src="/favicon.png" alt="Logo" className="logo-img" />
          <span className="brand-text">作息表 zuoxibiao.com</span>
        </Link>
        <div className={`navbar-menu ${isMobileMenuOpen ? 'show' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            首页
          </Link>
          <Link 
            to="/schedules" 
            className={`nav-link ${isActive('/schedules') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            推荐作息表
          </Link>
          <Link 
            to="/my" 
            className={`nav-link ${isActive('/my') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            我的
          </Link>
        </div>
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar