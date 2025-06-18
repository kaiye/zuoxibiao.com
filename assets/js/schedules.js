// 作息表选择页面脚本
let schedules = [];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSchedulePage();
});

// 初始化作息表选择页面
function initializeSchedulePage() {
    try {
        console.log('初始化作息表选择页面...');
        
        // 加载数据
        loadData();
        
        // 初始化组件
        initializeNavigation();
        initializeFilters();
        initializeModal();
        
        // 渲染作息表卡片
        renderScheduleCards();
        
        console.log('作息表选择页面初始化完成');
    } catch (error) {
        console.error('页面初始化失败:', error);
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
}

// 初始化导航
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    
    // 移动端菜单切换
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
}

// 初始化筛选器
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const group = this.closest('.filter-group');
                if (group) {
                    const groupButtons = group.querySelectorAll('.filter-btn');
                    
                    // 移除同组其他按钮的激活状态
                    groupButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // 激活当前按钮
                    this.classList.add('active');
                    
                    // 应用筛选
                    applyFilters();
                }
            });
        });
    }
}

// 应用筛选
function applyFilters() {
    const categoryFilterEl = document.querySelector('[data-category].active');
    const audienceFilterEl = document.querySelector('[data-audience].active');
    
    if (!categoryFilterEl || !audienceFilterEl) {
        console.warn('筛选器元素未找到');
        return;
    }
    
    const categoryFilter = categoryFilterEl.dataset.category;
    const audienceFilter = audienceFilterEl.dataset.audience;
    
    const filteredSchedules = schedules.filter(schedule => {
        const categoryMatch = categoryFilter === 'all' || schedule.category === categoryFilter;
        const audienceMatch = audienceFilter === 'all' || schedule.target_audience.includes(audienceFilter);
        
        return categoryMatch && audienceMatch;
    });
    
    renderScheduleCards(filteredSchedules);
}

// 渲染作息表卡片
function renderScheduleCards(schedulesToRender = schedules) {
    const container = document.getElementById('schedule-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    schedulesToRender.forEach(schedule => {
        const card = createScheduleCard(schedule);
        container.appendChild(card);
    });
}

// 创建作息表卡片
function createScheduleCard(schedule) {
    const card = document.createElement('div');
    card.className = 'schedule-card';
    card.dataset.scheduleId = schedule.id;
    
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${schedule.title}</h3>
            <div class="card-meta">
                <span class="card-category">${schedule.category}</span>
                <span class="card-audience">${schedule.target_audience}</span>
            </div>
        </div>
        <p class="card-description">${schedule.description}</p>
        <p class="card-source">来源：${schedule.source}</p>
    `;
    
    card.addEventListener('click', () => openScheduleModal(schedule));
    
    return card;
}

// 初始化模态框
function initializeModal() {
    const modal = document.getElementById('schedule-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const useBtn = document.getElementById('use-schedule');
    
    if (!modal) {
        console.warn('模态框元素未找到');
        return;
    }
    
    // 关闭模态框
    const closeModal = () => {
        modal.classList.remove('show');
    };
    
    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // 使用作息表
    if (useBtn) {
        useBtn.addEventListener('click', () => {
            if (window.currentModalSchedule) {
                console.log('用户选择了新的作息表:', window.currentModalSchedule.title);
                
                // 保存选择的作息表到 localStorage
                localStorage.setItem('currentSchedule', JSON.stringify(window.currentModalSchedule));
                
                // 关闭模态框
                closeModal();
                
                // 跳转到首页并强制刷新
                window.location.href = 'index.html';
                
                // 备用方案：如果是同一页面，强制重新加载
                setTimeout(() => {
                    if (window.location.pathname.includes('schedules.html')) {
                        window.location.reload();
                    }
                }, 100);
            }
        });
    }
    
    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// 打开作息表模态框
function openScheduleModal(schedule) {
    const modal = document.getElementById('schedule-modal');
    
    if (!modal) {
        console.warn('模态框元素未找到');
        return;
    }
    
    // 更新模态框内容
    const titleEl = document.getElementById('modal-title');
    const categoryEl = document.getElementById('modal-category');
    const audienceEl = document.getElementById('modal-audience');
    const sourceEl = document.getElementById('modal-source');
    const sourceLinkEl = document.getElementById('modal-source-link');
    const descriptionEl = document.getElementById('modal-description');
    
    if (titleEl) titleEl.textContent = schedule.title;
    if (categoryEl) categoryEl.textContent = schedule.category;
    if (audienceEl) audienceEl.textContent = schedule.target_audience;
    if (sourceEl) sourceEl.textContent = schedule.source;
    if (sourceLinkEl) sourceLinkEl.href = schedule.source_url;
    if (descriptionEl) descriptionEl.textContent = schedule.description;
    
    // 渲染时间线
    renderTimeline(schedule);
    
    // 渲染补充建议
    renderRecommendations(schedule);
    
    // 保存当前选中的作息表
    window.currentModalSchedule = schedule;
    
    // 显示模态框
    modal.classList.add('show');
}

// 渲染时间线
function renderTimeline(schedule) {
    const container = document.getElementById('modal-timeline');
    
    if (!container) {
        console.warn('时间线容器元素未找到');
        return;
    }
    
    container.innerHTML = '<h3>时间安排</h3>';
    
    if (!schedule.schedule || schedule.schedule.length === 0) {
        container.innerHTML += '<p>暂无具体时间安排</p>';
        return;
    }
    
    schedule.schedule.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
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

// 渲染补充建议
function renderRecommendations(schedule) {
    const container = document.getElementById('modal-recommendations');
    
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