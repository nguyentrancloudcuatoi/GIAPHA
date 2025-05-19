document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các biến
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const statusFilter = document.querySelector('.filters select:first-child');
    const sortFilter = document.querySelector('.filters select:last-child');

    // Xử lý tìm kiếm
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const danhSachGiaPha = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');
        const filteredData = danhSachGiaPha.filter(giaPha => 
            giaPha.ten.toLowerCase().includes(searchTerm) ||
            giaPha.nguoiQuanLy.toLowerCase().includes(searchTerm)
        );
        renderGiaPhaList(filteredData);
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Xử lý lọc theo trạng thái
    statusFilter.addEventListener('change', function() {
        const selectedStatus = this.value.toLowerCase();
        const danhSachGiaPha = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');
        let filteredData = danhSachGiaPha;

        if (selectedStatus !== 'tất cả trạng thái') {
            filteredData = danhSachGiaPha.filter(giaPha => 
                getTrangThaiText(giaPha.trangThai).toLowerCase() === selectedStatus
            );
        }
        renderGiaPhaList(filteredData);
    });

    // Xử lý sắp xếp
    sortFilter.addEventListener('change', function() {
        const sortBy = this.value;
        const danhSachGiaPha = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');
        
        const sortedData = [...danhSachGiaPha].sort((a, b) => {
            switch(sortBy) {
                case 'Mới nhất':
                    return new Date(b.ngayTao) - new Date(a.ngayTao);
                case 'Cũ nhất':
                    return new Date(a.ngayTao) - new Date(b.ngayTao);
                case 'Số thành viên':
                    return b.soThanhVien - a.soThanhVien;
                default:
                    return 0;
            }
        });

        renderGiaPhaList(sortedData);
    });

    // Xử lý form submit
    document.getElementById('giaPhaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nguoiQuanLySelect = document.getElementById('nguoiQuanLy');
        const selectedOption = nguoiQuanLySelect.options[nguoiQuanLySelect.selectedIndex];
        
        // Lấy danh sách gia phả từ localStorage
        let danhSachGiaPha = JSON.parse(localStorage.getItem('danhSachGiaPha') || '[]');
        
        if (currentGiaPhaId) {
            // Chế độ tạo mới
            const formData = {
                id: 'GP' + Date.now(),
                ten: document.getElementById('tenGiaPha').value,
                nguoiQuanLy: selectedOption.text,
                moTa: document.getElementById('moTa').value,
                trangThai: document.getElementById('trangThai').value,
                soThanhVien: 1,
                ngayTao: new Date().toLocaleDateString('vi-VN')
            };
            danhSachGiaPha.push(formData);
            alert('Tạo gia phả mới thành công!');
            
            // Kích hoạt sự kiện storage để cập nhật hoạt động gần đây
            window.dispatchEvent(new Event('storage'));
        }
        renderGiaPhaList(filteredData);
    });
});

function getTrangThaiText(trangThai) {
    return trangThai === 'active' ? 'Hoạt động' : 'Tạm khóa';
}