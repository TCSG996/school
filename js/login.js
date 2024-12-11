// 登录表单处理
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('尝试登录:', username);
    hideError();
    
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => {
        console.log('服务器响应:', response);
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.text().then(text => {
                console.log('响应内容:', text);
                if (text.includes('error')) {
                    showError(text.split(':')[1] || '登录失败');
                }
            });
        }
    })
    .catch(error => {
        console.error('登录错误:', error);
        showError('登录失败，请稍后重试');
    });
    
    return false;
}

// 表单验证
function validateLoginForm(username, password) {
    let isValid = true;

    if (!username) {
        showError('usernameError', '请输入用户名');
        isValid = false;
    }

    if (!password) {
        showError('passwordError', '请输入密码');
        isValid = false;
    }

    return isValid;
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// 隐藏错误信息
function hideError() {
    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';
}

// 切换登录方式
function switchLoginType(type) {
    const accountLogin = document.getElementById('accountLogin');
    const qrLogin = document.getElementById('qrLogin');
    const accountTab = document.querySelector('[data-type="account"]');
    const qrTab = document.querySelector('[data-type="qr"]');

    if (type === 'account') {
        accountLogin.style.display = 'block';
        qrLogin.style.display = 'none';
        accountTab.classList.add('active');
        qrTab.classList.remove('active');
    } else {
        accountLogin.style.display = 'none';
        qrLogin.style.display = 'block';
        accountTab.classList.remove('active');
        qrTab.classList.add('active');
    }
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 输入框焦点事件
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            hideError();
        });
    });

    // 登录方式切换
    const tabs = document.querySelectorAll('.login-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchLoginType(tab.dataset.type);
        });
    });
}); 