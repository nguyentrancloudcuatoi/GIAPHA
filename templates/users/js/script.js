document.addEventListener('DOMContentLoaded', function() {
    const avatarLink = document.getElementById('avatarLink');
    const popupMenu = document.getElementById('popupMenu');

    avatarLink.addEventListener('click', function(e) {
        e.preventDefault();
        popupMenu.classList.toggle('show');
    });

    // Đóng popup khi click ra ngoài
    document.addEventListener('click', function(e) {
        if (!avatarLink.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.classList.remove('show');
        }
    });
});