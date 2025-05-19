const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})

// Xử lý đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = loginForm.querySelector('.btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang đăng nhập...';
    
    try {
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
    
        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            throw new Error('Vui lòng nhập đầy đủ email và mật khẩu!');
        }
    
        if (!isValidEmail(email)) {
            throw new Error('Email không hợp lệ!');
        }
    
        console.log('Đang đăng nhập với:', email);
        
        let userRole = await checkUserRole(email, password);
        console.log('Role người dùng:', userRole);
        
        if (!userRole) {
            throw new Error('Email hoặc mật khẩu không chính xác!');
        }
    
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', email);
        
        // Chuyển hướng dựa trên role
        // Thay đổi đường dẫn thành đường dẫn tuyệt đối
        switch(userRole) {
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
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;
    const name = registerForm.querySelector('input[type="text"]').value;

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

        // Giả lập đăng ký thành công
        const success = await registerUser(email, password, name);
        
        if (success) {
            // Lưu thông tin đăng ký vào localStorage
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            
            window.location.href = '../users/index.html';
        } else {
            throw new Error('Đăng ký không thành công! Vui lòng thử lại.');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm giả lập kiểm tra role người dùng
async function checkUserRole(email, password) {
    // Giả lập delay để mô phỏng gọi API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Kiểm tra tài khoản admin
    if (email === 'admin@example.com' && password === 'admin123') {
        return 'admin';
    }
    // Kiểm tra tài khoản editor
    if (email === 'editor@example.com' && password === 'editor123') {
        return 'editor';
    }
    // Kiểm tra tài khoản user
    if (email === 'user@example.com' && password === 'user123') {
        return 'user';
    }
    return null;
}

// Hàm giả lập đăng ký người dùng
async function registerUser(email, password, name) {
    // Giả lập delay để mô phỏng gọi API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Kiểm tra email đã tồn tại
    if (email === 'admin@example.com' || email === 'editor@example.com' || email === 'user@example.com') {
        throw new Error('Email đã được sử dụng!');
    }
    
    return true;
}