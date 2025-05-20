// Lấy các elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const statusFilter = document.getElementById('statusFilter');
const addMemberBtn = document.getElementById('addMemberBtn');
const memberModal = document.getElementById('memberModal');
const memberForm = document.getElementById('memberForm');
const memberTableBody = document.getElementById('memberTableBody');

// Lấy danh sách users từ localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Lấy thông tin gia phả hiện tại
function getCurrentFamilyTree() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let familyMembers = JSON.parse(localStorage.getItem(`familyTree_${currentUser.id}`) || '[]');
    return familyMembers;
}

// Lưu thành viên vào gia phả
function saveMemberToFamilyTree(member) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let familyMembers = getCurrentFamilyTree();
    
    if (!familyMembers.some(m => m.email === member.email)) {
        familyMembers.push({
            id: Date.now().toString(),
            name: member.name,
            email: member.email,
            status: 'active',
            role: document.getElementById('memberRole').value,
            generation: 1, // Mặc định là đời thứ 1
            addedDate: new Date().toISOString()
        });
        localStorage.setItem(`familyTree_${currentUser.id}`, JSON.stringify(familyMembers));
        return true;
    }
    return false;
}

// Hiển thị danh sách thành viên
function displayMembers(members) {
    const users = getUsers();
    memberTableBody.innerHTML = members.map(member => {
        const user = users.find(u => u.email === member.email);
        const userRole = user ? user.role : 'user';
        return `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${getRoleName(member.role)}</td>
            <td><span class="role-badge ${userRole}">${userRole === 'editor' ? 'Editor' : 'User'}</span></td>
            <td><span class="status-badge status-${member.status}">${member.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" title="Chỉnh sửa" onclick="editMember('${member.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Xóa" onclick="deleteMember('${member.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `}).join('');
}

// Hàm chuyển đổi mã vai trò sang tên hiển thị
function getRoleName(role) {
    const roleMap = {
        'ong_noi': 'Ông nội',
        'ba_noi': 'Bà nội',
        'ong_ngoai': 'Ông ngoại',
        'ba_ngoai': 'Bà ngoại',
        'cha': 'Cha',
        'me': 'Mẹ',
        'chu': 'Chú',
        'bac': 'Bác',
        'co': 'Cô',
        'di': 'Dì',
        'anh': 'Anh',
        'chi': 'Chị',
        'em': 'Em',
        'chau': 'Cháu'
    };
    return roleMap[role] || role;
}

// Tìm kiếm thành viên
function searchMembers() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const members = getCurrentFamilyTree();
    
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm) || 
                            member.email.toLowerCase().includes(searchTerm);
        const matchesStatus = statusValue === 'all' || member.status === statusValue;
        return matchesSearch && matchesStatus;
    });
    
    displayMembers(filteredMembers);
}

// Xử lý thêm thành viên mới
memberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = memberForm.querySelector('#memberEmail').value;
    
    try {
        const users = getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('Không tìm thấy người dùng với email này!');
        }
        
        const added = saveMemberToFamilyTree(user);
        if (added) {
            alert('Thêm thành viên thành công!');
            closeModal();
            displayMembers(getCurrentFamilyTree());
        } else {
            throw new Error('Thành viên này đã có trong gia phả!');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Xử lý hiển thị modal
addMemberBtn.addEventListener('click', () => {
    memberModal.style.display = 'block';
});

// Đóng modal
function closeModal() {
    memberModal.style.display = 'none';
    memberForm.reset();
}

// Xử lý tìm kiếm
searchBtn.addEventListener('click', searchMembers);
searchInput.addEventListener('keyup', searchMembers);
statusFilter.addEventListener('change', searchMembers);

// Khởi tạo hiển thị ban đầu
displayMembers(getCurrentFamilyTree());

// Hàm xử lý xóa thành viên
function deleteMember(memberId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.role !== 'editor') {
        alert('Bạn không có quyền xóa thành viên!');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
        const members = getCurrentFamilyTree();
        const filteredMembers = members.filter(m => m.id !== memberId);
        localStorage.setItem(`familyTree_${currentUser.id}`, JSON.stringify(filteredMembers));
        displayMembers(filteredMembers);
    }
}

// Thêm hàm đóng modal chỉnh sửa
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.remove();
    }
}

// Thêm sự kiện click cho nút đóng modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            if (modal.id === 'editModal') {
                modal.remove();
            }
        }
    }
});

// Thêm CSS để đảm bảo modal hiển thị đúng
const style = document.createElement('style');
style.textContent = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        border-radius: 5px;
    }
`;

// Thêm hàm chỉnh sửa thành viên
function editMember(memberId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.role !== 'editor') {
        alert('Bạn không có quyền chỉnh sửa thành viên!');
        return;
    }
    
    const members = getCurrentFamilyTree();
    const member = members.find(m => m.id === memberId);
    
    if (!member) return;
    
    const users = getUsers();
    const user = users.find(u => u.email === member.email);
    const userRole = user ? user.role : 'user';

    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="closeEditModal()">&times;</span>
            <h2>Chỉnh sửa thành viên</h2>
            <form id="editMemberForm">
                <div class="form-group">
                    <label for="editName">Tên:</label>
                    <input type="text" id="editName" value="${member.name}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email:</label>
                    <input type="email" id="editEmail" value="${member.email}" readonly>
                </div>
                <div class="form-group">
                    <label for="editRole">Vai trò trong gia phả:</label>
                    <select id="editRole" required>
                        <option value="ong_noi" ${member.role === 'ong_noi' ? 'selected' : ''}>Ông nội</option>
                        <option value="ba_noi" ${member.role === 'ba_noi' ? 'selected' : ''}>Bà nội</option>
                        <option value="ong_ngoai" ${member.role === 'ong_ngoai' ? 'selected' : ''}>Ông ngoại</option>
                        <option value="ba_ngoai" ${member.role === 'ba_ngoai' ? 'selected' : ''}>Bà ngoại</option>
                        <option value="cha" ${member.role === 'cha' ? 'selected' : ''}>Cha</option>
                        <option value="me" ${member.role === 'me' ? 'selected' : ''}>Mẹ</option>
                        <option value="chu" ${member.role === 'chu' ? 'selected' : ''}>Chú</option>
                        <option value="bac" ${member.role === 'bac' ? 'selected' : ''}>Bác</option>
                        <option value="co" ${member.role === 'co' ? 'selected' : ''}>Cô</option>
                        <option value="di" ${member.role === 'di' ? 'selected' : ''}>Dì</option>
                        <option value="anh" ${member.role === 'anh' ? 'selected' : ''}>Anh</option>
                        <option value="chi" ${member.role === 'chi' ? 'selected' : ''}>Chị</option>
                        <option value="em" ${member.role === 'em' ? 'selected' : ''}>Em</option>
                        <option value="chau" ${member.role === 'chau' ? 'selected' : ''}>Cháu</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editGeneration">Đời thứ:</label>
                    <input type="number" id="editGeneration" value="${member.generation}" min="1" required>
                </div>
                <div class="form-group">
                    <label for="editUserRole">Quyền hạn:</label>
                    <select id="editUserRole">
                        <option value="user" ${userRole === 'user' ? 'selected' : ''}>User</option>
                        <option value="editor" ${userRole === 'editor' ? 'selected' : ''}>Editor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editStatus">Trạng thái:</label>
                    <select id="editStatus">
                        <option value="active" ${member.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                        <option value="inactive" ${member.status === 'inactive' ? 'selected' : ''}>Không hoạt động</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Lưu</button>
                    <button type="button" class="btn-secondary" onclick="closeEditModal()">Hủy</button>
                </div>
            </form>
        </div>
    `;
    
    const editModal = document.createElement('div');
    editModal.id = 'editModal';
    editModal.className = 'modal';
    editModal.innerHTML = modalContent;
    document.body.appendChild(editModal);
    editModal.style.display = 'block';
    
    // Xử lý submit form chỉnh sửa
    document.getElementById('editMemberForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Cập nhật thông tin thành viên
        const updatedMember = {
            ...member,
            name: document.getElementById('editName').value,
            role: document.getElementById('editRole').value,
            generation: parseInt(document.getElementById('editGeneration').value),
            status: document.getElementById('editStatus').value
        };
        
        // Cập nhật quyền hạn trong danh sách users
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === member.email);
        if (userIndex !== -1) {
            users[userIndex].role = document.getElementById('editUserRole').value;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Cập nhật thành viên trong gia phả
        const members = getCurrentFamilyTree();
        const index = members.findIndex(m => m.id === memberId);
        if (index !== -1) {
            members[index] = updatedMember;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            localStorage.setItem(`familyTree_${currentUser.id}`, JSON.stringify(members));
            
            closeEditModal();
            displayMembers(members);
            alert('Cập nhật thành viên thành công!');
        }
    });
}