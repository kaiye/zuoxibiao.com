import type { Metadata, Viewport } from 'next'
import { ScheduleProvider } from '@/components/providers/ScheduleProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: '作息表 - 科学作息 健康生活 | zuoxibiao.com',
  description: '基于权威机构研究和成功人士经验的科学作息时间表。提供减肥养生、学习备考、职场生活等多个场景的个性化时间管理方案，助您养成健康规律的生活习惯。',
  keywords: '作息表,作息时间表,健康作息,时间管理,减肥作息,学霸作息,考研作息,企业家作息',
  authors: [{ name: 'ZuoXiBiao.com' }],
  creator: 'ZuoXiBiao.com',
  publisher: 'ZuoXiBiao.com',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zuoxibiao.com',
    siteName: '作息表',
    title: '作息表 - 科学作息 健康生活',
    description: '基于权威机构研究和成功人士经验的科学作息时间表',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: '作息表 Logo'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: '作息表 - 科学作息 健康生活',
    description: '基于权威机构研究和成功人士经验的科学作息时间表'
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' }
    ],
    apple: [
      { url: '/favicons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#10b981'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ScheduleProvider>
          <div className="app">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ScheduleProvider>
      </body>
    </html>
  )
}
