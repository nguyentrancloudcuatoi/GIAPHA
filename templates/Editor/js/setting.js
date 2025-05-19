// Lấy thông tin người dùng hiện tại từ localStorage
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        window.location.href = '/templates/login/SignUp_LogIn_Form.html';
        return null;
    }
    return JSON.parse(userJson);
}

// Cập nhật thông tin form với dữ liệu người dùng
function updateUserInfo() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.querySelector('input[placeholder="Nhập họ và tên"]').value = currentUser.name;
        document.querySelector('input[placeholder="Nhập email"]').value = currentUser.email;
    }
}

// Xử lý cập nhật thông tin cá nhân
document.querySelector('.settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.querySelector('input[placeholder="Nhập họ và tên"]').value;
    const email = document.querySelector('input[placeholder="Nhập email"]').value;
    const phone = document.querySelector('input[placeholder="Nhập số điện thoại"]').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Cập nhật trong danh sách users
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name,
                email,
                phone
            };
            localStorage.setItem('users', JSON.stringify(users));
            
            // Cập nhật thông tin người dùng hiện tại
            currentUser.name = name;
            currentUser.email = email;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            alert('Cập nhật thông tin thành công!');
        }
    }
});

// Xử lý đổi mật khẩu
document.querySelectorAll('.settings-form')[1].addEventListener('submit', function(e) {
    e.preventDefault();
    const currentPassword = document.querySelector('input[placeholder="Nhập mật khẩu hiện tại"]').value;
    const newPassword = document.querySelector('input[placeholder="Nhập mật khẩu mới"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Nhập lại mật khẩu mới"]').value;

    if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới không khớp!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1 && users[userIndex].password === currentPassword) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Đổi mật khẩu thành công!');
            this.reset();
        } else {
            alert('Mật khẩu hiện tại không chính xác!');
        }
    }
});

// Xử lý đăng xuất
document.querySelector('.btn-danger').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = '/index.html';
});

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
});