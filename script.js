document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authScreen = document.getElementById('authScreen');
    const walletScreen = document.getElementById('walletScreen');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const signInTab = document.getElementById('signInTab');
    const signUpTab = document.getElementById('signUpTab');
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    const toast = document.getElementById('toast');
    
    // Auth Tabs
    signInTab.addEventListener('click', function() {
        signInTab.classList.add('active');
        signUpTab.classList.remove('active');
        signInForm.classList.add('active');
        signUpForm.classList.remove('active');
    });
    
    signUpTab.addEventListener('click', function() {
        signUpTab.classList.add('active');
        signInTab.classList.remove('active');
        signUpForm.classList.add('active');
        signInForm.classList.remove('active');
    });
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Mobile Menu
    menuBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Notification button
    notificationBtn.addEventListener('click', function() {
        showToast('You have 3 unread notifications', 'info');
    });
    
    // Quick action buttons
    const actionButtons = ['sendBtn', 'receiveBtn', 'swapBtn', 'stakeBtn'];
    actionButtons.forEach(btnId => {
        document.getElementById(btnId).addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showToast(`${action} feature is coming soon!`, 'info');
        });
    });
    
    // Load initial data
    loadAssets();
    loadTransactions();
    
    // Users data
    let users = JSON.parse(localStorage.getItem('users')) || [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            wallet: {
                totalBalance: 12450.75,
                availableBalance: 8240.50,
                stakedBalance: 4210.25
            }
        }
    ];
    
    // Sign In Form Submission
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            showToast('Login successful! Welcome back! 🚀', 'success');
            
            // Store current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update UI with user data
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('totalBalance').textContent = `$${user.wallet.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            
            // Switch to wallet screen
            setTimeout(() => {
                authScreen.style.display = 'none';
                walletScreen.style.display = 'flex';
            }, 1000);
            
            signInForm.reset();
        } else {
            showToast('Invalid email or password', 'error');
        }
    });
    
    // Sign Up Form Submission
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (!acceptTerms) {
            showToast('Please accept the terms and conditions', 'error');
            return;
        }
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            showToast('Account already exists with this email', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            wallet: {
                totalBalance: 1000.00,
                availableBalance: 1000.00,
                stakedBalance: 0.00
            }
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showToast('Account created successfully! Welcome! 🎉', 'success');
        
        // Switch to sign in form
        signInTab.click();
        document.getElementById('loginEmail').value = email;
        signUpForm.reset();
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        showToast('Logged out successfully', 'info');
        
        localStorage.removeItem('currentUser');
        
        setTimeout(() => {
            walletScreen.style.display = 'none';
            authScreen.style.display = 'flex';
            sidebar.classList.remove('active');
        }, 500);
    });
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        authScreen.style.display = 'none';
        walletScreen.style.display = 'flex';
    }
    
    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = 'toast show ' + type;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function loadAssets() {
        const assets = [
            { name: 'Bitcoin', symbol: 'BTC', amount: 0.425, value: 18245.50, change: 3.2, icon: 'fab fa-bitcoin', color: 'bitcoin' },
            { name: 'Ethereum', symbol: 'ETH', amount: 3.42, value: 6850.20, change: -1.8, icon: 'fab fa-ethereum', color: 'ethereum' },
            { name: 'USDC', symbol: 'USDC', amount: 5250, value: 5250.00, change: 0.0, icon: 'fas fa-dollar-sign', color: 'usdc' },
            { name: 'Solana', symbol: 'SOL', amount: 25, value: 1250.00, change: 7.5, icon: 'fas fa-fire', color: 'solana' }
        ];
        
        const assetsList = document.querySelector('.assets-list');
        assetsList.innerHTML = '';
        
        assets.forEach(asset => {
            const changeClass = asset.change > 0 ? 'positive' : asset.change < 0 ? 'negative' : 'positive';
            const changeIcon = asset.change > 0 ? 'fa-arrow-up' : asset.change < 0 ? 'fa-arrow-down' : 'fa-minus';
            
            const assetItem = document.createElement('div');
            assetItem.className = 'asset-item';
            assetItem.innerHTML = `
                <div class="asset-icon ${asset.color}">
                    <i class="${asset.icon}"></i>
                </div>
                <div class="asset-info">
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-symbol">${asset.symbol}</div>
                </div>
                <div class="asset-balance">
                    <div class="asset-amount">${asset.amount.toLocaleString()} ${asset.symbol}</div>
                    <div class="asset-value">$${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="asset-change ${changeClass}">
                    <i class="fas ${changeIcon}"></i>
                    ${Math.abs(asset.change)}%
                </div>
            `;
            assetsList.appendChild(assetItem);
        });
    }
    
    function loadTransactions() {
        const transactions = [
            { type: 'receive', title: 'Received Bitcoin', time: 'Today, 10:42 AM', amount: '+0.025 BTC', value: '+$1,050.00' },
            { type: 'send', title: 'Sent Ethereum', time: 'Yesterday, 3:15 PM', amount: '-0.5 ETH', value: '-$1,000.00' },
            { type: 'stake', title: 'Staked Cardano', time: 'Oct 12, 2:30 PM', amount: '500 ADA', value: 'Staked' },
            { type: 'swap', title: 'BTC to ETH Swap', time: 'Oct 10, 11:20 AM', amount: '0.1 BTC → 1.8 ETH', value: 'Swapped' }
        ];
        
        const transactionsList = document.querySelector('.transactions-list');
        transactionsList.innerHTML = '';
        
        transactions.forEach(trans => {
            const amountClass = trans.amount.startsWith('+') ? 'positive' : trans.amount.startsWith('-') ? 'negative' : '';
            
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-icon ${trans.type}">
                    <i class="fas fa-${trans.type === 'receive' ? 'arrow-down' : trans.type === 'send' ? 'arrow-up' : trans.type === 'stake' ? 'lock' : 'exchange-alt'}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${trans.title}</div>
                    <div class="transaction-time">${trans.time}</div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${trans.amount}
                    <div class="transaction-value">${trans.value}</div>
                </div>
            `;
            transactionsList.appendChild(transactionItem);
        });
    }
    
    // Simulate live price updates
    setInterval(() => {
        const balanceElement = document.getElementById('totalBalance');
        if (balanceElement && walletScreen.style.display === 'flex') {
            const currentBalance = parseFloat(balanceElement.textContent.replace(/[^0-9.-]+/g, ""));
            const fluctuation = (Math.random() - 0.5) * 0.01; // ±0.5%
            const newBalance = currentBalance * (1 + fluctuation);
            balanceElement.textContent = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            // Update asset changes
            document.querySelectorAll('.asset-change').forEach(change => {
                const isPositive = Math.random() > 0.4;
                const changePercent = (Math.random() * 5).toFixed(1);
                
                if (isPositive) {
                    change.className = 'asset-change positive';
                    change.innerHTML = `<i class="fas fa-arrow-up"></i> ${changePercent}%`;
                } else {
                    change.className = 'asset-change negative';
                    change.innerHTML = `<i class="fas fa-arrow-down"></i> ${changePercent}%`;
                }
            });
        }
    }, 15000); // Update every 15 seconds
});
