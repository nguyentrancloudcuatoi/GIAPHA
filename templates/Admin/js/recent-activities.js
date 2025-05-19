// Lấy danh sách người dùng từ localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Cập nhật hoạt động gần đây
document.addEventListener('DOMContentLoaded', function() {
    // Hàm cập nhật danh sách gia phả mới
    function updateRecentFamilyTrees() {
        const danhSachGiaPha = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');
        
        // Sắp xếp theo ngày tạo mới nhất
        const sortedGiaPha = [...danhSachGiaPha].sort((a, b) => {
            return new Date(b.ngayTao) - new Date(a.ngayTao);
        });

        // Lấy 5 gia phả mới nhất
        const recentGiaPha = sortedGiaPha.slice(0, 5);
        
        // Hiển thị trong danh sách
        const activityList = document.querySelector('.activity-card:nth-child(2) .activity-list');
        activityList.innerHTML = recentGiaPha.map(giaPha => `
            <li>
                <div class="activity-item">
                    <i class="fas fa-sitemap"></i>
                    <div class="activity-info">
                        <p class="activity-title">${giaPha.ten}</p>
                        <p class="activity-meta">
                            <span>Người quản lý: ${giaPha.nguoiQuanLy}</span>
                            <span>•</span>
                            <span>${giaPha.ngayTao}</span>
                        </p>
                    </div>
                </div>
            </li>
        `).join('');
    }

    // Cập nhật danh sách khi trang được tải
    updateRecentFamilyTrees();

    // Lắng nghe sự thay đổi trong localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'danhSachGiaPha') {
            updateRecentFamilyTrees();
        }
    });
});

// Lấy danh sách người dùng và sắp xếp theo ngày đăng ký mới nhất
const users = getUsers().sort((a, b) => 
    new Date(b.registrationDate) - new Date(a.registrationDate)
);

// Lấy 3 người dùng mới nhất
const recentUsers = users.slice(0, 3);

// Cập nhật danh sách người dùng mới
const newUsersList = document.querySelector('.activity-card:first-child .activity-list');
newUsersList.innerHTML = recentUsers.map(user => `
    <li>
        <span class="activity-name">${user.name}</span>
        <span class="activity-date">${formatDate(user.registrationDate)}</span>
    </li>
`).join('');