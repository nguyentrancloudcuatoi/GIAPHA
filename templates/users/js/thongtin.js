// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) {
        window.location.href = '/index.html';
    }
    return currentUser;
}

// Hàm load thông tin người dùng
function loadUserProfile() {
    const currentUser = checkLoginStatus();
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

    // Load thông tin vào form
    document.getElementById('name').value = userProfile.name || currentUser.name || '';
    document.getElementById('email').value = userProfile.email || currentUser.email || '';
    document.getElementById('phone').value = userProfile.phone || '';
    document.getElementById('address').value = userProfile.address || '';

    // Load avatar nếu có
    const avatarImg = document.querySelector('.avatar-img');
    if (userProfile.avatar) {
        avatarImg.src = userProfile.avatar;
    }
}

// Hàm validate dữ liệu form
function validateForm(data) {
    const errors = [];

    // Validate tên
    if (!data.name || data.name.length < 2) {
        errors.push('Tên phải có ít nhất 2 ký tự');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errors.push('Email không hợp lệ');
    }

    // Validate số điện thoại (nếu có)
    if (data.phone) {
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        if (!phoneRegex.test(data.phone)) {
            errors.push('Số điện thoại không hợp lệ (phải có 10-11 số và bắt đầu bằng 0 hoặc +84)');
        }
    }

    return errors;
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Hàm cập nhật thông tin người dùng
function updateUserData(formData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Cập nhật thông tin profile
        localStorage.setItem('userProfile', JSON.stringify({
            ...formData,
            updatedAt: new Date().toISOString()
        }));

        // Cập nhật trong danh sách users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...formData };
            localStorage.setItem('users', JSON.stringify(users));
        }

        return true;
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin:', error);
        return false;
    }
}

// Xử lý submit form
function handleProfileSubmit(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim()
    };

    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showNotification(errors[0], 'danger');
        return;
    }

    // Cập nhật thông tin
    if (updateUserData(formData)) {
        showNotification('Cập nhật thông tin thành công!');
    } else {
        showNotification('Có lỗi xảy ra khi cập nhật thông tin!', 'danger');
    }
}

// Xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    window.location.href = '/index.html';
}

// Khởi tạo các event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load thông tin người dùng
    loadUserProfile();

    // Xử lý submit form
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', handleProfileSubmit);

    // Xử lý avatar popup
    const avatarLink = document.getElementById('avatarLink');
    const popupMenu = document.getElementById('popupMenu');
    
    avatarLink.addEventListener('click', function(e) {
        e.preventDefault();
        popupMenu.classList.toggle('show');
    });

    // Đóng popup khi click ra ngoài
    document.addEventListener('click', function(e) {
        if (!avatarLink.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.classList.remove('show');
        }
    });
});