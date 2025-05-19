// Khởi tạo dữ liệu
let donations = JSON.parse(localStorage.getItem('donations') || '[]');
let editingId = null;

// Format số tiền
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount).replace('₫', 'đ');
}

// Lấy thông tin thành viên từ gia phả
function getFamilyMember(email) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const familyMembers = JSON.parse(localStorage.getItem(`familyTree_${currentUser.id}`) || '[]');
    return familyMembers.find(member => member.email === email);
}

// Render bảng công đức
function renderDonations(data = donations) {
    const tbody = document.getElementById('donationTableBody');
    tbody.innerHTML = '';
    
    data.forEach((donation, index) => {
        const member = getFamilyMember(donation.email);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="left-padding">${member ? member.name : donation.name}</td>
            <td class="left-padding">${donation.date}</td>
            <td class="left-padding money-col">${formatMoney(donation.amount)}</td>
            <td class="action-col">
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editDonation(${index})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteDonation(${index})" title="Xóa">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Mở modal thêm/sửa công đức
function openModal(isEdit = false) {
    const modal = document.getElementById('donationModal');
    modal.style.display = 'flex';
    if (!isEdit) {
        document.getElementById('donationForm').reset();
        editingId = null;
        
        // Tự động điền thông tin người dùng hiện tại từ gia phả
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const familyMember = getFamilyMember(currentUser.email);
            if (familyMember) {
                document.getElementById('name').value = familyMember.name;
                document.getElementById('name').readOnly = true;
            }
        }
    }
}

// Thêm công đức mới
function addDonation(event) {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const familyMember = getFamilyMember(currentUser.email);
    const name = familyMember ? familyMember.name : currentUser.name;
    const date = document.getElementById('date').value;
    const amount = parseInt(document.getElementById('amount').value);

    const donationData = {
        name,
        email: currentUser.email,
        date,
        amount
    };

    if (editingId !== null) {
        donations[editingId] = donationData;
    } else {
        donations.push(donationData);
    }

    localStorage.setItem('donations', JSON.stringify(donations));
    renderDonations();
    closeModal();
}

// Đóng modal
function closeModal() {
    const modal = document.getElementById('donationModal');
    modal.style.display = 'none';
    document.getElementById('donationForm').reset();
    editingId = null;
}

// Sửa công đức
function editDonation(index) {
    editingId = index;
    const donation = donations[index];
    
    document.getElementById('name').value = donation.name;
    document.getElementById('date').value = donation.date;
    document.getElementById('amount').value = donation.amount;
    
    openModal(true);
}

// Xóa công đức
function deleteDonation(index) {
    if (confirm('Bạn có chắc chắn muốn xóa công đức này?')) {
        donations.splice(index, 1);
        localStorage.setItem('donations', JSON.stringify(donations));
        renderDonations();
    }
}

// Tìm kiếm công đức
function searchDonations(keyword) {
    const filtered = donations.filter(d => 
        d.name.toLowerCase().includes(keyword.toLowerCase()) ||
        d.date.includes(keyword) ||
        d.amount.toString().includes(keyword)
    );
    renderDonations(filtered);
}

// Khởi tạo sự kiện
document.addEventListener('DOMContentLoaded', function() {
    // Render dữ liệu ban đầu
    renderDonations();

    // Sự kiện thêm mới
    document.querySelector('.add-donation-btn').addEventListener('click', () => openModal());

    // Sự kiện submit form
    document.getElementById('donationForm').addEventListener('submit', addDonation);

    // Sự kiện đóng modal
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);

    // Sự kiện tìm kiếm
    document.querySelector('.search-input').addEventListener('input', (e) => {
        searchDonations(e.target.value);
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('donationModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});