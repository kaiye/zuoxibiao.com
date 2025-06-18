# 健康作息时间表 - React 单页应用

基于权威机构研究和成功人士经验的健康作息时间表，现已升级为现代化的 React 单页应用。

## ✨ 特性

- 🚀 **React 18 + Vite** - 现代化开发体验，快速构建
- 📱 **响应式设计** - 完美支持 PC 和移动设备
- ⚡ **单页应用** - 无刷新切换，性能优异
- 🎯 **智能时间提醒** - 实时显示当前时间建议
- 📊 **权威数据来源** - 10个来自WHO、哈佛、清华等权威机构的作息表
- 🎨 **现代UI设计** - 统一绿色主题，简洁美观
- 💾 **本地存储** - 记住用户选择的作息表

## 🎯 数据来源

- 世界卫生组织(WHO)
- 威斯敏斯特大学研究
- 哈佛大学、清华大学
- 知名企业家经验分享（比尔·盖茨、马云等）

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:8080
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── Navbar.jsx      # 导航栏
│   ├── Footer.jsx      # 底部信息
│   ├── Modal.jsx       # 模态框
│   ├── Timeline.jsx    # 时间线组件
│   ├── Recommendations.jsx  # 建议组件
│   └── ScheduleCard.jsx     # 作息表卡片
├── pages/              # 页面组件
│   ├── HomePage.jsx    # 首页
│   └── SchedulesPage.jsx    # 作息表选择页
├── context/            # React Context
│   └── ScheduleContext.jsx  # 作息表上下文
├── hooks/              # 自定义 Hooks
│   └── useCurrentTime.js    # 当前时间 Hook
├── utils/              # 工具函数
│   └── timeUtils.js    # 时间处理工具
├── data/               # 数据
│   └── schedules.js    # 作息表数据
├── styles/             # 样式文件
│   └── global.css      # 全局样式
└── main.jsx           # 应用入口
```

## 🔧 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **路由**: React Router DOM
- **样式**: CSS + CSS Custom Properties
- **状态管理**: React Context + Hooks
- **开发工具**: ESLint, Hot Reload

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

### 响应式设计
- 移动端优化的导航菜单
- 自适应的卡片布局
- 优化的触摸交互

## 🎨 设计特色

- **统一绿色主题** - 健康环保的视觉体验
- **现代化界面** - 简洁大方的设计风格
- **无障碍设计** - 良好的可访问性支持
- **动画效果** - 流畅的交互体验

## 📧 联系我们

搜索微信公众号：前端培训

## 📄 许可证

MIT License

---

&copy; 2024 ZuoXiBiao.com, All rights reserved.