// 注册表单处理
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;

    // 表单验证
    if (!validateRegisterForm(username, email, password, confirmPassword, phone)) {
        return false;
    }

    // 发送注册请求
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
            phone
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('注册成功！即将跳转到登录页面...');
            window.location.href = 'login.html';
        } else {
            showError('registerError', data.message || '注册失败，请稍后重试');
        }
    })
    .catch(error => {
        console.error('Register error:', error);
        showError('registerError', '注册失败，请稍后重试');
    });

    return false;
}

// 表单验证
function validateRegisterForm(username, email, password, confirmPassword, phone) {
    let isValid = true;

    // 用户名验证
    if (!username || username.length < 3) {
        showError('usernameError', '用户名至少需要3个字符');
        isValid = false;
    }

    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('emailError', '请输入有效的邮箱地址');
        isValid = false;
    }

    // 密码验证
    if (!password || password.length < 6) {
        showError('passwordError', '密码至少需要6个字符');
        isValid = false;
    }

    // 确认密码验证
    if (password !== confirmPassword) {
        showError('confirmPasswordError', '两次输入的密码不一致');
        isValid = false;
    }

    // 手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
        showError('phoneError', '请输入有效的手机号码');
        isValid = false;
    }

    return isValid;
}

// 显示错误信息
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// 清除错误信息
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 输入框焦点事件
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            clearError(input.id + 'Error');
        });
    });
});

// 发送验证码
function sendVerificationCode() {
    const email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        showError('emailError', '请输入有效的邮箱地址');
        return;
    }

    fetch('/api/verify-email/send-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('验证码已发送到您的邮箱，请查收');
            startCountdown();
        } else {
            showError('emailError', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('emailError', '发送验证码失败，请稍后重试');
    });
}

// 倒计时功能
function startCountdown() {
    const sendButton = document.getElementById('sendCodeBtn');
    let seconds = 60;
    sendButton.disabled = true;
    
    const timer = setInterval(() => {
        if (seconds > 0) {
            sendButton.textContent = `重新发送(${seconds}s)`;
            seconds--;
        } else {
            clearInterval(timer);
            sendButton.disabled = false;
            sendButton.textContent = '发送验证码';
        }
    }, 1000);
}

// 验证邮箱格式
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 