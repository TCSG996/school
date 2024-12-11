// 获取所有帖子
function fetchPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            renderPosts(posts);
        })
        .catch(error => console.error('Error:', error));
}

// 创建新帖子
function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;

    if (!title || !content || !category) {
        alert('请填写完整信息！');
        return;
    }

    const post = {
        title: title,
        content: content,
        category: category,
        userId: 1 // 假设用户ID为1
    };

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
    })
    .then(response => response.json())
    .then(newPost => {
        fetchPosts(); // 重新加载帖子列表
        clearPostForm();
    })
    .catch(error => console.error('Error:', error));
}

// 点赞帖子
function likePost(postId) {
    fetch(`/api/posts/like/${postId}`, {
        method: 'PUT'
    })
    .then(response => {
        if (response.ok) {
            fetchPosts(); // 重新加载帖子列表
        }
    })
    .catch(error => console.error('Error:', error));
}

// 页面加载时获取帖子
document.addEventListener('DOMContentLoaded', function() {
    fetchPosts();
}); 