// Lấy thông tin người dùng hiện tại từ localStorage
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Lấy thông tin chi tiết người dùng từ danh sách users
function getUserDetails(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.id === userId);
}

// Hiển thị thông tin người dùng
function displayUserInfo() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = '../../login/SignUp_LogIn_Form.html';
        return;
    }

    const userDetails = getUserDetails(currentUser.id);
    if (userDetails) {
        document.getElementById('name').value = userDetails.name || '';
        document.getElementById('email').value = userDetails.email || '';
        document.getElementById('phone').value = userDetails.phone || '';
        document.getElementById('address').value = userDetails.address || '';
    }
}

// Cập nhật thông tin người dùng
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    try {
        // Kiểm tra email hợp lệ
        if (!isValidEmail(email)) {
            throw new Error('Email không hợp lệ!');
        }

        // Cập nhật trong danh sách users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name,
                email,
                phone,
                address
            };
            localStorage.setItem('users', JSON.stringify(users));

            // Cập nhật thông tin người dùng hiện tại
            setCurrentUser({
                ...currentUser,
                name,
                email
            });

            alert('Cập nhật thông tin thành công!');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Cập nhật thông tin người dùng hiện tại trong localStorage
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Hiển thị thông tin khi tải trang
document.addEventListener('DOMContentLoaded', displayUserInfo);
document.addEventListener('DOMContentLoaded', function() {
    const updateForm = document.querySelector('form');
    
    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy thông tin từ form
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };
    
        // Gửi request cập nhật thông tin
        fetch('/api/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cập nhật thông tin thành công!');
            } else {
                alert('Có lỗi xảy ra khi cập nhật thông tin!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin!');
        });
    });
});