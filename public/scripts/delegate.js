// 事件委托处理器
class EventDelegate {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('change', this.handleChange.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleClick(event) {
        const target = event.target;
        const action = target.getAttribute('data-action');
        
        if (action && window.candidateActions && window.candidateActions[action]) {
            window.candidateActions[action](event);
        }
    }

    handleChange(event) {
        const target = event.target;
        const action = target.getAttribute('data-action');
        
        if (action && window.candidateActions && window.candidateActions[action]) {
            window.candidateActions[action](event);
        }
    }

    handleKeydown(event) {
        // 回车键触发主要按钮
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.hasAttribute('data-action')) {
                const action = activeElement.getAttribute('data-action');
                if (window.candidateActions && window.candidateActions[action]) {
                    window.candidateActions[action](event);
                }
            }
        }

        // ESC键用于跳过或返回
        if (event.key === 'Escape') {
            event.preventDefault();
            // 寻找跳过或取消按钮
            const skipBtn = document.querySelector('[data-action="Sim.Skip"]');
            if (skipBtn) {
                skipBtn.click();
            }
        }
    }
}

// 工具函数
function toast(message, duration = 3000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新toast
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 10000;
        font-size: 0.9rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: toastSlideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    // 自动消失
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);

    // 添加CSS动画
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastSlideIn {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes toastSlideOut {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化事件委托
document.addEventListener('DOMContentLoaded', () => {
    window.eventDelegate = new EventDelegate();
});