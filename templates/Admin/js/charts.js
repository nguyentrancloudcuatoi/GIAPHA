document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật thống kê tổng quan
    updateStatistics();

    // Khởi tạo biểu đồ
    initializeCharts();

    // Lắng nghe sự kiện thay đổi localStorage
    window.addEventListener('storage', updateStatistics);
});

// Hàm cập nhật thống kê
function updateStatistics() {
    // Lấy dữ liệu từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const giaPhas = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');

    // Cập nhật tổng số người dùng
    document.getElementById('totalUsers').textContent = users.length;

    // Cập nhật tổng số gia phả
    document.getElementById('totalTrees').textContent = giaPhas.length;

    // Tính số người dùng mới trong tháng
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const newUsers = users.filter(user => new Date(user.registrationDate) >= firstDayOfMonth).length;
    document.getElementById('newUsers').textContent = newUsers;

    // Tính tỷ lệ tăng trưởng
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthUsers = users.filter(user => {
        const regDate = new Date(user.registrationDate);
        return regDate >= lastMonth && regDate < firstDayOfMonth;
    }).length;

    const growthRate = lastMonthUsers === 0 ? 100 : ((newUsers - lastMonthUsers) / lastMonthUsers * 100);
    document.getElementById('growthRate').textContent = `${growthRate.toFixed(1)}%`;
}

// Hàm khởi tạo biểu đồ
function initializeCharts() {
    // Khởi tạo biểu đồ người dùng
    initializeUserChart();
    
    // Khởi tạo biểu đồ gia phả
    initializeTreeChart();
}

// Hàm khởi tạo biểu đồ người dùng
function initializeUserChart() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const monthlyData = getMonthlyData(users, 'registrationDate');

    const ctx = document.getElementById('userChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Số người dùng mới',
                data: monthlyData.data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Thống kê người dùng theo tháng'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Hàm khởi tạo biểu đồ gia phả
function initializeTreeChart() {
    const giaPhas = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');
    const monthlyData = getMonthlyData(giaPhas, 'ngayTao');

    const ctx = document.getElementById('treeChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Số gia phả mới',
                data: monthlyData.data,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Thống kê gia phả theo tháng'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Hàm lấy dữ liệu theo tháng
function getMonthlyData(items, dateField) {
    const monthLabels = [];
    const monthData = new Array(12).fill(0);
    
    // Tạo nhãn cho 12 tháng
    const months = ['Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6', 'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12'];
    const currentMonth = new Date().getMonth();
    
    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        monthLabels.push(months[monthIndex]);
    }

    // Tính số lượng item cho mỗi tháng
    items.forEach(item => {
        const date = new Date(item[dateField]);
        const monthsAgo = (new Date().getMonth() - date.getMonth() + 12) % 12;
        if (monthsAgo < 12) {
            monthData[11 - monthsAgo]++;
        }
    });

    return {
        labels: monthLabels,
        data: monthData
    };
}