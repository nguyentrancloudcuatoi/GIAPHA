// Khởi tạo biến
let memberChart;
let donationChart;

// Hàm cập nhật thống kê
function updateStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const familyMembers = JSON.parse(localStorage.getItem(`familyTree_${currentUser.id}`) || '[]');
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');

    // Cập nhật tổng thành viên
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = familyMembers.length;

    // Cập nhật tổng công đức
    const totalDonation = donations.reduce((sum, donation) => sum + donation.amount, 0);
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(totalDonation)
            .replace('₫', 'đ');

    // Cập nhật thành viên mới trong tháng
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newMembers = familyMembers.filter(member => {
        const addedDate = new Date(member.addedDate);
        return addedDate.getMonth() === currentMonth && 
               addedDate.getFullYear() === currentYear;
    });
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = newMembers.length;

    // Cập nhật công đức trong tháng
    const monthlyDonations = donations.filter(donation => {
        const donationDate = new Date(donation.date);
        return donationDate.getMonth() === currentMonth && 
               donationDate.getFullYear() === currentYear;
    });
    const monthlyTotal = monthlyDonations.reduce((sum, donation) => sum + donation.amount, 0);
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(monthlyTotal)
            .replace('₫', 'đ');

    // Cập nhật danh sách hoạt động gần đây
    updateRecentActivities(familyMembers, donations);
}

// Hàm cập nhật biểu đồ thành viên
function updateMemberChart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const familyMembers = JSON.parse(localStorage.getItem(`familyTree_${currentUser.id}`) || '[]');
    
    const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const memberData = new Array(12).fill(0);

    familyMembers.forEach(member => {
        const addedDate = new Date(member.addedDate);
        if (addedDate.getFullYear() === new Date().getFullYear()) {
            memberData[addedDate.getMonth()]++;
        }
    });

    const ctx = document.getElementById('memberChart').getContext('2d');
    if (memberChart) {
        memberChart.destroy();
    }

    memberChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Thành viên mới',
                data: memberData,
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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

// Hàm cập nhật biểu đồ công đức
function updateDonationChart() {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    
    const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const donationData = new Array(12).fill(0);

    donations.forEach(donation => {
        const donationDate = new Date(donation.date);
        if (donationDate.getFullYear() === new Date().getFullYear()) {
            donationData[donationDate.getMonth()] += donation.amount;
        }
    });

    const ctx = document.getElementById('donationChart').getContext('2d');
    if (donationChart) {
        donationChart.destroy();
    }

    donationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Công đức (VNĐ)',
                data: donationData,
                backgroundColor: '#1cc88a',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(value).replace('₫', 'đ');
                        }
                    }
                }
            }
        }
    });
}

// Hàm cập nhật hoạt động gần đây
function updateRecentActivities(familyMembers, donations) {
    // Cập nhật danh sách thành viên mới
    const recentMembers = familyMembers
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, 5);
    
    const memberList = document.querySelector('.activity-card:first-child .activity-list');
    memberList.innerHTML = recentMembers.map(member => `
        <li>
            <i class="fas fa-user-plus"></i>
            <div class="activity-info">
                <p>${member.name}</p>
                <small>${new Date(member.addedDate).toLocaleDateString('vi-VN')}</small>
            </div>
        </li>
    `).join('');

    // Cập nhật danh sách công đức gần đây
    const recentDonations = donations
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const donationList = document.querySelector('.activity-card:last-child .activity-list');
    donationList.innerHTML = recentDonations.map(donation => `
        <li>
            <i class="fas fa-hand-holding-heart"></i>
            <div class="activity-info">
                <p>${donation.name}</p>
                <small>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                    .format(donation.amount)
                    .replace('₫', 'đ')} - ${new Date(donation.date).toLocaleDateString('vi-VN')}</small>
            </div>
        </li>
    `).join('');
}

// Khởi tạo dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    updateMemberChart();
    updateDonationChart();

    // Cập nhật khi có thay đổi trong localStorage
    window.addEventListener('storage', function(e) {
        if (e.key.includes('familyTree_') || e.key === 'donations') {
            updateStats();
            updateMemberChart();
            updateDonationChart();
        }
    });
});