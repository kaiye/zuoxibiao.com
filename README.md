# 健康作息时间表 - Next.js 应用

基于权威机构研究和成功人士经验的健康作息时间表，使用 Next.js 15 构建的现代化 Web 应用。

## ✨ 特性

- 🚀 **Next.js 15 + React 18** - App Router 架构，静态导出部署
- 📱 **响应式设计** - 完美支持 PC 和移动设备
- ⚡ **静态生成** - Cloudflare Pages 全球 CDN 加速
- 🎯 **智能时间提醒** - 实时显示当前时间建议
- 📊 **权威数据来源** - 17个来自WHO、哈佛、清华等权威机构的作息表
- 🎨 **现代UI设计** - 统一绿色主题，简洁美观
- 💾 **本地存储** - 记住用户选择的作息表
- 🔍 **SEO 优化** - 完整的 Metadata API 和结构化数据

## 🎯 数据来源

- 世界卫生组织(WHO)
- 威斯敏斯特大学研究
- 哈佛大学、清华大学
- 北京协和医院
- 知名企业家经验分享（比尔·盖茨、马云等）

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 生产构建

```bash
# 构建生产版本（静态导出）
npm run build

# 输出目录: out/
```

## 📁 项目结构

```
app/                    # Next.js App Router 页面
├── layout.tsx          # 根布局
├── page.tsx            # 首页
├── globals.css         # 全局样式
├── schedules/
│   └── page.tsx        # 推荐作息表页
└── my/
    └── page.tsx        # 我的作息表页

components/             # React 组件
├── providers/
│   └── ScheduleProvider.tsx  # Context Provider
├── pages/
│   ├── HomePageClient.tsx
│   ├── SchedulesPageClient.tsx
│   └── MyPageClient.tsx
├── Navbar.tsx          # 导航栏
├── Footer.tsx          # 页脚
├── Modal.tsx           # 模态框
├── Timeline.tsx        # 时间线组件
├── ScheduleCard.tsx    # 作息表卡片
└── ...

hooks/                  # 自定义 Hooks
├── useCurrentTime.ts   # 当前时间 Hook
├── useToast.ts         # Toast Hook
└── useNotifications.ts # 通知 Hook

lib/                    # 工具函数和数据
├── schedules.ts        # 作息表数据
└── timeUtils.ts        # 时间处理工具

types/                  # TypeScript 类型定义
└── schedule.ts
```

## 🔧 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: CSS + CSS Custom Properties
- **状态管理**: React Context + Hooks
- **部署**: Cloudflare Pages (静态导出)
- **CI/CD**: GitHub Actions

## 📱 功能特性

### 首页
- 实时显示当前时间
- 智能匹配当前时间段的活动建议
- 显示完整的作息表时间线和补充建议
- 一键切换到其他作息表

### 作息表选择页
- 筛选功能：按分类和目标人群筛选
- 详细预览：模态框查看完整作息表信息
- 快速应用：一键设置为当前作息表

### 我的作息表
- 创建自定义作息表
- 编辑和删除已创建的作息表
- 本地存储持久化

## 🚀 部署

项目通过 GitHub Actions 自动部署到 Cloudflare Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建
3. 部署到 Cloudflare Pages
4. 自定义域名: https://zuoxibiao.com

## 📧 联系我们

搜索微信公众号：前端培训

## 📄 许可证

MIT License

---

&copy; 2026 ZuoXiBiao.com, All rights reserved.
