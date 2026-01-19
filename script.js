document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const container = document.getElementById('container');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const toast = document.getElementById('toast');
    
    // Mobile Navigation Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const notificationBtn = document.getElementById('notificationBtn');
    const mobileSignIn = document.getElementById('mobileSignIn');
    const mobileSignUp = document.getElementById('mobileSignUp');
    const signUpLink = document.getElementById('signUpLink');
    const signInLink = document.getElementById('signInLink');
    
    // Form switching for mobile
    mobileSignIn.addEventListener('click', function() {
        mobileSignIn.classList.add('active');
        mobileSignUp.classList.remove('active');
        document.querySelector('.sign-in-container').classList.add('active');
        document.querySelector('.sign-up-container').classList.remove('active');
    });
    
    mobileSignUp.addEventListener('click', function() {
        mobileSignUp.classList.add('active');
        mobileSignIn.classList.remove('active');
        document.querySelector('.sign-up-container').classList.add('active');
        document.querySelector('.sign-in-container').classList.remove('active');
    });
    
    signUpLink?.addEventListener('click', function(e) {
        e.preventDefault();
        mobileSignUp.click();
    });
    
    signInLink?.addEventListener('click', function(e) {
        e.preventDefault();
        mobileSignIn.click();
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Notification button click
    notificationBtn.addEventListener('click', function() {
        showToast('You have 3 unread notifications', 'info');
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
    
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showToast(`${action} feature coming soon!`, 'info');
        });
    });
    
    // Balance action buttons
    document.querySelectorAll('.balance-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showToast('Additional options coming soon!', 'info');
        });
    });
    
    // Try to load users from localStorage, otherwise use default
    let users = loadUsersFromStorage();
    
    // Login Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
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
            // Successful login
            showToast('Login successful! Welcome to your wallet! 🚀', 'success');
            
            // Store current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            
            // Show welcome screen after delay
            setTimeout(() => {
                showWelcomeScreen(user);
            }, 1000);
            
            // Reset form
            loginForm.reset();
        } else {
            // Failed login
            showToast('Invalid email or password', 'error');
        }
    });
    
    // Signup Form Submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters long', 'error');
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
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            showToast('An account with this email already exists', 'error');
            return;
        }
        
        // Create new user object with wallet data
        const newUser = {
            id: generateId(),
            name: name,
            email: email,
            password: password,
            joinDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            wallet: {
                totalBalance: 12450.75,
                availableBalance: 8240.50,
                stakedBalance: 4210.25,
                assets: [
                    { name: 'Bitcoin', symbol: 'BTC', amount: 0.425, value: 18245.50 },
                    { name: 'Ethereum', symbol: 'ETH', amount: 3.42, value: 6850.20 },
                    { name: 'USDC', symbol: 'USDC', amount: 5250, value: 5250.00 },
                    { name: 'Cardano', symbol: 'ADA', amount: 2150, value: 850.75 }
                ]
            }
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        saveUsersToStorage(users);
        
        // Show success message
        showToast('Account created successfully! Your wallet is ready! 🎉', 'success');
        
        // Switch to login form
        mobileSignIn.click();
        
        // Auto-fill login email
        document.getElementById('loginEmail').value = email;
        
        // Reset form
        signupForm.reset();
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        showToast('Logged out successfully', 'info');
        
        // Clear current user from localStorage
        localStorage.removeItem('currentUser');
        
        // Hide welcome screen
        welcomeScreen.style.display = 'none';
        
        // Show login form
        container.style.display = 'flex';
        
        // Reset to sign in form on mobile
        if (window.innerWidth <= 1024) {
            mobileSignIn.click();
        }
    });
    
    // Check if user is already logged in
    checkExistingLogin();
    
    // Helper Functions
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = 'toast show ' + type;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function showWelcomeScreen(user) {
        // Hide login container
        container.style.display = 'none';
        
        // Update welcome screen with user data
        document.getElementById('welcomeUserName').textContent = user.name;
        document.getElementById('welcomeUserEmail').textContent = user.email;
        
        // Update wallet balances
        if (user.wallet) {
            document.getElementById('totalBalance').textContent = user.wallet.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
            document.getElementById('availableBalance').textContent = user.wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
            document.getElementById('stakedBalance').textContent = user.wallet.stakedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        }
        
        // Show welcome screen
        welcomeScreen.style.display = 'block';
        
        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    }
    
    function loadUsersFromStorage() {
        // First try to get from localStorage
        const storedUsers = localStorage.getItem('users');
        
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            // Default users for demo purposes
            return [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    joinDate: 'January 15, 2024',
                    wallet: {
                        totalBalance: 12450.75,
                        availableBalance: 8240.50,
                        stakedBalance: 4210.25,
                        assets: [
                            { name: 'Bitcoin', symbol: 'BTC', amount: 0.425, value: 18245.50 },
                            { name: 'Ethereum', symbol: 'ETH', amount: 3.42, value: 6850.20 },
                            { name: 'USDC', symbol: 'USDC', amount: 5250, value: 5250.00 },
                            { name: 'Cardano', symbol: 'ADA', amount: 2150, value: 850.75 }
                        ]
                    }
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    password: 'securepass',
                    joinDate: 'February 3, 2024',
                    wallet: {
                        totalBalance: 8920.30,
                        availableBalance: 6420.30,
                        stakedBalance: 2500.00,
                        assets: [
                            { name: 'Bitcoin', symbol: 'BTC', amount: 0.2, value: 8580.00 },
                            { name: 'Ethereum', symbol: 'ETH', amount: 1.5, value: 3000.00 },
                            { name: 'Solana', symbol: 'SOL', amount: 25, value: 1340.30 }
                        ]
                    }
                }
            ];
        }
    }
    
    function saveUsersToStorage(usersArray) {
        localStorage.setItem('users', JSON.stringify(usersArray));
    }
    
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function checkExistingLogin() {
        const currentUser = localStorage.getItem('currentUser');
        const rememberMe = localStorage.getItem('rememberMe');
        
        if (currentUser && rememberMe) {
            const user = JSON.parse(currentUser);
            showWelcomeScreen(user);
        } else if (currentUser) {
            // Optional: Auto-login only if remember me was checked
            // For demo purposes, we'll auto-login anyway
            const user = JSON.parse(currentUser);
            showWelcomeScreen(user);
        }
    }
    
    // Update wallet values periodically (simulating market changes)
    function simulateMarketChanges() {
        setInterval(() => {
            const totalBalance = document.getElementById('totalBalance');
            const availableBalance = document.getElementById('availableBalance');
            const stakedBalance = document.getElementById('stakedBalance');
            
            if (totalBalance && availableBalance && stakedBalance) {
                // Small random fluctuation
                const fluctuation = (Math.random() - 0.5) * 0.02; // ±1%
                
                const currentTotal = parseFloat(totalBalance.textContent.replace(/,/g, ''));
                const currentAvailable = parseFloat(availableBalance.textContent.replace(/,/g, ''));
                const currentStaked = parseFloat(stakedBalance.textContent.replace(/,/g, ''));
                
                if (!isNaN(currentTotal)) {
                    const newTotal = currentTotal * (1 + fluctuation);
                    totalBalance.textContent = newTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
                
                // Update asset change indicators
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
        }, 10000); // Update every 10 seconds
    }
    
    // Start market simulation
    simulateMarketChanges();
});