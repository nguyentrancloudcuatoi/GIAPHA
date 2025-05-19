const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');

// Xử lý chuyển đổi form
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm lưu thông tin người dùng vào localStorage
function saveUserToLocalStorage(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
        ...userData,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

// Hàm lưu thông tin người dùng hiện tại
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }));
}

// Hàm chuyển hướng theo role
function redirectByRole(role) {
    switch(role) {
        case 'admin':
            window.location.href = '../Admin/index.html';
            break;
        case 'editor':
            window.location.href = '../Editor/index.html';
            break;
        case 'user':
            window.location.href = '../users/index.html';
            break;
        default:
            throw new Error('Role không hợp lệ!');
    }
}

// Xử lý đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = loginForm.querySelector('.btn');
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang đăng nhập...';

    try {
        if (!email || !password) {
            throw new Error('Vui lòng nhập đầy đủ email và mật khẩu!');
        }

        if (!isValidEmail(email)) {
            throw new Error('Email không hợp lệ!');
        }

        // Kiểm tra tài khoản mặc định
        if (email === 'admin@example.com' && password === 'admin123') {
            setCurrentUser({ id: 'admin', name: 'Admin', email, role: 'admin' });
            redirectByRole('admin');
            return;
        }

        // Kiểm tra trong localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setCurrentUser(user);
            redirectByRole(user.role);
        } else {
            throw new Error('Email hoặc mật khẩu không chính xác!');
        }
    } catch (error) {
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng nhập';
    }
});

// Xử lý đăng ký
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;
    const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!email || !password || !name) {
            throw new Error('Vui lòng nhập đầy đủ thông tin!');
        }

        if (!isValidEmail(email)) {
            throw new Error('Email không hợp lệ!');
        }

        if (password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
        }

        if (password !== confirmPassword) {
            throw new Error('Mật khẩu xác nhận không khớp!');
        }

        // Kiểm tra email đã tồn tại
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            throw new Error('Email đã được sử dụng!');
        }

        // Lưu thông tin người dùng mới
        const newUser = saveUserToLocalStorage({
            name,
            email,
            password,
            role: 'user'
        });

        // Đăng nhập tự động sau khi đăng ký
        setCurrentUser(newUser);
        redirectByRole('user');
    } catch (error) {
        alert(error.message);
    }
});

// Hàm xử lý đăng xuất
function handleLogout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('currentUser');
    // Chuyển hướng về trang chủ
    window.location.href = '/index.html';
}

// Kiểm tra phiên đăng nhập khi tải trang
window.addEventListener('load', () => {
    // Kiểm tra xem đang ở trang đăng nhập không
    const isLoginPage = window.location.pathname.includes('SignUp_LogIn_Form.html');
    
    // Chỉ chuyển hướng nếu KHÔNG ở trang đăng nhập
    if (!isLoginPage) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            redirectByRole(user.role);
        }
    }
});
