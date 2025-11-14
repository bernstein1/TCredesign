/**
 * TouchCare Interactive Prototype
 * All functions are mocked - this is a visual/interactive prototype only
 */

const app = {
    currentView: 'dashboard-view',

    init() {
        console.log('TouchCare Prototype Initialized');
        this.setupCodeInputs();
        this.setupTaskBar();
        // Show initial view - Dashboard for demo purposes
        this.navigateTo('dashboard-view');
    },

    // Navigation
    navigateTo(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewId;

            // Update navigation active states
            this.updateNavActiveStates(viewId);

            // Scroll to top
            window.scrollTo(0, 0);
        }
    },

    updateNavActiveStates(viewId) {
        // Map views to nav items
        const viewToNav = {
            'dashboard-view': 0,
            'cases-view': 1,
            'documents-view': 2,
            'wallet-view': 3,
            'settings-view': 4
        };

        // Update sidebar nav
        document.querySelectorAll('.sidebar-nav .nav-item').forEach((item, index) => {
            item.classList.toggle('active', index === viewToNav[viewId]);
        });

        // Update bottom nav
        document.querySelectorAll('.bottom-nav .nav-item').forEach((item, index) => {
            item.classList.toggle('active', index === viewToNav[viewId]);
        });
    },

    // Auth flows
    sendCode() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.navigateTo('verification-view');
            // Auto-focus first code input
            const firstInput = document.querySelector('.code-input[data-index="0"]');
            if (firstInput) firstInput.focus();
        }, 1000);
    },

    verifyCode() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.navigateTo('dashboard-view');
            this.showToast('Welcome back, Jane!');
        }, 1500);
    },

    // Code input handling
    setupCodeInputs() {
        const inputs = document.querySelectorAll('.code-input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;

                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    e.target.value = value.replace(/\D/g, '');
                    return;
                }

                // Move to next input if value entered
                if (value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }

                // Auto-verify if all filled
                const allFilled = Array.from(inputs).every(inp => inp.value);
                if (allFilled) {
                    setTimeout(() => this.verifyCode(), 300);
                }
            });

            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace if empty
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text');
                const digits = pasteData.replace(/\D/g, '').split('');

                digits.forEach((digit, i) => {
                    if (inputs[i]) {
                        inputs[i].value = digit;
                    }
                });

                // Focus last filled input
                const lastFilledIndex = Math.min(digits.length - 1, inputs.length - 1);
                if (lastFilledIndex >= 0) {
                    inputs[lastFilledIndex].focus();
                }
            });
        });
    },

    // Task Bar
    setupTaskBar() {
        const taskBar = document.getElementById('task-bar');
        if (taskBar) {
            const header = taskBar.querySelector('.task-bar-header');
            if (header) {
                header.addEventListener('click', () => this.toggleTaskBar());
            }
        }
    },

    toggleTaskBar() {
        const taskBar = document.getElementById('task-bar');
        if (taskBar) {
            taskBar.classList.toggle('collapsed');
        }
    },

    toggleNotifications() {
        this.showToast('Notifications panel coming soon!');
    },

    // Case resolution confirmation
    showResolveCaseDialog() {
        const modal = document.getElementById('resolve-case-modal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    hideResolveCaseDialog() {
        const modal = document.getElementById('resolve-case-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    confirmResolveCase() {
        this.hideResolveCaseDialog();
        this.showToast('Case marked as resolved');
        setTimeout(() => {
            this.navigateTo('cases-view');
        }, 1000);
    },

    // Terms and Conditions modal
    showTermsModal() {
        const modal = document.getElementById('terms-modal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    hideTermsModal() {
        const modal = document.getElementById('terms-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Wallet tab switching
    switchWalletTab(tabName) {
        // Hide all wallet tabs
        document.querySelectorAll('.wallet-tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        // Show selected tab
        const selectedTab = document.getElementById(`wallet-${tabName}-tab`);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }

        // Update tab button states
        const walletView = document.getElementById('wallet-view');
        if (walletView) {
            const tabs = walletView.querySelectorAll('.tabs .tab');
            tabs.forEach((tab, index) => {
                tab.classList.remove('active');
            });

            // Determine which tab index to activate
            const tabIndex = {
                'cards': 0,
                'medical-id': 1,
                'payment': 2,
                'fsa': 3
            }[tabName];

            if (tabs[tabIndex]) {
                tabs[tabIndex].classList.add('active');
            }
        }
    },

    // Settings tab switching
    switchSettingsTab(tabName) {
        // For now, just show a toast (we only implemented security tab)
        if (tabName === 'security') {
            document.getElementById('security-tab').style.display = 'block';
            this.showToast('Security settings');
        } else {
            this.showToast(`${tabName.charAt(0).toUpperCase() + tabName.slice(1)} settings coming soon`);
        }
    },

    // Toast notifications
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.2s ease-out';
            setTimeout(() => {
                container.removeChild(toast);
            }, 200);
        }, 3000);
    },

    // Loading overlay
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
};

// Additional slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
