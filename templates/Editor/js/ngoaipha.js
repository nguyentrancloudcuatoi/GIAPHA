// Khởi tạo mảng lưu trữ bài viết
let posts = JSON.parse(localStorage.getItem('ngoaipha_posts')) || [];
let currentEditId = null;

// Hiển thị/ẩn trạng thái trống
function toggleEmptyState() {
    const emptyState = document.getElementById('empty-state');
    const postsContainer = document.getElementById('posts-container');
    
    if (posts.length === 0) {
        emptyState.style.display = 'flex';
        postsContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        postsContainer.style.display = 'block';
    }
}

// Hiển thị danh sách bài viết
function displayPosts(postsToShow = posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    
    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <h3>${post.title}</h3>
                <div class="post-actions">
                    <button onclick="editPost('${post.id}')" class="action-btn edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deletePost('${post.id}')" class="action-btn delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-footer">
                <span class="post-date">
                    <i class="fas fa-calendar"></i>
                    ${new Date(post.date).toLocaleDateString('vi-VN')}
                </span>
            </div>
        `;
        container.appendChild(postElement);
    });
    
    toggleEmptyState();
}

// Mở modal thêm bài viết
function openAddPostModal() {
    const modal = document.getElementById('postModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('postForm');
    
    modalTitle.textContent = 'Thêm bài viết mới';
    form.reset();
    currentEditId = null;
    modal.style.display = 'block';
    
    // Đặt ngày mặc định là ngày hiện tại
    document.getElementById('postDate').valueAsDate = new Date();
}

// Đóng modal
function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

// Xử lý submit form
function handlePostSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const date = document.getElementById('postDate').value;
    
    if (currentEditId) {
        // Cập nhật bài viết
        const index = posts.findIndex(p => p.id === currentEditId);
        posts[index] = { ...posts[index], title, content, date };
    } else {
        // Thêm bài viết mới
        const newPost = {
            id: Date.now().toString(),
            title,
            content,
            date,
            createdAt: new Date().toISOString()
        };
        posts.unshift(newPost);
    }
    
    localStorage.setItem('ngoaipha_posts', JSON.stringify(posts));
    displayPosts();
    closePostModal();
}

// Chỉnh sửa bài viết
function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    currentEditId = id;
    const modal = document.getElementById('postModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Chỉnh sửa bài viết';
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postDate').value = post.date;
    
    modal.style.display = 'block';
}

// Xóa bài viết
function deletePost(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('ngoaipha_posts', JSON.stringify(posts));
        displayPosts();
    }
}

// Tìm kiếm bài viết
function searchPosts() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm)
    );
    displayPosts(filteredPosts);
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
});