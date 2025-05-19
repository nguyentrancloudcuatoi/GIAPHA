document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    menuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !menuBtn.contains(event.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Xử lý hiển thị/ẩn mật khẩu
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Xử lý tải lên logo mới
    const logoInput = document.createElement('input');
    logoInput.type = 'file';
    logoInput.accept = 'image/*';
    logoInput.style.display = 'none';
    document.body.appendChild(logoInput);

    const uploadBtn = document.querySelector('.upload-btn');
    const logoPreview = document.querySelector('.logo-preview img');
    const removeBtn = document.querySelector('.remove-btn');

    uploadBtn.addEventListener('click', () => logoInput.click());

    logoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    removeBtn.addEventListener('click', function() {
        logoPreview.src = '/assets/images/Logo.png';
        logoInput.value = '';
    });

    // Xử lý lưu thay đổi cho các form
    const forms = document.querySelectorAll('.settings-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hiển thị thông báo thành công
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.style.position = 'fixed';
            successMessage.style.top = '20px';
            successMessage.style.right = '20px';
            successMessage.style.padding = '1rem 2rem';
            successMessage.style.borderRadius = '8px';
            successMessage.style.backgroundColor = '#48BB78';
            successMessage.style.color = 'white';
            successMessage.style.zIndex = '1000';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Lưu thay đổi thành công!';
            
            document.body.appendChild(successMessage);
            
            // Xóa thông báo sau 3 giây
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    });

    // Xử lý đăng xuất
    const logoutBtns = document.querySelectorAll('.logout-btn, [onclick="handleLogout()"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });

    function handleLogout() {
        // Xóa dữ liệu đăng nhập
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        
        // Chuyển hướng về trang đăng nhập
        window.location.href = '/index.html';
    }
});