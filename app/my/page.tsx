import type { Metadata } from 'next'
import MyPageClient from '@/components/pages/MyPageClient'

export const metadata: Metadata = {
  title: '我的作息表 - 作息表 | zuoxibiao.com',
  description: '管理您的个人作息安排，创建和编辑自定义作息表，打造专属于您的健康生活时间表。',
  keywords: '我的作息表,自定义作息表,个人作息,时间管理',
  openGraph: {
    title: '我的作息表 - 作息表',
    description: '管理您的个人作息安排，创建专属作息表',
    url: 'https://zuoxibiao.com/my'
  }
}

export default function MyPage() {
  return <MyPageClient />
}
