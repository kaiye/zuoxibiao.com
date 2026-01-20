'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string): boolean => {
    if (path === '/' && (pathname === '/' || pathname === '/index.html')) {
      return true
    }
    if (path === '/schedules' && (pathname === '/schedules' || pathname === '/schedules/' || pathname === '/schedules.html')) {
      return true
    }
    if (path === '/my' && (pathname === '/my' || pathname === '/my/' || pathname === '/my.html')) {
      return true
    }
    return false
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <img src="/favicon.png" alt="Logo" className="logo-img" />
          <span className="brand-text">作息表 zuoxibiao.com</span>
        </Link>
        <div className={`navbar-menu ${isMobileMenuOpen ? 'show' : ''}`}>
          <Link
            href="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            首页
          </Link>
          <Link
            href="/schedules"
            className={`nav-link ${isActive('/schedules') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            推荐作息表
          </Link>
          <Link
            href="/my"
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
