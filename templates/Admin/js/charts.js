// Khởi tạo biểu đồ người dùng
function initUserChart() {
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        new Chart(userCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{
                    label: 'Số lượng người dùng mới',
                    data: [150, 220, 180, 200, 250, 230, 280, 260, 240, 290, 270, 245],
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
    }
}

// Khởi tạo biểu đồ gia phả
function initTreeChart() {
    const treeCtx = document.getElementById('treeChart');
    if (treeCtx) {
        new Chart(treeCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{
                    label: 'Số lượng gia phả mới',
                    data: [45, 65, 55, 70, 80, 75, 85, 90, 82, 88, 85, 92],
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
    }
}

// Khởi tạo tất cả biểu đồ
document.addEventListener('DOMContentLoaded', function() {
    initUserChart();
    initTreeChart();
});