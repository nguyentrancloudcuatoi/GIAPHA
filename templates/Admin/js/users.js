// Các biến DOM
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const statusFilter = document.querySelector('.filters select:first-child');
const sortFilter = document.querySelector('.filters select:last-child');
const addButton = document.querySelector('.add-btn');
const tableBody = document.querySelector('table tbody');
const pagination = document.querySelector('.pagination');
const modal = document.getElementById('userModal');
const modalTitle = document.getElementById('modalTitle');
const userForm = document.getElementById('userForm');
const closeBtn = document.querySelector('.close');

// Cấu hình phân trang
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

// Lấy danh sách người dùng từ localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Lọc và sắp xếp người dùng
function filterAndSortUsers(users) {
    let filteredUsers = [...users];
    
    // Lọc theo trạng thái
    const status = statusFilter.value;
    if (status !== 'Tất cả trạng thái') {
        filteredUsers = filteredUsers.filter(user => 
            status === 'Hoạt động' ? !user.isLocked : user.isLocked
        );
    }
    
    // Lọc theo từ khóa tìm kiếm
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sắp xếp
    const sortBy = sortFilter.value;
    filteredUsers.sort((a, b) => {
        if (sortBy === 'Mới nhất') {
            return new Date(b.registrationDate) - new Date(a.registrationDate);
        } else {
            return new Date(a.registrationDate) - new Date(b.registrationDate);
        }
    });
    
    return filteredUsers;
}

// Tạo HTML cho một hàng trong bảng
function createUserRow(user) {
    return `
        <tr data-id="${user.id}">
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formatDate(user.registrationDate)}</td>
            <td><span class="role ${user.role}">${user.role}</span></td>
            <td>
                <span class="status ${user.isLocked ? 'locked' : 'active'}">
                    ${user.isLocked ? 'Đã khóa' : 'Hoạt động'}
                </span>
            </td>
            <td>
                <button class="action-btn edit" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn ${user.isLocked ? 'unlock' : 'lock'}" 
                        onclick="toggleUserStatus('${user.id}')">
                    <i class="fas fa-${user.isLocked ? 'unlock' : 'lock'}"></i>
                </button>
            </td>
        </tr>
    `;
}

// Hiển thị danh sách người dùng
function displayUsers() {
    const users = getUsers();
    const filteredUsers = filterAndSortUsers(users);
    
    // Tính toán phân trang
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    // Hiển thị người dùng
    tableBody.innerHTML = paginatedUsers.map(createUserRow).join('');
    
    // Cập nhật phân trang
    updatePagination(totalPages);
}

// Cập nhật nút phân trang
function updatePagination(totalPages) {
    let paginationHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Thay đổi trang
function changePage(page) {
    const users = getUsers();
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayUsers();
    }
}

// Mở modal
function openModal(mode, userId = null) {
    modalTitle.textContent = mode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng';
    userForm.dataset.mode = mode;
    userForm.dataset.userId = userId;
    
    if (mode === 'edit' && userId) {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userPassword').required = false;
            
            // Nếu role được thay đổi thành editor, lưu thông tin admin
            const roleSelect = document.getElementById('userRole');
            roleSelect.addEventListener('change', function() {
                if (this.value === 'editor') {
                    // Lấy ID của admin hiện tại từ session hoặc localStorage
                    const currentAdminId = localStorage.getItem('currentAdminId');
                    if (currentAdminId) {
                        upgradeToEditor(userId, currentAdminId);
                    }
                }
            });
        }
    } else {
        userForm.reset();
        document.getElementById('userPassword').required = true;
    }
    
    modal.style.display = 'block';
}

// Đóng modal
function closeModal() {
    modal.style.display = 'none';
    userForm.reset();
}

// Chỉnh sửa người dùng
function editUser(userId) {
    openModal('edit', userId);
}

// Xóa người dùng
function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    const users = getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    displayUsers();
}

// Khóa/Mở khóa người dùng
function toggleUserStatus(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    user.isLocked = !user.isLocked;
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Xử lý sự kiện
addButton.addEventListener('click', () => openModal('add'));
closeBtn.onclick = closeModal;
window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};

// Xử lý submit form
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!name || !email || (!password && userForm.dataset.mode === 'add')) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Email không hợp lệ!');
        return;
    }

    const users = getUsers();
    
    try {
        if (userForm.dataset.mode === 'add') {
            if (users.some(u => u.email === email)) {
                alert('Email đã tồn tại!');
                return;
            }
            
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                role,
                registrationDate: new Date().toISOString(),
                isLocked: false
            };
            
            users.push(newUser);
            alert('Thêm người dùng thành công!');
        } else {
            const userId = userForm.dataset.userId;
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    name,
                    email,
                    role,
                    password: password || users[userIndex].password
                };
                alert('Cập nhật thông tin thành công!');
            }
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
        closeModal();
    } catch (error) {
        console.error('Lỗi xử lý form:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
});

// Xử lý tìm kiếm
searchInput.addEventListener('input', displayUsers);
searchButton.addEventListener('click', displayUsers);

// Xử lý lọc và sắp xếp
statusFilter.addEventListener('change', displayUsers);
sortFilter.addEventListener('change', displayUsers);

// Hiển thị danh sách ban đầu
displayUsers();


// // Hàm nâng cấp tài khoản lên editor và lưu thông tin admin quản lý
// function upgradeToEditor(userId, adminId) {
//     const users = getUsers();
//     const user = users.find(u => u.id === userId);
    
//     if (!user) return;
    
//     // Cập nhật role và thêm thông tin admin quản lý
//     user.role = 'editor';
//     user.managedBy = adminId; // Lưu ID của admin quản lý
//     user.upgradeDate = new Date().toISOString();
    
//     localStorage.setItem('users', JSON.stringify(users));
//     displayUsers();
// }

// // Sửa lại hàm openModal để thêm thông tin admin quản lý khi nâng cấp role
// function openModal(mode, userId = null) {
//     // ... existing code ...
//     }