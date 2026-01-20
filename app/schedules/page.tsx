import type { Metadata } from 'next'
import SchedulesPageClient from '@/components/pages/SchedulesPageClient'

export const metadata: Metadata = {
  title: '推荐作息表 - 作息表 | zuoxibiao.com',
  description: '精选来自北京协和医院、清华北大学霸、考研专家、世界500强CEO等权威机构和成功人士的科学作息建议。涵盖减肥养生、学习备考、职场生活等多个场景。',
  keywords: '推荐作息表,健康作息,减肥作息,学霸作息,考研作息,企业家作息,WHO作息建议',
  openGraph: {
    title: '推荐作息表 - 作息表',
    description: '精选权威机构和成功人士的科学作息建议',
    url: 'https://zuoxibiao.com/schedules'
  }
}

export default function SchedulesPage() {
  return <SchedulesPageClient />
}
