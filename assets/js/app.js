// 全局变量
let currentSchedule = null;
let schedules = [];
let quotes = [];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    try {
        console.log('初始化应用...');
        
        // 加载数据
        loadData();
        
        // 初始化组件
        initializeNavigation();
        initializeQuotes();
        initializeCurrentTime();
        
        // 设置默认作息表
        setDefaultSchedule();
        
        // 开始时间更新循环
        startTimeUpdate();
        
        // 延迟检查是否有新的作息表选择（确保页面完全加载）
        setTimeout(() => {
            checkAndUpdateSchedule();
        }, 100);
        
        console.log('应用初始化完成');
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
}

// 加载数据
function loadData() {
    console.log('开始加载数据...');
    
    if (window.schedulesData) {
        schedules = window.schedulesData.schedules || [];
        console.log(`成功加载 ${schedules.length} 个作息表`);
    } else {
        console.error('作息表数据未找到，请检查 data.js 是否正确加载');
        schedules = [];
    }
    
    if (window.quotesData) {
        quotes = window.quotesData || [];
        console.log(`成功加载 ${quotes.length} 条格言`);
    } else {
        console.warn('格言数据未找到');
        quotes = ['健康作息，从今天开始！'];
    }
}

// 初始化导航
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    
    // 平滑滚动
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    
                    // 更新激活状态
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // 移动端菜单切换
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // 滚动时更新导航状态
    window.addEventListener('scroll', updateNavigationState);
}

// 更新导航状态
function updateNavigationState() {
    const sections = ['home', 'about'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// 初始化随机引言
function initializeQuotes() {
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteContent = document.querySelector('.quote-content');
        if (quoteContent) {
            quoteContent.textContent = randomQuote;
        }
    }
}




// 初始化当前时间显示
function initializeCurrentTime() {
    updateCurrentTimeDisplay();
}

// 设置默认作息表
function setDefaultSchedule() {
    // 先尝试从 localStorage 恢复作息表
    try {
        const savedSchedule = localStorage.getItem('currentSchedule');
        if (savedSchedule) {
            const schedule = JSON.parse(savedSchedule);
            const found = schedules.find(s => s.id === schedule.id);
            if (found) {
                console.log('恢复保存的作息表:', found.title);
                setCurrentSchedule(found);
                return;
            }
        }
    } catch (error) {
        console.warn('无法恢复保存的作息表:', error);
    }
    
    // 如果没有保存的作息表，使用默认的第一个作息表
    if (schedules.length > 0) {
        console.log('设置默认作息表:', schedules[0].title);
        setCurrentSchedule(schedules[0]);
    } else {
        console.warn('没有可用的作息表数据');
    }
}

// 设置当前使用的作息表
function setCurrentSchedule(schedule) {
    currentSchedule = schedule;
    updateCurrentActivity();
    updateScheduleDetails();
    
    // 保存到 localStorage
    localStorage.setItem('currentSchedule', JSON.stringify(schedule));
}

// 开始时间更新循环
function startTimeUpdate() {
    updateCurrentTimeDisplay();
    setInterval(updateCurrentTimeDisplay, 60000); // 每分钟更新一次
}

// 更新当前时间显示
function updateCurrentTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    updateCurrentActivity();
    updateScheduleDetails();
}

// 更新当前活动
function updateCurrentActivity() {
    const titleElement = document.getElementById('activity-title');
    const descriptionElement = document.getElementById('activity-description');
    
    if (!titleElement || !descriptionElement) {
        console.warn('当前活动显示元素未找到');
        return;
    }
    
    if (!currentSchedule || !currentSchedule.schedule) {
        titleElement.textContent = '请选择一个作息表';
        descriptionElement.textContent = '点击上方的作息表卡片查看详情并选择适合您的作息时间表。';
        return;
    }
    
    const currentTime = getCurrentTimeInMinutes();
    const currentActivity = findCurrentActivity(currentSchedule.schedule, currentTime);
    
    if (currentActivity) {
        titleElement.textContent = `${currentActivity.time} - ${currentActivity.activity}`;
        descriptionElement.textContent = currentActivity.description;
    } else {
        titleElement.textContent = '当前无特定活动安排';
        descriptionElement.textContent = '请根据您选择的作息表安排适当的活动。';
    }
}

// 获取当前时间（分钟数）
function getCurrentTimeInMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// 查找当前时间应该进行的活动
function findCurrentActivity(schedule, currentTime) {
    for (let item of schedule) {
        if (isCurrentTimeSlot(item.time, currentTime)) {
            return item;
        }
    }
    return null;
}

// 判断是否为当前时间段
function isCurrentTimeSlot(timeRange, currentTime) {
    const times = parseTimeRange(timeRange);
    if (!times) return false;
    
    const { start, end } = times;
    
    // 处理跨天的情况（如 23:00-1:00）
    if (start > end) {
        return currentTime >= start || currentTime <= end;
    } else {
        return currentTime >= start && currentTime <= end;
    }
}

// 解析时间范围
function parseTimeRange(timeRange) {
    try {
        // 处理单个时间点（如 "7:30"）
        if (!timeRange.includes('-')) {
            const minutes = parseTime(timeRange);
            return minutes !== null ? { start: minutes, end: minutes + 30 } : null; // 默认持续30分钟
        }
        
        // 处理时间范围（如 "7:30-8:00"）
        const [startStr, endStr] = timeRange.split('-').map(t => t.trim());
        const start = parseTime(startStr);
        const end = parseTime(endStr);
        
        if (start !== null && end !== null) {
            return { start, end };
        }
    } catch (error) {
        console.warn('无法解析时间范围:', timeRange);
    }
    
    return null;
}

// 解析单个时间为分钟数
function parseTime(timeStr) {
    try {
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return null;
        return hours * 60 + minutes;
    } catch (error) {
        return null;
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 监听页面显示事件（用户从其他页面返回时触发）
window.addEventListener('pageshow', function(event) {
    // 如果是从缓存中恢复的页面，重新检查 localStorage
    if (event.persisted) {
        console.log('页面从缓存恢复，重新检查作息表设置');
        checkAndUpdateSchedule();
    }
});

// 检查并更新作息表设置
function checkAndUpdateSchedule() {
    try {
        const savedSchedule = localStorage.getItem('currentSchedule');
        if (savedSchedule) {
            const schedule = JSON.parse(savedSchedule);
            const found = schedules.find(s => s.id === schedule.id);
            if (found && (!currentSchedule || currentSchedule.id !== found.id)) {
                console.log('检测到新的作息表选择，更新显示:', found.title);
                setCurrentSchedule(found);
            }
        }
    } catch (error) {
        console.warn('检查作息表设置时出错:', error);
    }
}

// 页面获得焦点时检查作息表更新
window.addEventListener('focus', function() {
    console.log('页面获得焦点，检查作息表设置');
    checkAndUpdateSchedule();
});

// 更新作息表详细信息显示
function updateScheduleDetails() {
    if (!currentSchedule) return;
    
    // 更新作息表名称
    const nameElement = document.getElementById('current-schedule-name');
    if (nameElement) {
        nameElement.textContent = currentSchedule.title;
    }
    
    // 更新作息表信息
    const categoryEl = document.getElementById('schedule-category');
    const audienceEl = document.getElementById('schedule-audience');
    const sourceEl = document.getElementById('schedule-source');
    const sourceLinkEl = document.getElementById('schedule-source-link');
    const descriptionEl = document.getElementById('schedule-description');
    
    if (categoryEl) categoryEl.textContent = currentSchedule.category;
    if (audienceEl) audienceEl.textContent = currentSchedule.target_audience;
    if (sourceEl) sourceEl.textContent = currentSchedule.source;
    if (sourceLinkEl) sourceLinkEl.href = currentSchedule.source_url;
    if (descriptionEl) descriptionEl.textContent = currentSchedule.description;
    
    // 更新时间线
    renderFullTimeline(currentSchedule);
    
    // 更新补充建议
    renderFullRecommendations(currentSchedule);
}

// 渲染完整时间线
function renderFullTimeline(schedule) {
    const container = document.getElementById('schedule-timeline');
    
    if (!container) {
        console.warn('时间线容器元素未找到');
        return;
    }
    
    container.innerHTML = '<h3>完整时间安排</h3>';
    
    if (!schedule.schedule || schedule.schedule.length === 0) {
        container.innerHTML += '<p>暂无具体时间安排</p>';
        return;
    }
    
    const currentTime = getCurrentTimeInMinutes();
    
    schedule.schedule.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // 检查是否为当前时间
        if (isCurrentTimeSlot(item.time, currentTime)) {
            timelineItem.classList.add('current');
        }
        
        timelineItem.innerHTML = `
            <div class="timeline-time">${item.time}</div>
            <div class="timeline-content">
                <div class="timeline-activity">${item.activity}</div>
                <div class="timeline-description">${item.description}</div>
            </div>
        `;
        
        container.appendChild(timelineItem);
    });
}

// 渲染完整补充建议
function renderFullRecommendations(schedule) {
    const container = document.getElementById('schedule-recommendations');
    
    if (!container) {
        console.warn('补充建议容器元素未找到');
        return;
    }
    
    if (!schedule.additional_recommendations || schedule.additional_recommendations.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '<h3>补充建议</h3>';
    
    schedule.additional_recommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        
        let content = '';
        if (rec.period) {
            content += `<div class="recommendation-period">${rec.period}</div>`;
        }
        content += `<div class="recommendation-note">${rec.note}</div>`;
        
        item.innerHTML = content;
        container.appendChild(item);
    });
}

// 导出全局函数供调试使用
window.ScheduleApp = {
    getCurrentSchedule: () => currentSchedule,
    setSchedule: setCurrentSchedule,
    getSchedules: () => schedules,
    getCurrentTime: getCurrentTimeInMinutes,
    findActivity: findCurrentActivity
};