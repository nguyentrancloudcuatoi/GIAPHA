// Khởi tạo biểu đồ người dùng
function initUserChart() {
    const userCtx = document.getElementById('userChart');
        if (userCtx) {
        // Gọi API để lấy dữ liệu người dùng theo tháng
        fetch('/api/statistics/users/monthly')
            .then(response => response.json())
            .then(data => {
                new Chart(userCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'Số lượng người dùng mới',
                            data: data.values,
                            borderColor: '#4e73df',
                            tension: 0.4,
                            fill: true,
                            backgroundColor: 'rgba(78, 115, 223, 0.1)'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            });
    }
}

// Khởi tạo biểu đồ gia phả
function initTreeChart() {
    const treeCtx = document.getElementById('treeChart');
    if (treeCtx) {
        // Gọi API để lấy dữ liệu gia phả theo tháng
        fetch('/api/statistics/trees/monthly')
            .then(response => response.json())
            .then(data => {
                new Chart(treeCtx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'Số lượng gia phả mới',
                            data: data.values,
                            backgroundColor: '#1cc88a',
                            borderRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            });
    }
}

// Cập nhật số liệu thống kê tổng quan
function updateDashboardStats() {
    fetch('/api/statistics/dashboard')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalUsers').textContent = data.totalUsers.toLocaleString();
            document.getElementById('totalTrees').textContent = data.totalTrees.toLocaleString();
            document.getElementById('newUsers').textContent = data.newUsers.toLocaleString();
            document.getElementById('growthRate').textContent = data.growthRate + '%';
        });
}

// Khởi tạo tất cả biểu đồ và cập nhật số liệu
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    initUserChart();
    initTreeChart();
});